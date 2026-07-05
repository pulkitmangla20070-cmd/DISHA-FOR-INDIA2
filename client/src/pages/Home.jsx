import React from 'react';

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
import Gallery from '../components/home/Gallery';
import Benefits from '../components/home/Benefits';
import LeaderboardPreview from '../components/home/LeaderboardPreview';
import Blogs from '../components/home/Blogs';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';
import FounderMessage from "../components/home/FounderMessage";
const Home = () => {
  return (
    <div className="home-container bg-brandBg font-primary">
      <HeroGallery />
      <TrustBar />
      <ImpactStats />
      <WhatWeDo />
      <HowYouCanHelp />
      <VoiceOfImpact />
      <TestimonialSpotlight />
      <WhyDFI />
      <VolunteerJourney />
      <FounderMessage />
      <Gallery />
      <Benefits />
      <LeaderboardPreview />
      <Blogs />
      <FAQ />
      <CTA />
    </div>
  );
};

export default Home;
