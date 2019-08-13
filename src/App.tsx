import React from 'react';
import { useRoutes } from 'hookrouter';
// import Home from './components/Home';
import Post from './components/Post';
import NavBar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [post, setPost] = React.useState('');
  const routes = {
    '/': () => <Post title="" body={post} />,
  };

  React.useEffect(() => {
    fetch('posts/test.md')
      .then(res => res.text())
      .then(text => setPost(text));
  });

  return (
    <div className="container pt-4 mt-4">
      <NavBar />
      {useRoutes(routes)}
      <Footer />
    </div>
  );
};

export default App;
