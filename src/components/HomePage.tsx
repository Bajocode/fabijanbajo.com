import React from 'react';
import Me from './Me';

const HomePage: React.FC = () => (
  <div>
    <section className="jumbotron jumbotron-transparent text-center ">
      <div className="container">
        <div className="col-lg-8 col-md-10 mx-auto">
          <h1 className="display-1 text-white">Hi,</h1>
          <div className="my-5" />
          <p className="text-muted line-height-250">
            I build stuff, try to learn everything I can, connecting the dots across various domains in the hope to solve a big problem soon (at a company or my own thingy, as long as I&apos;m part of something big with passionate people). Having fulfilled dev-ops and engineering roles, from migrating an on-premise e-com platform to the cloud, to consulting a blockchain team in Paris on cloud-native infrastructures and developing mobile apps myself, I tend to go vertical in terms of knowledge expansion. At the moment I’m a dev-ops engineer / solutions architect for an international blockchain project, but before this an engineering lead and full-stack mobile developer. I geek out on software architectures, patterns and infrastructure design, reading those nerdy Martin Fowler books etc.
          </p>
        </div>
      </div>
    </section>
    <section>
      <Me />
    </section>
  </div>
);

export default HomePage;
