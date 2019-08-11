import React from 'react';
import AboutSection from './AboutSection';
import PostsSection from './PostsSection';
import ContactSection from './ContactSection';
import ProfileBg from './ProfileBg';

const Home: React.FC = () => (
  <div>
    <AboutSection />
    <PostsSection />
    <ContactSection />
    <ProfileBg />
  </div>
);

export default Home;
