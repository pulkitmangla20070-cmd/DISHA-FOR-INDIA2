import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Disha for India Logo Transition
const PageTransitionOverlay = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show overlay on route change
    setIsVisible(true);
    // Hide after animation duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 800); // 800ms total transition time

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* The Logo Container */}
            <div style={{ display: 'flex', alignItems: 'flex-end', position: 'relative', marginBottom: '0.5rem' }}>
              
              {/* Big 'D' Symbol */}
              <svg width="64" height="84" viewBox="0 0 64 84" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                <path d="M32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64C35.2536 64 38.396 63.5042 41.3417 62.5855L36.8166 56.4019C35.2891 56.8043 33.6749 57.0182 32 57.0182C18.1882 57.0182 6.98182 45.8118 6.98182 32C6.98182 18.1882 18.1882 6.98182 32 6.98182C45.8118 6.98182 57.0182 18.1882 57.0182 32C57.0182 35.8078 56.166 39.414 54.6369 42.6617L59.7317 48.4239C62.4344 43.6052 64 37.9816 64 32C64 14.3269 49.6731 0 32 0Z" fill="#31398B"/>
                <rect x="29" y="8" width="6" height="76" fill="#31398B"/>
                <path d="M35 56L44.5 48L35 48V56Z" fill="#31398B"/>
                <path d="M12 70.5C12 70.5 19 82 32 82C45 82 56 73 56 73L54 68C54 68 45 76 32 76C19 76 15 67.5 15 67.5L12 70.5Z" fill="#31398B"/>
              </svg>

              {/* Text: isha for India */}
              <div style={{ paddingBottom: '12px' }}>
                <span style={{ 
                  fontFamily: 'Georgia, "Times New Roman", serif', 
                  fontSize: '3.5rem', 
                  color: '#31398B',
                  letterSpacing: '0.02em',
                  lineHeight: '1',
                }}>
                  isha &nbsp;for &nbsp;
                </span>
                <span style={{ 
                  fontFamily: 'Georgia, "Times New Roman", serif', 
                  fontSize: '3.8rem', 
                  color: '#5B636B',
                  letterSpacing: '0.02em',
                  lineHeight: '1',
                }}>
                  India
                </span>
              </div>
            </div>

            {/* Baseline border */}
            <div style={{ width: '100%', height: '3px', backgroundColor: '#31398B', marginBottom: '8px' }}></div>

            {/* Tagline */}
            <div style={{ 
              fontFamily: 'Arial, sans-serif', 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              color: '#222222', 
              letterSpacing: '0.08em',
              textAlign: 'center',
              width: '100%'
            }}>
              EMPOWERED SELF TO EMPOWERED SOCIETY
            </div>
            
            {/* Loading indicator */}
            <motion.div 
              animate={{ width: ["0%", "100%"] }} 
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                height: '2px',
                background: '#F26B2D',
                marginTop: '1.5rem',
                borderRadius: '2px',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransitionOverlay;
