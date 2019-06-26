import React, { useEffect } from 'react';
import PostCard from './Post';

interface Post {
  id: string;
  title: string;
  body: string;
  imgPath: string;
  imgAlt: string;
}

interface IPostCardContainerProps {
  postsUrl: string
}

const PostCardContainer: React.FC<IPostCardContainerProps> = (
  { postsUrl }: IPostCardContainerProps,
) => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const postCards = posts.map(
    post => <PostCard key={post.id} {...post} />,
  );

  useEffect(() => {
    fetch(postsUrl)
      .then(postsRes => postsRes.json())
      .then(postsJson => {
        setPosts(postsJson);
      });
  });

  return (
    <div>
      <div className="mt-5 row">
        {postCards}
      </div>
    </div>
  );
};

export default PostCardContainer;
