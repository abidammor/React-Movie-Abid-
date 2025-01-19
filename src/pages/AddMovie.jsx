import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddMovie() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    director: '',
    genre: '',
    duration: '',
    posterUrl: '',
    rating: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const movies = JSON.parse(localStorage.getItem('movies') || '[]');
    const newMovie = {
      id: Date.now(),
      ...formData,
      rating: parseFloat(formData.rating) || 0,
      duration: parseInt(formData.duration) || 0,
    };
    movies.push(newMovie);
    localStorage.setItem('movies', JSON.stringify(movies));
    
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">Ajouter un nouveau film</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-[#1c1c1e] p-8 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Titre *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-primary"
              placeholder="Ex: Inception"
            />
          </div>

          <div>
            <label htmlFor="director" className="block text-sm font-medium text-gray-300 mb-2">
              Réalisateur *
            </label>
            <input
              type="text"
              id="director"
              name="director"
              required
              value={formData.director}
              onChange={handleChange}
              className="input-primary"
              placeholder="Ex: Christopher Nolan"
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
              Genre *
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              required
              value={formData.genre}
              onChange={handleChange}
              className="input-primary"
              placeholder="Ex: Science Fiction, Action"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
              Durée (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input-primary"
              placeholder="Ex: 150"
              min="1"
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-300 mb-2">
              Date de sortie
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="input-primary"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
              Note (0-10)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="input-primary"
              placeholder="Ex: 8.5"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-300 mb-2">
            URL de l'affiche
          </label>
          <input
            type="url"
            id="posterUrl"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            className="input-primary"
            placeholder="https://example.com/movie-poster.jpg"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="input-primary"
            placeholder="Entrez une description du film..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#2c2c2e] text-white rounded-full hover:bg-[#3a3a3c] transition-all duration-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Ajouter le film
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMovie;
