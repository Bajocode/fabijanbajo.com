import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeRenderer from '../CodeRenderer';

interface IPostProps {
  slug: string;
}

const PostDetail: React.FC<IPostProps> = ({ slug }: IPostProps) => {
  const [post, setPost] = React.useState<string>('');

  React.useEffect(() => {
    fetch(`posts/${slug}.md`)
      .then(result => result.text())
      .then(text => setPost(text));
  });
  
  return <article>
    <div className="container">
      <div className="col-lg-8 col-md-10 mx-auto text-white">
        <ReactMarkdown source={post} renderers={{ code: CodeRenderer }} />
      </div>
    </div>
  </article>
};

export default PostDetail;
