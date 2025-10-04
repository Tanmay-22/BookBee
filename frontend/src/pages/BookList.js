import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../utils/api';

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const fetchBooks = async (page) => {
    try {
      const { data } = await booksAPI.getBooks(page);
      setBooks(data.books);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

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