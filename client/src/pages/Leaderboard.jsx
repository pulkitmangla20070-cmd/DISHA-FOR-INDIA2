import React, { useEffect, useState } from 'react';
import { leaderboardApi } from '../services/api';

const Leaderboard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardApi.getAll();
        setVolunteers(response.data?.users || response.users || response || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loader" style={{ width: '48px', height: '48px', border: '4px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1.5rem 0' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--color-error)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{
        background: '#FEFCE8',
        border: '1px solid #FEF08A',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#FBBF24', fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
        <h2 style={{ color: '#713F12', marginBottom: '0.5rem' }}>Volunteer Leaderboard</h2>
        <p style={{ color: '#713F12', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          Celebrate our community leaders who are dedicating their time and effort to bring social impact across India.
        </p>
      </div>

      {volunteers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-body)', fontSize: '1.1rem' }}>No volunteers on the leaderboard yet.</p>
        </div>
      ) : (
        <div className="card">
          <h4 style={{ marginBottom: '1.25rem' }}>Top Contributors</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {volunteers.map((vol, index) => {
              const rank = index + 1;
              const badgeMap = {
                1: { badge: '🥇', color: '#FBBF24' },
                2: { badge: '🥈', color: '#CBD5E1' },
                3: { badge: '🥉', color: '#B45309' },
              };
              const volStyle = badgeMap[rank] || { badge: String(rank), color: 'transparent' };
              return (
                <div
                  key={vol._id || vol.id || rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: rank <= 3 ? 'rgba(254, 252, 232, 0.5)' : 'var(--color-card)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: volStyle.color !== 'transparent' ? volStyle.color : 'var(--color-border)',
                        color: rank <= 3 ? '#ffffff' : 'var(--color-body)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                      }}
                    >
                      {volStyle.badge}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', margin: 0 }}>{vol.name || 'Anonymous'}</h4>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>{vol.volunteerLevel || 'Volunteer'}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>{vol.points || 0}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-body)' }}>points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
