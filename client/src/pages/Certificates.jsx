import React, { useEffect, useState } from 'react';
import { Award, Download, CheckCircle2 } from 'lucide-react';
import { certificateApi } from '../services/api';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificateApi.getMyCertificates();
        setCertificates(response.data?.certificates || response.certificates || response || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
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
      <h2 style={{ marginBottom: '1.5rem' }}>Your Earned Certificates</h2>
      <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
        Download secure, shareable, and verifiable PDF certificates for programs you've successfully completed.
      </p>

      {certificates.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-body)', fontSize: '1.1rem' }}>No certificates earned yet. Complete programs to earn certificates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {certificates.map((cert) => (
            <div key={cert._id || cert.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)' }}>
                    <Award size={28} />
                  </div>
                  <span className="badge badge-green" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <CheckCircle2 size={12} /> Verifiable
                  </span>
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{cert.name || cert.title || 'Certificate'}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '1.5rem' }}>
                  {cert.description || 'Awarded for successful program completion.'}
                </p>
              </div>
              <a
                href={cert.downloadUrl || cert.pdfUrl || '#'}
                className="btn btn-primary"
                style={{ display: 'flex', gap: '0.5rem', width: '100%' }}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!cert.downloadUrl && !cert.pdfUrl) {
                    e.preventDefault();
                  }
                }}
              >
                <Download size={16} /> Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
