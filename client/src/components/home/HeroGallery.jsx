import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroGalleryData } from '../../data/heroGalleryData';

const SLIDE_INTERVAL = 5000;
const TRANSITION_DURATION = 0.7;
const KEN_BURNS_DURATION = SLIDE_INTERVAL / 1000 + 2;
const NAVBAR_HEIGHT = 76;

const slideVariants = (reduceMotion) => ({
  enter: (direction) => ({
    x: reduceMotion ? 0 : (direction > 0 ? 60 : -60),
    opacity: 0,
    scale: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'tween', duration: TRANSITION_DURATION, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: TRANSITION_DURATION, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: (direction) => ({
    x: reduceMotion ? 0 : (direction > 0 ? -60 : 60),
    opacity: 0,
    scale: 1,
    transition: {
      x: { type: 'tween', duration: TRANSITION_DURATION, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: TRANSITION_DURATION, ease: [0.16, 1, 0.3, 1] },
    },
  }),
});

const arrowBaseStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.35)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  outline: 'none',
};

const HeroGallery = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [arrowHover, setArrowHover] = useState({ left: false, right: false });
  const slideCount = heroGalleryData.length;

  const current = ((page % slideCount) + slideCount) % slideCount;
  const nextSlide = (((page + 1) % slideCount) + slideCount) % slideCount;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = heroGalleryData[nextSlide].image;
  }, [nextSlide]);

  const paginate = useCallback((newDirection) => {
    setPage((prev) => [prev[0] + newDirection, newDirection]);
  }, []);

  const goToSlide = useCallback((index) => {
    const dir = index > current ? 1 : -1;
    setPage([index, dir]);
  }, [current]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => paginate(1), SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [paginate, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); paginate(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); paginate(-1); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (distance > 50) paginate(1);
    if (distance < -50) paginate(-1);
    setTouchStart(null);
  };

  const currentSlide = heroGalleryData[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{
        height: '100vh',
        paddingTop: NAVBAR_HEIGHT,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero photo gallery"
      aria-roledescription="carousel"
      aria-live="polite"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants(reduceMotion)}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.0 }}
            animate={{ scale: reduceMotion ? 1 : 1.08 }}
            transition={{ duration: KEN_BURNS_DURATION, ease: 'linear' }}
            className="absolute inset-0"
          >
            <img
              src={currentSlide.image}
              srcSet={`
                ${currentSlide.imageSmall} 800w,
                ${currentSlide.image} 1920w
              `}
              sizes="100vw"
              alt={currentSlide.alt}
              loading={page === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={page === 0 ? 'high' : 'auto'}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Premium Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between z-20 pointer-events-none" style={{ paddingTop: NAVBAR_HEIGHT }}>
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous slide"
          className="pointer-events-auto flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          style={{
            ...arrowBaseStyle,
            width: 40,
            height: 40,
            marginLeft: 48,
            transform: arrowHover.left ? 'scale(0.92)' : 'scale(1)',
            background: arrowHover.left ? '#D35400' : 'rgba(255,255,255,0.18)',
            borderColor: arrowHover.left ? '#D35400' : 'rgba(255,255,255,0.35)',
          }}
          onMouseEnter={() => setArrowHover((prev) => ({ ...prev, left: true }))}
          onMouseLeave={() => setArrowHover((prev) => ({ ...prev, left: false }))}
        >
          <ChevronLeft size={20} strokeWidth={2.5} color="white" />
        </button>
        <button
          onClick={() => paginate(1)}
          aria-label="Next slide"
          className="pointer-events-auto flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          style={{
            ...arrowBaseStyle,
            width: 40,
            height: 40,
            marginRight: 48,
            transform: arrowHover.right ? 'scale(0.92)' : 'scale(1)',
            background: arrowHover.right ? '#D35400' : 'rgba(255,255,255,0.18)',
            borderColor: arrowHover.right ? '#D35400' : 'rgba(255,255,255,0.35)',
          }}
          onMouseEnter={() => setArrowHover((prev) => ({ ...prev, right: true }))}
          onMouseLeave={() => setArrowHover((prev) => ({ ...prev, right: false }))}
        >
          <ChevronRight size={20} strokeWidth={2.5} color="white" />
        </button>
      </div>

      {/* Elegant Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {heroGalleryData.map((_, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={isActive ? 'true' : 'false'}
              className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{
                width: isActive ? 24 : 8,
                height: 8,
                background: isActive ? '#D35400' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scale(1)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default HeroGallery;
