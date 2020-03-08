import React from 'react';

interface ISkillsCardProps {
  title: string;
  body: string;
  imageUrl: string;
}

const SkillsCard: React.FC<ISkillsCardProps> = (
  { title, body, imageUrl }: ISkillsCardProps,
) => (
  <li className="card">
    <div className="embed-responsive embed-responsive-21by9">
      <img className="card-img-top embed-responsive-item" src={imageUrl} alt="Skill icon" />
    </div>
    <div className="card-body text-center">
      <h5 className="card-title text-light">{title}</h5>
      <p className="text-muted">{body}</p>
    </div>
  </li>
);

export default SkillsCard;
