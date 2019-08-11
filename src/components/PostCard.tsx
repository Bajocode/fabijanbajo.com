import React from 'react';

interface IPostCardProps {
  title: string;
  excerpt: string;
  postUrl: string;
}

const PostCard: React.FC<IPostCardProps> = ({ title, excerpt, postUrl }: IPostCardProps) => (
  <li className="media">
    <div className="media-body">
      <h5 className="mt-4 mb-1">
        <a href={postUrl}>{title}</a>
      </h5>
      <p className="text-muted">{excerpt}</p>
    </div>
  </li>
);

export default PostCard;
