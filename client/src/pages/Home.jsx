import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { Megaphone } from 'lucide-react';

// Components
import HeroGallery from '../components/home/HeroGallery';
import TrustBar from '../components/home/TrustBar';
import ImpactStats from '../components/home/ImpactStats';
import WhatWeDo from '../components/home/WhatWeDo';
import HowYouCanHelp from '../components/home/HowYouCanHelp/HowYouCanHelp';
import WhyDFI from '../components/home/WhyDFI';
import VolunteerJourney from '../components/home/VolunteerJourney';
import VoiceOfImpact from '../components/home/VoiceOfImpact/VoiceOfImpact';
import TestimonialSpotlight from '../components/home/TestimonialSpotlight/TestimonialSpotlight';
import ImpactTransparency from '../components/home/ImpactTransparency/ImpactTransparency';
import FounderSpotlight from '../components/home/FounderSpotlight/FounderSpotlight';
import Gallery from '../components/home/Gallery';
import LeaderboardPreview from '../components/home/LeaderboardPreview';
import Blogs from '../components/home/Blogs';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';
const Home = () => {
  const { announcements } = useAdminData();
  const activeAnnouncements = announcements?.filter(a => a.status === 'published' || a.status === 'scheduled') || [];

  return (
    <div className="home-container bg-brandBg font-primary">
      {activeAnnouncements.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
          color: 'white',
          padding: '0.6rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 50,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.15)',
            padding: '0.3rem 0.65rem',
            borderRadius: 6,
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <Megaphone size={14} />
            News
          </div>
          <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)' }}>
            <div style={{ 
              display: 'inline-block', 
              paddingLeft: '100%', 
              animation: 'marquee 30s linear infinite',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}>
              {activeAnnouncements.map((a, i) => (
                <span key={a.id || a._id || i} style={{ marginRight: '4rem' }}>
                  <strong style={{ fontWeight: 700 }}>{a.title}</strong>  —  {a.message}
                </span>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee {
              0%   { transform: translate(0, 0); }
              100% { transform: translate(-100%, 0); }
            }
          `}</style>
        </div>
      )}
      <HeroGallery />
      <TrustBar />
      <ImpactStats />
      <WhatWeDo />
      <HowYouCanHelp />
      <VoiceOfImpact />
      <TestimonialSpotlight />
      <ImpactTransparency />
      <FounderSpotlight />
      <WhyDFI />
      <VolunteerJourney />
      <Gallery />
      <LeaderboardPreview />
      <Blogs />
      <FAQ />
      <CTA />
    </div>
  );
};

export default Home;
