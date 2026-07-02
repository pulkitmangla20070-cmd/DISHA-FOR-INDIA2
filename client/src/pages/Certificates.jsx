import React, { useState, useEffect } from 'react';
import { Award, Download, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import certificateService from '../services/certificateService';
import toast from 'react-hot-toast';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await certificateService.getMyCertificates();
        if (res.success) {
          setCertificates(res.data?.certificates || []);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handleDownload = async (id, title) => {
    try {
      setDownloadingId(id);
      const res = await certificateService.downloadCertificate(id);
      // res is a Blob
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };
  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Your Earned Certificates</h2>
      <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
        Download secure, shareable, and verifiable PDF certificates for programs you've successfully completed.
      </p>

      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', gridColumn: 'span 2' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto', marginBottom: '1rem', color: 'var(--color-primary)' }} />
            <p>Loading your certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem 2rem' }}>
            <FileText size={48} style={{ color: 'var(--color-border)', margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Certificates Yet</h3>
            <p style={{ color: 'var(--color-body)' }}>Complete programs and log your hours to earn certificates!</p>
          </div>
        ) : (
          certificates.map(cert => (
            <div key={cert._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)' }}>
                    <Award size={28} />
                  </div>
                  <span className="badge badge-green" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <CheckCircle2 size={12} /> Verifiable
                  </span>
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{cert.program?.title || 'Program Completion'}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '0.5rem' }}>
                  Issued on: {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-body)', marginBottom: '1.5rem', opacity: 0.8 }}>
                  ID: {cert.certificateNumber}
                </p>
              </div>
              <button 
                onClick={() => handleDownload(cert._id, cert.program?.title || 'Certificate')}
                className="btn btn-primary" 
                style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
                disabled={downloadingId === cert._id}
              >
                {downloadingId === cert._id ? (
                  <><Loader2 size={16} className="animate-spin" /> Downloading...</>
                ) : (
                  <><Download size={16} /> Download PDF</>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Certificates;
