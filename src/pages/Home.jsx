import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_KEY = '077f49305296e37b327a794d52cef9a4';
const API_URL = 'https://api.themoviedb.org/3';

function Home() {
  const [apiMovies, setApiMovies] = useState([]);
  const [localMovies, setLocalMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedMovieIds, setSavedMovieIds] = useState(new Set());

  const loadLocalMovies = () => {
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    setLocalMovies(savedMovies);
    setSavedMovieIds(new Set(savedMovies.map(movie => movie.id)));
  };

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);
        setApiMovies(response.data.results);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
    loadLocalMovies();

    const handleStorageChange = (e) => {
      if (e.key === 'movies') {
        loadLocalMovies();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDeleteMovie = (movieId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      const updatedMovies = localMovies.filter(movie => movie.id !== movieId);
      localStorage.setItem('movies', JSON.stringify(updatedMovies));
      setLocalMovies(updatedMovies);
      setSavedMovieIds(new Set(updatedMovies.map(movie => movie.id)));
    }
  };

  const MovieCard = ({ movie, isLocal }) => {
    const isSaved = savedMovieIds.has(movie.id);
    
    return (
      <div className="relative group">
        <Link
          to={`/film/${movie.id}`}
          className="block"
        >
          <div className="relative overflow-hidden rounded-lg bg-[#1f1f1f] shadow-lg">
            {!isLocal && isSaved && (
              <div className="absolute top-2 right-2 z-20 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                Dans ma liste
              </div>
            )}
            <img
              src={isLocal ? (movie.posterUrl || '/placeholder-movie.jpg') : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover transform group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                    {isLocal ? (movie.rating ? `${movie.rating.toFixed(1)}` : 'N/A') : movie.vote_average.toFixed(1)} / 10
                  </span>
                  <span className="text-gray-300 text-sm">
                    {isLocal ? movie.releaseDate?.split('-')[0] : movie.release_date?.split('-')[0]}
                  </span>
                </div>
                <h3 className="text-lg font-bold line-clamp-2">{movie.title}</h3>
                {isLocal && movie.genre && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-300">{movie.genre}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-1">{movie.title}</h3>
            {isLocal && (
              <p className="text-xs text-gray-400 mt-1">Ajouté à ma liste</p>
            )}
          </div>
        </Link>
        {isLocal && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDeleteMovie(movie.id);
            }}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            title="Supprimer le film"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  if (loading && apiMovies.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d0d0d]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-8 px-4">
      <div className="max-w-[1400px] mx-auto">
        {localMovies.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Ma Liste</h2>
              <Link 
                to="/mes-films"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {localMovies.slice(0, 5).map((movie) => (
                <MovieCard key={`local-${movie.id}`} movie={movie} isLocal={true} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Films Populaires</h2>
            <Link 
              to="/ajouter"
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              + Ajouter un film
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {apiMovies.map((movie) => (
              <MovieCard key={`api-${movie.id}`} movie={movie} isLocal={false} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
