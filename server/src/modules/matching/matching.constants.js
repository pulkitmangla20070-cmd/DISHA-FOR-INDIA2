const MESSAGES = {
  PROGRAMS_RECOMMENDED: 'Program recommendations retrieved successfully',
  VOLUNTEERS_RECOMMENDED: 'Volunteer recommendations retrieved successfully',
  RECOMMENDATION_FETCHED: 'Detailed recommendation retrieved successfully',
};

const MATCHING_WEIGHTS = {
  SKILLS: 25,
  INTERESTS: 15,
  LANGUAGES: 10,
  LOCATION: 20,
  AVAILABILITY: 10,
  PREVIOUS_PROGRAMS: 10,
  RELIABILITY: 10,
};

module.exports = { MESSAGES, MATCHING_WEIGHTS };
