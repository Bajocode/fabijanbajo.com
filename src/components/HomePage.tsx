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
          I build many things, try to learn everything I can, the inner workings of technology, the meat, connecting the dots across various domains in the hope to solve a big problem soon (at a company or my own thingy, I don’t care, I just want to be part of something big with passionate people). Having fulfilled both dev-ops and software engineering roles, from migrating an on-premise e-com platform to the cloud, to consulting a blockchain team in Paris on cloud-native infrastructures and developing mobile apps myself, I tend to go vertical in terms of knowledge expansion. At the moment I’m a dev-ops engineer / solutions architect for an international blockchain project, before this an engineering lead and full-stack mobile developer, but yeah, titles, who cares… I work hard and get shit done. I geek out on software architectures, design patterns and infrastructure design, reading those nerdy Martin Fowler books etc.
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
