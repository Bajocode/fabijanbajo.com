import React, { FC } from 'react';

interface IPostCardProps {
  title: string;
  body: string;
  imgPath: string;
  imgAlt: string;
}

const PostCard: React.FC<IPostCardProps> = ({
  title,
  body,
  imgPath,
  imgAlt,
}: IPostCardProps) => (
  <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
    <div className="card mb-3">
      <img className="card-img-top" src={imgPath} alt={imgAlt} />
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <p className="card-text">{body}</p>
      </div>
    </div>
  </div>
);

export default PostCard;
