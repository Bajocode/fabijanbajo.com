import React from 'react';
import PostCardContainer from './PostCardContainer';

const PostsSection: React.FC = () => (
  <section>
    <div className="col-lg-8 col-md-10 mx-auto">
      <h2 className="text-center text-light">Projects</h2>
      <PostCardContainer postsUrl="projects.json" />
    </div>
  </section>
);

export default PostsSection;
