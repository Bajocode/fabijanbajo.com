import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeRenderer from '../CodeRenderer';

const codeValue = `
  # Hello

  \`\`\`typescript
  const some = 5;
  \`\`\`
`;

const Post: React.FC = () => (
  <div>
    <header className="jumbotron jumbotron-background-image" style={{ backgroundImage: `url(${'img/placeholder.jpg'})` }}>
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
          <ReactMarkdown source={codeValue} renderers={{ code: CodeRenderer }} />
        </div>
      </div>
    </article>
  </div>
);

export default Post;
