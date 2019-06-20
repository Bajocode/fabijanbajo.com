import React from 'react';
import ProjectCardContainer from './ProjectCardContainer';

const HomePage: React.FC = () => (
  <div>
    <section className="jumbotron text-center">
      <div className="container">
        <h1 className="jumbotron-heading">Hi</h1>
        <p className="lead text-muted">Welcome to my portfolio, ta.</p>
        <p>
          <a href="google.com" className="btn btn-primary my-2">Main call to action</a>
          <a href="google.com" className="btn btn-secondary my-2">Secondary action</a>
        </p>
      </div>
    </section>
    <section>
      <ProjectCardContainer projectsUrl="projects.json" />
    </section>
  </div>
);

export default HomePage;
