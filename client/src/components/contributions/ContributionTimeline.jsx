import React from 'react';
import { motion } from 'framer-motion';

const ContributionTimeline = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
      {/* Connecting Line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 24,
          left: '10%',
          right: '10%',
          height: 2,
          background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
          opacity: 0.3,
          display: 'none',
        }}
        className="lg:block"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.25rem',
              position: 'relative',
            }}
          >
            {/* Icon Circle */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'white',
              border: '2px solid #F0EDE8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              boxShadow: '0 4px 20px rgba(211,84,0,0.1)',
              flexShrink: 0,
              zIndex: 2,
            }}>
              {typeof step.icon === 'string' ? (
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              ) : (
                <span style={{ color: 'var(--color-primary)' }}>{step.icon}</span>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingTop: '0.25rem' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-heading)', margin: '0 0 0.35rem' }}>
                {step.stage || step.title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                {step.description || step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContributionTimeline;
