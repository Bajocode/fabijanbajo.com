import React from 'react';
import ProjectCard from './ProjectCard';

interface Project {
  id: string;
  title: string;
  year: string;
  excerpt: string;
  imageUrl: string;
  projectUrl: string;
}

interface IProjectCardContainerProps {
  projectsUrl: string;
}

const ProjectCardContainer: React.FC<IProjectCardContainerProps> = (
  { projectsUrl }: IProjectCardContainerProps,
) => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const projectCards = projects.map(
    project => <ProjectCard key={project.id} {...project} />,
  );

  React.useEffect(() => {
    fetch(projectsUrl)
      .then(response => response.json())
      .then(json => {
        setProjects(json);
      });
  });

  return (
    <div className="mt-5 row">
      {projectCards}
    </div>
  );
};

export default ProjectCardContainer;
