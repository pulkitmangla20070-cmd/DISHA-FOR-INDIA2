import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { programApi } from '../services/api';
import { ProgramCard } from '../components/ProgramCard';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await programApi.getAll();
        setPrograms(response.data?.programs || response.programs || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch programs');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [user]);

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
      <h2 style={{ marginBottom: '1.5rem' }}>Browse Opportunities</h2>
      <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
        Discover social campaigns, teaching initiatives, and ecological programs you can join.
      </p>
      {programs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-body)', fontSize: '1.1rem' }}>No programs available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program._id || program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;



