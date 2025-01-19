import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import AddMovie from './pages/AddMovie';
import MovieDetails from './pages/MovieDetails';
import MyMovies from './pages/MyMovies';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recherche" element={<Search />} />
            <Route path="/ajouter" element={<AddMovie />} />
            <Route path="/film/:id" element={<MovieDetails />} />
            <Route path="/mes-films" element={<MyMovies />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
