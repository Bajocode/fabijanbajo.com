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
          Welcome, I&apos;m Fabijan. I like building things, working on big projects, leading them and geeking out on new design patterns. I believe in learning about the inner workings of technology to architect and design proper solutions and in general have a stickability towards quality, a desire to do things right. Having fulfilled both dev-ops and software engineering roles, from migrating an on-premise e-com platform to the cloud, to consulting a blockchain team in Paris on cloud-native infrastructures to developing mobile apps, I tend to go vertical in terms of knowledge expansion. My current role could best be described as dev-ops engineer / solutions architect. Have a look at my personal portfolio projects, or just contact me for a chat, coffee or collab, or a really cool position somewhere in the world!
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
