import React from 'react';
import ProjectCardContainer from './ProjectCardContainer';

const Projects: React.FC = () => (
  <section>
    <h2 className="text-center text-light">Projects</h2>
    <ProjectCardContainer projectsUrl="projects.json" />
  </section>
);

export default Projects;
