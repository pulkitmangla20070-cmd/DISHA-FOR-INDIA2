import React from 'react';
import { ArrowRight } from 'lucide-react';
import './VoiceOfImpact.css';

const stories = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Education Volunteer',
    headline: 'Helping children discover the joy of learning.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    storyImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    storyImageAlt: 'Children reading and learning together in a classroom',
  },
  {
    id: 2,
    name: 'Aman Verma',
    role: 'Healthcare Volunteer',
    headline: 'Bringing healthcare camps to remote villages.',
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    storyImage: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    storyImageAlt: 'Doctor providing healthcare at a rural medical camp',
  },
  {
    id: 3,
    name: 'Neha Kapoor',
    role: 'Women Empowerment Volunteer',
    headline: 'Supporting women to become financially independent.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    storyImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800',
    storyImageAlt: 'Women gathered together in a self-help group session',
  },
];

const VoiceOfImpact = () => {
  return (
    <section className="voi-section" aria-labelledby="voi-heading">

      {/* Decorative elements */}
      <div className="voi-deco-quote" aria-hidden="true">"</div>
      <div className="voi-deco-blob voi-deco-blob-1" aria-hidden="true" />

      <div className="voi-container">

        {/* Section Header */}
        <div className="voi-header">
          <div className="voi-header-left">
            <span className="voi-accent">Volunteer Stories</span>
            <h2 id="voi-heading" className="voi-title">Voice of Impact</h2>
            <p className="voi-desc">
              Real stories from volunteers who are creating meaningful impact
              across communities across India.
            </p>
          </div>

          {/* Show All Stories link */}
          <a
            href="#"
            className="voi-show-all"
            aria-label="Show all volunteer stories"
          >
            Show All Stories
            <ArrowRight size={16} className="voi-show-all-arrow" />
          </a>
        </div>

        {/* Story Cards */}
        <div className="voi-grid">
          {stories.map((story) => (
            <article
              key={story.id}
              className="voi-card"
              tabIndex={0}
              aria-label={`Story by ${story.name}, ${story.role}`}
            >
              {/* Top: avatar + name/role */}
              <div className="voi-card-top">
                <div className="voi-avatar-wrap">
                  <img
                    src={story.profileImage}
                    alt={`Portrait of ${story.name}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <p className="voi-volunteer-name">{story.name}</p>
                  <p className="voi-volunteer-role">{story.role}</p>
                </div>
              </div>

              {/* Headline */}
              <h3 className="voi-headline">{story.headline}</h3>

              {/* Thumbnail image */}
              <div className="voi-thumb-wrap">
                <img
                  src={story.storyImage}
                  alt={story.storyImageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Read Story button */}
              <button
                className="voi-read-btn"
                aria-label={`Read the story of ${story.name}`}
              >
                Read Story
                <ArrowRight size={14} className="voi-read-arrow" />
              </button>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default VoiceOfImpact;
