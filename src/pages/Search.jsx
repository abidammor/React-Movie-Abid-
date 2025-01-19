import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_KEY = '077f49305296e37b327a794d52cef9a4';
const API_URL = 'https://api.themoviedb.org/3';

function Search() {
  const [query, setQuery] = useState('');
  const [apiMovies, setApiMovies] = useState([]);
  const [localMovies, setLocalMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [savedMovieIds, setSavedMovieIds] = useState(new Set());

 
  useEffect(() => {
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    setLocalMovies(savedMovies);
    setSavedMovieIds(new Set(savedMovies.map(movie => movie.id)));
  }, []);

 
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'movies') {
        const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
        setLocalMovies(savedMovies);
        setSavedMovieIds(new Set(savedMovies.map(movie => movie.id)));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSearch = async (e, newPage = 1) => {
    e?.preventDefault();
    if (!query.trim()) {
      setApiMovies([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(
          query
        )}&page=${newPage}&sort_by=${sortBy}`
      );
      setApiMovies(response.data.results);
      setTotalPages(response.data.total_pages);
      setPage(newPage);
    } catch (error) {
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        handleSearch(null, 1);
      } else {
        setApiMovies([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  
  const filteredLocalMovies = query
    ? localMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        (movie.genre && movie.genre.toLowerCase().includes(query.toLowerCase())) ||
        (movie.description && movie.description.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

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
            {isLocal && (
              <div className="absolute top-2 right-2 z-20 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                Film sauvegardé
              </div>
            )}
            <img
              src={isLocal ? movie.posterUrl : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover transform group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
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
            {movie.title.toLowerCase().includes(query.toLowerCase()) && (
              <div className="text-xs text-blue-500 mt-1">Correspond à : "{query}"</div>
            )}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Rechercher un film</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un film..."
              className="flex-1 px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-l focus:outline-none focus:border-blue-500 text-white"
            />
            <button
              onClick={(e) => handleSearch(e, 1)}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-r"
              disabled={loading}
            >
              Rechercher
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded focus:outline-none focus:border-blue-500 text-white sm:w-48"
          >
            <option value="popularity.desc">Les plus populaires</option>
            <option value="vote_average.desc">Les mieux notés</option>
            <option value="release_date.desc">Les plus récents</option>
            <option value="release_date.asc">Les plus anciens</option>
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-8">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : query ? (
          <>
            {filteredLocalMovies.length > 0 && (
              <div className="mb-12">
                <div className="text-blue-500 mb-4">
                  <h2 className="text-xl font-semibold">Films sauvegardés correspondants</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredLocalMovies.map((movie) => (
                    <MovieCard key={`local-${movie.id}`} movie={movie} isLocal={true} />
                  ))}
                </div>
              </div>
            )}

            {apiMovies.length > 0 && (
              <div>
                <div className="text-blue-500 mb-4">
                  <h2 className="text-xl font-semibold">Résultats pour "{query}"</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {apiMovies.map((movie) => (
                    <MovieCard key={`api-${movie.id}`} movie={movie} isLocal={false} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      onClick={(e) => handleSearch(e, page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 bg-[#1f1f1f] text-white rounded disabled:opacity-50 hover:bg-[#2a2a2a] border border-[#333]"
                    >
                      Précédent
                    </button>
                    <span className="text-gray-400">
                      Page {page} sur {totalPages}
                    </span>
                    <button
                      onClick={(e) => handleSearch(e, page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-[#1f1f1f] text-white rounded disabled:opacity-50 hover:bg-[#2a2a2a] border border-[#333]"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            )}

            {filteredLocalMovies.length === 0 && apiMovies.length === 0 && (
              <div className="text-center text-xl mt-8">
                Aucun film trouvé pour "{query}"
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Search;
