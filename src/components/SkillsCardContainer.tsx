import React from 'react';
import SkillsCard from './SkillsCard';

interface ISkill {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
}

interface ISkillsCardContainerProps {
  skillsUrl: string;
}

const PostCardContainer: React.FC<ISkillsCardContainerProps> = ({
  skillsUrl,
}: ISkillsCardContainerProps) => {
  const [skills, setSkills] = React.useState<ISkill[]>([]);
  const skillsCards = skills.map(
    skill => <SkillsCard key={skill.id} {...skill} />,
  );

  React.useEffect(() => {
    fetch(skillsUrl)
      .then(response => response.json())
      .then(json => setSkills(json));
  });

  return (
    <ul className="pl-0 pt-5">
      <div className="card-deck">
        {skillsCards}
      </div>
    </ul>
  );
};

export default PostCardContainer;
