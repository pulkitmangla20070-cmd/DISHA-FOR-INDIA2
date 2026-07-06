const User = require('../user/user.model');
const Program = require('../program/program.model');
const Application = require('../application/application.model');
const { PROGRAM_STATUS } = require('../program/program.constants');
const { MATCHING_WEIGHTS } = require('./matching.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class MatchingService {
  async getProgramRecommendations(user, query) {
    const targetUserId = query.userId || user.id;

    const targetUser = await User.findById(targetUserId).select(
      'name skills interests languages availability city state hoursCompleted certificatesEarned programsCompleted programsJoined role'
    );

    if (!targetUser) {
      throw new NotFoundError('User not found');
    }

    // Access control: only allow self or admin/coordinator to view another user's recommendations
    if (targetUserId !== user.id && user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'coordinator') {
      throw new NotFoundError('User not found');
    }

    const programs = await Program.find({ status: PROGRAM_STATUS.PUBLISHED, isDeleted: false }).lean();

    const recommendations = programs.map((program) => this._calculateMatchScore(targetUser, program));

    recommendations.sort((a, b) => b.score - a.score);

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(query.limit, 10) || 10), 50);
    const start = (page - 1) * limit;
    const paginated = recommendations.slice(start, start + limit);

    return {
      recommendations: paginated,
      pagination: {
        total: recommendations.length,
        page,
        limit,
        totalPages: Math.ceil(recommendations.length / limit),
        hasNextPage: start + limit < recommendations.length,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getVolunteerRecommendations(user, query) {
    const programId = query.programId;
    if (!programId) {
      throw new ValidationError('programId is required');
    }

    const program = await Program.findById(programId).lean();
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    const volunteers = await User.find({ role: 'volunteer', isDeleted: false })
      .select(
        'name skills interests languages availability city state hoursCompleted certificatesEarned programsCompleted programsJoined'
      )
      .lean();

    const recommendations = volunteers.map((volunteer) => this._calculateMatchScore(volunteer, program));
    recommendations.sort((a, b) => b.score - a.score);

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(query.limit, 10) || 10), 50);
    const start = (page - 1) * limit;
    const paginated = recommendations.slice(start, start + limit);

    return {
      recommendations: paginated,
      pagination: {
        total: recommendations.length,
        page,
        limit,
        totalPages: Math.ceil(recommendations.length / limit),
        hasNextPage: start + limit < recommendations.length,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getDetailedRecommendation(user, query) {
    const programId = query.programId;
    if (!programId) {
      throw new ValidationError('programId is required');
    }

    const targetUserId = query.userId || user.id;
    const volunteer = await User.findById(targetUserId).lean();
    if (!volunteer) {
      throw new NotFoundError('User not found');
    }

    if (targetUserId !== user.id && user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'coordinator') {
      throw new NotFoundError('User not found');
    }

    const program = await Program.findById(programId).lean();
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    const pastApplications = await Application.find({
      user: targetUserId,
      status: { $in: ['joined', 'completed'] },
      isDeleted: false,
    })
      .populate('program', 'tags category')
      .lean();

    const relatedPastProgramCount = pastApplications.filter((app) => {
      if (!app.program) return false;
      const pTags = (app.program.tags || []).map((t) => t.toLowerCase());
      const pCat = (app.program.category || '').toLowerCase();
      const vSkills = (volunteer.skills || []).map((s) => s.toLowerCase());
      const vInterests = (volunteer.interests || []).map((s) => s.toLowerCase());
      return (
        vSkills.some((s) => pTags.includes(s) || pCat.includes(s)) ||
        vInterests.some((i) => pTags.includes(i) || pCat.includes(i))
      );
    }).length;

    const detail = this._calculateMatchScore(volunteer, program, relatedPastProgramCount, true);
    return detail;
  }

  _normalize(arr) {
    return (arr || [])
      .map((s) => (typeof s === 'string' ? s.toLowerCase().trim() : ''))
      .filter(Boolean);
  }

  _calculateMatchScore(volunteer, program, relatedPastProgramCount = 0) {
    const volunteerSkills = this._normalize(volunteer.skills);
    const volunteerInterests = this._normalize(volunteer.interests);
    const volunteerLanguages = this._normalize(volunteer.languages);
    const volunteerAvailability = this._normalize(volunteer.availability);

    const programTags = this._normalize(program.tags);
    const programCategory = (program.category || '').toLowerCase().trim();
    const programText = [program.title || '', program.shortDescription || '', program.description || '']
      .join(' ')
      .toLowerCase();

    // Skills
    const matchedSkills = volunteerSkills.filter((skill) =>
      programTags.includes(skill) || programCategory.includes(skill) || skill.includes(programCategory)
    );
    const skillScore =
      volunteerSkills.length > 0
        ? (matchedSkills.length / volunteerSkills.length) * MATCHING_WEIGHTS.SKILLS
        : 0;

    // Interests
    const matchedInterests = volunteerInterests.filter((interest) =>
      programTags.includes(interest) || programCategory.includes(interest) || interest.includes(programCategory)
    );
    const interestScore =
      volunteerInterests.length > 0
        ? (matchedInterests.length / volunteerInterests.length) * MATCHING_WEIGHTS.INTERESTS
        : 0;

    // Languages
    const matchedLanguages = volunteerLanguages.filter(
      (lang) =>
        programTags.includes(lang) ||
        programCategory.includes(lang) ||
        lang.includes(programCategory) ||
        programText.includes(lang)
    );
    const languageScore =
      volunteerLanguages.length > 0
        ? (matchedLanguages.length / volunteerLanguages.length) * MATCHING_WEIGHTS.LANGUAGES
        : 0;

    // Location
    const vCity = (volunteer.city || '').toLowerCase().trim();
    const vState = (volunteer.state || '').toLowerCase().trim();
    const pCity = (program.city || '').toLowerCase().trim();
    const pState = (program.state || '').toLowerCase().trim();

    let locationScore = 0;
    if (vCity && pCity && vCity === pCity) {
      locationScore += MATCHING_WEIGHTS.LOCATION / 2;
    }
    if (vState && pState && vState === pState) {
      locationScore += MATCHING_WEIGHTS.LOCATION / 2;
    }

    // Availability
    let availabilityScore = 0;
    if (volunteerAvailability.length > 0) {
      const hasFlexible = volunteerAvailability.some((a) => a === 'flexible');
      availabilityScore = hasFlexible ? MATCHING_WEIGHTS.AVAILABILITY : MATCHING_WEIGHTS.AVAILABILITY / 2;
    }

    // Previous Programs / Experience
    let previousProgramScore = 0;
    if (relatedPastProgramCount > 0) {
      previousProgramScore = Math.min(MATCHING_WEIGHTS.PREVIOUS_PROGRAMS, 5 + relatedPastProgramCount * 5);
    } else {
      previousProgramScore = Math.min(
        (volunteer.hoursCompleted || 0) / 100 * (MATCHING_WEIGHTS.PREVIOUS_PROGRAMS / 2) +
          (volunteer.certificatesEarned || 0) / 5 * (MATCHING_WEIGHTS.PREVIOUS_PROGRAMS / 4) +
          (volunteer.programsCompleted || 0) / 10 * (MATCHING_WEIGHTS.PREVIOUS_PROGRAMS / 4),
        MATCHING_WEIGHTS.PREVIOUS_PROGRAMS
      );
    }

    const totalScore = Math.round(
      Math.min(
        skillScore +
          interestScore +
          languageScore +
          locationScore +
          availabilityScore +
          previousProgramScore,
        100
      )
    );

    // Missing skills: program tags not matched by volunteer skills or interests
    const allVolunteerKeywords = [...new Set([...volunteerSkills, ...volunteerInterests])];
    const missingSkills = programTags.filter((tag) => !allVolunteerKeywords.some((kw) => kw.includes(tag) || tag.includes(kw)));

    // Matching skills
    const matchingSkillsList = [...new Set(matchedSkills)];

    // Reason for recommendation
    const reasons = [];
    if (matchedSkills.length > 0) reasons.push(`Skills: ${matchedSkills.join(', ')}`);
    if (matchedInterests.length > 0) reasons.push(`Interests: ${matchedInterests.join(', ')}`);
    if (vCity && pCity && vCity === pCity) reasons.push(`Same city: ${vCity}`);
    if (vState && pState && vState === pState) reasons.push(`Same state: ${vState}`);
    if ((volunteer.hoursCompleted || 0) > 50) reasons.push('Experienced volunteer');
    if (relatedPastProgramCount > 0) reasons.push(`Related experience in ${relatedPastProgramCount} program(s)`);

    const reason = reasons.length > 0 ? reasons.join('; ') : 'General profile compatibility';

    const result = {
      score: totalScore,
      matchingSkills: matchingSkillsList,
      missingSkills,
      reasonForRecommendation: reason,
    };

    if (program._id) {
      result.programId = program._id;
      result.programTitle = program.title;
      result.programCity = program.city;
      result.programState = program.state;
      result.programTags = program.tags;
      result.programCategory = program.category;
    }

    if (volunteer._id) {
      result.volunteerId = volunteer._id;
      result.volunteerName = volunteer.name;
      result.volunteerCity = volunteer.city;
      result.volunteerState = volunteer.state;
      result.volunteerSkills = volunteer.skills;
    }

    return result;
  }
}

module.exports = new MatchingService();
