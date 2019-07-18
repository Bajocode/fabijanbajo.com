import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeRenderer from '../CodeRenderer';

interface IPostProps {
  title: string;
  body: string;
}

const Post: React.FC<IPostProps> = ({ body }: IPostProps) => (
  <article>
    <div className="container">
      <div className="col-lg-8 col-md-10 mx-auto text-white">
        <ReactMarkdown source={body} renderers={{ code: CodeRenderer }} />
      </div>
    </div>
  </article>
);

export default Post;
