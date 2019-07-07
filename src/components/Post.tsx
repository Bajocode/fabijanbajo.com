import { importMDX } from 'mdx.macro';
import React from 'react';

const TestPost = React.lazy(() => importMDX('../posts/TestPost.mdx'));
const Post: React.FC = () => (
  <div>
    <header className="jumbotron jumbotron-background-image" style={{ backgroundImage: `url(${'img/heart-disease-prediction.jpg'})` }}>
      <div className="overlay" />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 mx-auto">
            <h1 className="display-1 text-white">Header</h1>
            <p className="lead text-light">
              Sub header.
            </p>
            <hr className="my-4" />
            <p className="text-light">
              by Fabijan Bajo on July 07, 2019.
            </p>
          </div>
        </div>
      </div>
    </header>
    <article>
      <div className="container">
        <div className="col-lg-8 col-md-10 mx-auto text-white">
          <React.Suspense fallback={<div>Loading...</div>}>
            <TestPost />
          </React.Suspense>
        </div>
      </div>
    </article>
  </div>
);

export default Post;
