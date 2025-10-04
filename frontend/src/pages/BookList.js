import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../utils/api';

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortBy, setSortBy] = useState('year');
  const [genres, setGenres] = useState([]);
  const booksPerPage = 5;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      let allBooksData = [];
      let page = 1;
      let hasMore = true;
      
      // Fetch all pages
      while (hasMore) {
        const { data } = await booksAPI.getBooks(page);
        allBooksData = [...allBooksData, ...data.books];
        hasMore = page < data.totalPages;
        page++;
      }
      
      // Fetch all books with their average ratings
      const booksWithRatings = await Promise.all(
        allBooksData.map(async (book) => {
          try {
            const bookDetails = await booksAPI.getBook(book._id);
            return { ...book, avgRating: bookDetails.data.avgRating };
          } catch {
            return { ...book, avgRating: 0 };
          }
        })
      );
      
      setAllBooks(booksWithRatings);
      const uniqueGenres = [...new Set(booksWithRatings.map(book => book.genre))];
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
      filtered.sort((a, b) => {
        const aRating = a.avgRating || 0;
        const bRating = b.avgRating || 0;
        if (aRating === 0 && bRating === 0) return 0;
        if (aRating === 0) return 1;
        if (bRating === 0) return -1;
        return bRating - aRating;
      });
    }

    setFilteredBooks(filtered);
    setTotalPages(Math.ceil(filtered.length / booksPerPage));
    setCurrentPage(1);
  };

  useEffect(() => {
    filterAndSortBooks();
  }, [searchTerm, genreFilter, sortBy, allBooks]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    setBooks(filteredBooks.slice(startIndex, endIndex));
  }, [filteredBooks, currentPage]);

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
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title flex-grow-1 me-2" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{book.title}</h5>
                  <span className="text-warning flex-shrink-0">
                    {book.avgRating > 0 ? `${book.avgRating}/5 ⭐` : 'No rating'}
                  </span>
                </div>
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