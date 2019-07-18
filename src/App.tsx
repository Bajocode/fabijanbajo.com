import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Post from './components/Post';
import ProfileBg from './components/ProfileBg';
import Footer from './components/Footer';
import PostCardContainer from './components/PostCardContainer';

const body = "# Title\n ## Introduction\n This post is about\n ### Funny info\n But also\n ## Code\n ```typescript\n const helloWorld = 'Hello world!';\n console.log(`just and example`);\n```";

const App: React.FC = () => (
  <div className="container pt-4 mt-4">
    <BrowserRouter>
      <Navbar />
      <Route exact path="/" component={About} />
      <Route exact path="/" render={() => <PostCardContainer postsUrl="posts.json" />} />
      <Route exact path="/" component={ProfileBg} />
      <Route path="/blog/0" render={() => <Post title="" body={body} />} />
    </BrowserRouter>
    <Footer />
  </div>
);

export default App;
