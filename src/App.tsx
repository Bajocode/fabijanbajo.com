import React from 'react';
import { useRoutes } from 'hookrouter';
import Home from './components/Home';
import NavBar from './components/Navbar';
import Footer from './components/Footer';

const routes = {
  '/': () => <Home />,
};

const App: React.FC = () => (
  <div className="container pt-4 mt-4">
    <NavBar />
    {useRoutes(routes)}
    <Footer />
  </div>
);

export default App;
