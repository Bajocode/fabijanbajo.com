import React from 'react';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ProfileBg from './ProfileBg';

const Home: React.FC = () => (
  <div>
    <SkillsSection />
    <AboutSection />
    <ProfileBg />
  </div>
);

export default Home;
