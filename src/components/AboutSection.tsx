import React from 'react';

const AboutSection: React.FC = () => (
  <section className="jumbotron jumbotron-transparent text-center ">
    <div className="container">
      <div className="col-lg-8 col-md-10 mx-auto">
        <h1 className="display-1 text-white">Hi,</h1>
        <div className="my-5" />
        <p className="text-muted line-height-250">
            I'm Fabijan, I design, build and analyze (distributed) systems, trying to connect the dots across various domains (at a company or my own thingy, as long as I'm part of something big with passionate people).
        </p>
      </div>
    </div>
  </section>
);

export default AboutSection;
