import React from 'react';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ProfileBg from './ProfileBg';
import PostsSection from './PostsSection';

const Home: React.FC = () => (
  <div className="container pt-4 mt-4">
    <PostsSection />
    // <SkillsSection />
    <AboutSection />
    <ProfileBg />
  </div>
);

export default Home;
