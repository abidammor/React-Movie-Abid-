import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_KEY = '077f49305296e37b327a794d52cef9a4';
const API_URL = 'https://api.themoviedb.org/3';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      
      const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
      const localMovie = savedMovies.find(m => m.id === parseInt(id));

      if (localMovie) {
        setMovie(localMovie);
        setIsLocal(true);
        setLoading(false);
        return;
      }

      try {
        const [movieResponse, videosResponse] = await Promise.all([
          axios.get(`${API_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`),
          axios.get(`${API_URL}/movie/${id}/videos?api_key=${API_KEY}`)
        ]);
        
        setMovie(movieResponse.data);
        setVideos(videosResponse.data.results);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        setError('Impossible de charger les détails du film. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleAddToList = () => {
    try {
      const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
      
      if (savedMovies.some(m => m.id === movie.id)) {
        alert('Ce film est déjà dans votre liste !');
        return;
      }

      const movieToSave = {
        id: movie.id,
        title: movie.title,
        description: movie.overview,
        releaseDate: movie.release_date,
        posterUrl: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image',
        backdropUrl: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : null,
        rating: movie.vote_average,
        genre: movie.genres ? movie.genres.map(g => g.name).join(', ') : '',
        duration: movie.runtime,
        budget: movie.budget,
        revenue: movie.revenue,
        status: movie.status,
        original_language: movie.original_language
      };

      savedMovies.push(movieToSave);
      localStorage.setItem('movies', JSON.stringify(savedMovies));
      alert('Film ajouté à votre liste !');
      navigate('/mes-films');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du film:', error);
      alert('Une erreur est survenue lors de la sauvegarde du film.');
    }
  };

  const handleRemoveFromList = () => {
    try {
      const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
      const updatedMovies = savedMovies.filter(m => m.id !== movie.id);
      localStorage.setItem('movies', JSON.stringify(updatedMovies));
      alert('Film retiré de votre liste !');
      navigate('/mes-films');
    } catch (error) {
      console.error('Erreur lors de la suppression du film:', error);
      alert('Une erreur est survenue lors de la suppression du film.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Erreur</h1>
        <p className="text-center mb-6">{error}</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Film non trouvé</h1>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const trailer = !isLocal && videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0">
        <img
          src={isLocal ? movie.backdropUrl : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img
              src={isLocal ? movie.posterUrl : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {movie.rating?.toFixed(1) || movie.vote_average?.toFixed(1)} / 10
              </span>
              <span className="text-gray-400">
                {movie.releaseDate 
                  ? new Date(movie.releaseDate).getFullYear() 
                  : new Date(movie.release_date).getFullYear()}
              </span>
              {movie.duration && (
                <span className="text-gray-400">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}min
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{movie.title}</h1>
            
            {!isLocal && movie.genres && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="bg-[#2c2c2e] text-white px-3 py-1 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {isLocal && movie.genre && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.split(', ').map((genre, index) => (
                  <span key={index} className="bg-[#2c2c2e] text-white px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {movie.description || movie.overview}
            </p>

            <div className="flex flex-wrap gap-4">
              {isLocal ? (
                <button
                  onClick={handleRemoveFromList}
                  className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
                >
                  Retirer de ma liste
                </button>
              ) : (
                <button
                  onClick={handleAddToList}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                >
                  + Ajouter à ma liste
                </button>
              )}

              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#2c2c2e] text-white rounded-full hover:bg-[#3a3a3c] transition-all duration-300 inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Regarder la bande annonce
                </a>
              )}
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Détails</h2>
              <div className="grid grid-cols-2 gap-4">
                {(movie.budget || movie.budget === 0) && (
                  <div>
                    <span className="text-gray-400">Budget :</span>
                    <span className="ml-2">${movie.budget?.toLocaleString()}</span>
                  </div>
                )}
                {(movie.revenue || movie.revenue === 0) && (
                  <div>
                    <span className="text-gray-400">Recettes :</span>
                    <span className="ml-2">${movie.revenue?.toLocaleString()}</span>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <span className="text-gray-400">Statut :</span>
                    <span className="ml-2">{movie.status}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Date de sortie :</span>
                  <span className="ml-2">
                    {new Date(movie.releaseDate || movie.release_date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {(movie.original_language || movie.originalLanguage) && (
                  <div>
                    <span className="text-gray-400">Langue originale :</span>
                    <span className="ml-2">
                      {(movie.original_language || movie.originalLanguage).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
