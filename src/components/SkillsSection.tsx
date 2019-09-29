import React from 'react';
import SkillsCardContainer from './SkillsCardContainer';

const SkillsSection: React.FC = () => (
  <section className="mt-5">
    <div className="col-lg-8 col-md-10 mx-auto pt-5">
      <h2 className="text-center text-light">Skills</h2>
    </div>
    <SkillsCardContainer skillsUrl="skills.json" />
  </section>
);

export default SkillsSection;
