import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeRenderer from '../CodeRenderer';

interface IPostProps {
  slug: string;
}

function Image(props) {
  return <img {...props} style={{maxWidth: '100%'}} />
}

const PostDetail: React.FC<IPostProps> = ({ slug }: IPostProps) => {
  const [post, setPost] = React.useState<string>('');

  React.useEffect(() => {
    fetch(`posts/${slug}.md`)
      .then(result => result.text())
      .then(text => setPost(text));
  });
  
  return <article>
    <div className="container pt-4 mt-4">
      <div className="col-lg-8 col-md-10 mx-auto text-white">
        <ReactMarkdown source={post} renderers={{code: CodeRenderer, image: Image}} escapeHtml={false}/>
      </div>
    </div>
  </article>
};

export default PostDetail;
