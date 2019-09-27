import React from 'react';
import PostCardContainer from './PostCardContainer';

const PostsSection: React.FC = () => (
  <section>
    <div className="col-lg-8 col-md-10 mx-auto">
      <h2 className="text-center text-light">Posts</h2>
      <PostCardContainer postsUrl="posts.json" />
    </div>
  </section>
);

export default PostsSection;
