import React from 'react';

interface IProjectCardProps {
  title: string;
  excerpt: string;
  year: string;
  imageUrl: string;
  projectUrl: string
}

const ProjectCard: React.FC<IProjectCardProps> = (
  {
    title,
    excerpt,
    year,
    imageUrl,
    projectUrl,
  }: IProjectCardProps,
) => (
  <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
    <div className="card card-bg">
      <div className="card-overlay" />
      <img className="card-img" src={imageUrl} alt="Card cap" />
      <div className="card-img-overlay">
        <h5 className="card-title text-white">{title}</h5>
        <p className="card-text text-light">{excerpt}</p>
        <p className="card-text">
          <small className="text-muted">{year}</small>
        </p>
      </div>
      <a className="stretched-link" href={projectUrl}> </a>
    </div>
  </div>
);

export default ProjectCard;
