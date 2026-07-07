import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, Image, Play, FileArchive } from 'lucide-react';

const ContributionFiles = ({ files = [], links = {} }) => {
  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return <Image size={20} style={{ color: 'var(--color-secondary)' }} />;
    if (type?.startsWith('video/')) return <Play size={20} style={{ color: 'var(--color-purple)' }} />;
    if (type?.includes('pdf')) return <FileText size={20} style={{ color: 'var(--color-error)' }} />;
    return <FileArchive size={20} style={{ color: 'var(--color-primary)' }} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '1rem' }}>
        Files & Links
      </h4>
      {files.length === 0 && !Object.values(links).some(Boolean) && (
        <p style={{ color: 'var(--color-body)', fontSize: '0.9rem' }}>No files or links attached.</p>
      )}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-card)',
              }}
            >
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)' }}>
                {getFileIcon(file.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-body)' }}>{formatFileSize(file.size)}</div>
              </div>
              <button
                type="button"
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)', border: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}
              >
                <Download size={14} /> Download
              </button>
            </motion.div>
          ))}
        </div>
      )}
      {(links.githubUrl || links.figmaUrl || links.canvaUrl || links.googleDriveUrl) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.githubUrl && (
            <a href={links.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ExternalLink size={14} /> GitHub Repository
            </a>
          )}
          {links.figmaUrl && (
            <a href={links.figmaUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ExternalLink size={14} /> Figma Design
            </a>
          )}
          {links.canvaUrl && (
            <a href={links.canvaUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ExternalLink size={14} /> Canva Design
            </a>
          )}
          {links.googleDriveUrl && (
            <a href={links.googleDriveUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ExternalLink size={14} /> Google Drive
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ContributionFiles;
