import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Contact from './components/Contact';

const App: React.FC = () => (
  <div>
    <BrowserRouter>
      <div>
        <Navbar />
        <div className="container pt-4 mt-4">
          <Route exact path="/" component={About} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </div>
      </div>
    </BrowserRouter>
  </div>
);

export default App;
