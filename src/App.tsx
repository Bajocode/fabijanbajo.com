import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import PostsSection from './components/PostsSection';
import ContactSection from './components/ContactSection';
import Post from './components/Post';
import ProfileBg from './components/ProfileBg';
import Footer from './components/Footer';

const body = "# Title\n ## Introduction\n This post is about\n ### Funny info\n But also\n ## Code\n ```typescript\n const helloWorld = 'Hello world!';\n console.log(`just and example`);\n```";

const App: React.FC = () => (
  <div className="container pt-4 mt-4">
    <BrowserRouter>
      <Navbar />
      <Route exact path="/" component={AboutSection} />
      <Route exact path="/" component={PostsSection} />
      <Route exact path="/" component={ContactSection} />
      <Route exact path="/" component={ProfileBg} />
      <Route path="/blog/0" render={() => <Post title="" body={body} />} />
    </BrowserRouter>
    <Footer />
  </div>
);

export default App;
