import React from 'react';
import { useRoutes } from 'hookrouter';
import Home from './components/Home';
import PostDetail from './components/PostDetail';
import NavBar from './components/Navbar';
import Footer from './components/Footer';

interface IPost {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  slug: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const routes = posts
    .map(post => () => <PostDetail slug={post.slug} />)
    .reduce((accumulator, current, i) => {
      accumulator[posts[i].slug] = current;
      return accumulator;
    }, {});
  routes['/'] = () => <Home />;

  React.useEffect(() => {
    fetch('posts.json')
      .then(result => result.json())
      .then(json => setPosts(json));
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
