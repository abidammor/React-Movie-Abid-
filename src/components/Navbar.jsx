import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-black/95 backdrop-blur-md fixed w-full z-50 shadow-lg border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-all duration-300 tracking-tight">
            MOVIEABID
          </Link>
          <div className="flex space-x-2">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}
            >
              Accueil
            </Link>
            <Link
              to="/recherche"
              className={`nav-link ${location.pathname === '/recherche' ? 'nav-link-active' : ''}`}
            >
              Recherche
            </Link>
            <Link
              to="/ajouter"
              className={`nav-link ${location.pathname === '/ajouter' ? 'nav-link-active' : ''}`}
            >
              Ajouter
            </Link>
            <Link
              to="/mes-films"
              className={`nav-link ${location.pathname === '/mes-films' ? 'nav-link-active' : ''}`}
            >
              Mes Films
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
