import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    setMovies(savedMovies);
  }, []);

  const handleDeleteMovie = (movieId) => {
    const updatedMovies = movies.filter(movie => movie.id !== movieId);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    setMovies(updatedMovies);
  };

  if (movies.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Mes Films</h1>
        <p className="text-center text-gray-600">Vous n'avez pas encore ajouté de films à votre liste.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Mes Films</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map(movie => (
          <div key={movie.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              <p className="text-gray-600 mb-2">
                Date de sortie: {new Date(movie.releaseDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-gray-600 mb-2">Genre: {movie.genre}</p>
              <p className="text-gray-600 mb-2">
                Budget: ${movie.budget?.toLocaleString() || 'Non disponible'}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/film/${movie.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Voir les détails
                </Link>
                <button
                  onClick={() => handleDeleteMovie(movie.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyMovies;
