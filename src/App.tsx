import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Post from './components/Post';
import ProfileBg from './components/ProfileBg';
import Footer from './components/Footer';

const App: React.FC = () => (
  <div className="container pt-4 mt-4">
    <BrowserRouter>
      <Navbar />
      <Route exact path="/" component={About} />
      <Route path="/post" render={() => <Post markdownContent="" />} />
    </BrowserRouter>
    <ProfileBg />
    <Footer />
  </div>
);

export default App;
