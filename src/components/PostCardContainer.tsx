import React from 'react';
import PostCard from './PostCard';

interface IPost {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  slug: string;
}

interface IPostCardContainerProps {
  postsUrl: string;
}

const PostCardContainer: React.FC<IPostCardContainerProps> = ({
  postsUrl,
}: IPostCardContainerProps) => {
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const postCards = posts.map(
    post => <PostCard key={post.id} {...post} />,
  );

  React.useEffect(() => {
    fetch(postsUrl)
      .then(response => response.json())
      .then(json => setPosts(json));
  });

  return (
    <ul className="list-unstyled">
      {postCards}
    </ul>
  );
};

export default PostCardContainer;
