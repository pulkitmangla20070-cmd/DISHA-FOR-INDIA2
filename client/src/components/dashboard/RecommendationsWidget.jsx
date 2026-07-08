import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import RecommendationCard from './RecommendationCard';

const mockRecommendations = [
  { programId: 'p1', programTitle: 'Tech Education Drive', reasonForRecommendation: 'Matches your IT skills and weekend availability.', priority: 'High', score: 95 },
  { programId: 'p2', programTitle: 'Community Health Camp', reasonForRecommendation: 'Looking for general volunteers this Sunday.', priority: 'Medium', score: 82 },
];

const RecommendationsWidget = ({ compact = false }) => {
  const [recommendations, setRecommendations] = React.useState(() => {
    try {
      const saved = localStorage.getItem('admin_recommendations_state');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return mockRecommendations;
  });

  const handleRemove = (id) => {
    setRecommendations(prev => {
      const next = prev.filter(r => r.programId !== id);
      localStorage.setItem('admin_recommendations_state', JSON.stringify(next));
      return next;
    });
  };

  if (compact) {
    return (
      <div style={{ background: 'white', borderRadius: 16, padding: '1.25rem 1.5rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--color-heading)', fontWeight: 700, margin: 0 }}>
            Top Recommendations
          </h3>
          <Link to="/matching/programs" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {recommendations.map((rec) => (
            <div key={rec.programId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid #F0EDE8', background: '#FDFBF7' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 0.15rem 0' }}>
                  {rec.programTitle}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-body)', margin: 0 }}>
                  {rec.reasonForRecommendation}
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', marginLeft: '0.75rem' }}>
                {rec.score}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Sparkles size={18} color="#D35400" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#1e293b', fontWeight: 700, margin: 0 }}>
            Matching Recommendations
          </h3>
        </div>
        <Link to="/matching/programs" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
          View All <ChevronRight size={14} />
        </Link>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1rem' }}>
        {recommendations.length > 0 ? recommendations.map((rec) => (
          <RecommendationCard
            key={rec.programId}
            recommendation={{
              id: rec.programId,
              title: rec.programTitle,
              description: rec.reasonForRecommendation,
              reason: rec.reasonForRecommendation,
              priority: rec.priority,
              score: rec.score,
            }}
            onSavedChange={(id) => handleRemove(id)}
            onDismissed={(id) => handleRemove(id)}
          />
        )) : (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
            All caught up! No new recommendations.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsWidget;
