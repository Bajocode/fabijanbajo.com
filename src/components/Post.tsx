import React from 'react';
import ReactMarkdown from 'react-markdown';

const Post: React.FC = () => {

  const testPost = `
    # First blog

    ## Intro
    Hello world here is how I will fill this page up
    
    
    \`\`\` Swift
    let ball = 4
    
    print("Hello world")
    
    func returnSome() -> Int {
      return 500
    }
    \`\`\`
    
    > Just foolinf around
    to test this out!!!!!😋
  `;

  return (
    <div className="bg-light">
      <ReactMarkdown source={testPost} />
    </div>
  );
};

export default Post;
