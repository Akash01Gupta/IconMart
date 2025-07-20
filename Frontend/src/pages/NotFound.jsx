import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 text-center">
      <div className="max-w-xl">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4 animate-bounce">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
