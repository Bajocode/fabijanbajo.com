import React from 'react';
import { A } from 'hookrouter';

const Navbar: React.FC = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <A className="navbar-brand nav-link" href="/">Fabijan Bajo</A>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="navbar-nav mr-auto">
          <a className="nav-item nav-link" href="https://github.com/Bajocode">Github</a>
          <a className="nav-item nav-link" href="https://www.linkedin.com/in/fabijanbajo/">LinkedIn</a>
          <a className="nav-item nav-link" href="mailto:bajo09@gmail.com">Contact</a>
          // <a className="nav-item nav-link" href="Fabijan_Bajo_Resume.pdf">Resume</a>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
