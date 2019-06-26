import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import Post from './components/Post';

const App: React.FC = () => (
  <div>
    <BrowserRouter>
      <div>
        <Navbar />
        <div className="container pt-4 mt-4">
          <Route exact path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/post" render={() => <Post />} />
        </div>
      </div>
    </BrowserRouter>
  </div>
);

export default App;
