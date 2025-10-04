import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../utils/api';

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const fetchBooks = async (page) => {
    try {
      const { data } = await booksAPI.getBooks(page);
      setAllBooks(data.books);
      setBooks(data.books);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      
      const uniqueGenres = [...new Set(data.books.map(book => book.genre))];
      setGenres(uniqueGenres);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = allBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !genreFilter || book.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });

    if (sortBy === 'year') {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    }

    setBooks(filtered);
  };

  useEffect(() => {
    filterAndSortBooks();
  }, [searchTerm, genreFilter, sortBy, allBooks]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="retro-title">Books</h1>
        {user && (
          <Link to="/add-book" className="btn retro-btn rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', fontSize: '24px'}} title="Add new book">
            +
          </Link>
        )}
      </div>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            className="form-control retro-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select retro-input"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select retro-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="year">Published Year</option>
            <option value="rating">Average Rating</option>
          </select>
        </div>
      </div>
      <div className="row">
        {books.map((book) => (
          <div key={book._id} className="col-md-4 mb-4">
            <div className="card h-100 retro-card">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text text-muted">by {book.author}</p>
                <p className="card-text"><small className="text-muted">{book.genre} • {book.year}</small></p>
                <p className="card-text book-description">{book.description}</p>
                <Link
                  to={`/books/${book._id}`}
                  className="btn retro-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <nav className="fixed-bottom d-flex justify-content-center p-3">
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button
                  onClick={() => setCurrentPage(page)}
                  className="page-link"
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default BookList;