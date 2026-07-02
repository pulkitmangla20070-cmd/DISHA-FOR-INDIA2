import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaderboardApi } from '../services/api';

const Leaderboard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await leaderboardApi.getAll();

        console.log('Leaderboard Response:', response);

        const leaderboardData = Array.isArray(response?.data?.leaderboard)
          ? response.data.leaderboard
          : [];

        setVolunteers(leaderboardData);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch leaderboard');
        setVolunteers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  if (loading) {
    return (
      <div
        className="flex-center"
        style={{ minHeight: '60vh' }}
      >
        <div
          className="loader"
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1.5rem 0' }}>
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <h3 style={{ color: 'var(--color-error)' }}>
            {error}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Header */}
      <div
        style={{
          background: '#FEFCE8',
          border: '1px solid #FEF08A',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '0.5rem',
          }}
        >
          🏆
        </div>

        <h2
          style={{
            color: '#713F12',
            marginBottom: '0.5rem',
          }}
        >
          Volunteer Leaderboard
        </h2>

        <p
          style={{
            color: '#713F12',
            opacity: 0.8,
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Celebrate our top volunteers who are creating impact across India.
        </p>
      </div>

      {volunteers.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3rem',
          }}
        >
          <h3>No volunteers on the leaderboard yet.</h3>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>
            Top Contributors
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {Array.isArray(volunteers) &&
              volunteers.map((vol, index) => {
                const rank = index + 1;

                const badge =
                  rank === 1
                    ? '🥇'
                    : rank === 2
                    ? '🥈'
                    : rank === 3
                    ? '🥉'
                    : rank;

                return (
                  <div
                    key={vol._id || rank}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: '#F3F4F6',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                        }}
                      >
                        {badge}
                      </div>

                      <div>
                        <h4
                          style={{
                            margin: 0,
                          }}
                        >
                          {vol.name || 'Anonymous'}
                        </h4>

                        <small>
                          {vol.volunteerLevel || 'Volunteer'}
                        </small>
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: 'var(--color-primary)',
                        }}
                      >
                        {vol.points || 0}
                      </h3>

                      <small>Points</small>
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