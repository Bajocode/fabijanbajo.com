import React, { useEffect } from 'react';
import ProjectCard from './ProjectCard';

interface Project {
  id: string;
  title: string;
  body: string;
  imgPath: string;
  imgAlt: string;
}

interface IProjectCardContainerProps {
  projectsUrl: string
}

const ProjectCardContainer: React.FC<IProjectCardContainerProps> = (
  { projectsUrl }: IProjectCardContainerProps,
) => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const projectCards = projects.map(
    project => <ProjectCard key={project.id} {...project} />,
  );

  useEffect(() => {
    fetch(projectsUrl)
      .then(projectsRes => projectsRes.json())
      .then(projectsJson => {
        setProjects(projectsJson);
      });
  });

  return (
    <div>
      <div className="mt-5 row">
        {projectCards}
      </div>
    </div>
  );
};

export default ProjectCardContainer;
