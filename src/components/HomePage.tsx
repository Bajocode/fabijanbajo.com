import React from 'react';
import Me from './Me';

const HomePage: React.FC = () => (
  <div>
    <section className="jumbotron text-center">
      <div className="container">
        <h1 className="jumbotron-heading display-1">Hi,</h1>
        <hr className="" />
        <hr className="" />
        <hr className="" />
        <p className="text-muted">
          I build stuff, try to learn everything I can, connecting the dots across various domains in the hope to solve a big problem soon (at a company or my own thingy, as long as I&apos;m part of something big with passionate people). Having fulfilled dev-ops and engineering roles, from migrating an on-premise e-com platform to the cloud, to consulting a blockchain team in Paris on cloud-native infrastructures and developing mobile apps myself, I tend to go vertical in terms of knowledge expansion. At the moment I’m a dev-ops engineer / solutions architect for an international blockchain project, but before this an engineering lead and full-stack mobile developer. I geek out on software architectures, patterns and infrastructure design, reading those nerdy Martin Fowler books etc.
        </p>
        <p>
          {/* <a href="google.com" className="btn btn-primary my-2">Main call to action</a>
          <a href="google.com" className="btn btn-secondary my-2">Secondary action</a> */}
        </p>
      </div>
    </section>
    <section>
      <Me />
    </section>
  </div>
);

export default HomePage;
