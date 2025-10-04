import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI, reviewsAPI } from '../utils/api';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, reviewText: '' });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchBookDetails = useCallback(async () => {
    try {
      const { data } = await booksAPI.getBook(id);
      setBook(data.book);
      setReviews(data.reviews);
      setAvgRating(data.avgRating);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewsAPI.createReview({ bookId: id, ...newReview });
      setNewReview({ rating: 5, reviewText: '' });
      fetchBookDetails();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteBook = async () => {
    try {
      await booksAPI.deleteBook(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
    setShowDeleteModal(false);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!book) return <div className="text-center mt-5">Book not found</div>;

  const userReview = reviews.find(r => r.userId._id === user?.id);

  return (
    <div className="container mt-5">
      <button onClick={() => navigate('/')} className="btn retro-btn mb-3">
        ← Back to Books
      </button>
      <div className="card retro-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 className="card-title retro-title">{book.title}</h1>
              <p className="text-muted fs-5">by {book.author}</p>
              <p className="text-muted">{book.genre} • {book.year}</p>
            </div>
            {user && book.addedBy._id === user.id && (
              <div className="d-flex gap-2">
                <Link
                  to={`/edit-book/${book._id}`}
                  className="btn retro-btn"
                >
                  Edit Book
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn retro-btn"
                >
                  Delete Book
                </button>
              </div>
            )}
          </div>
          
          <p className="mb-4">{book.description}</p>
          
          <div className="mb-4">
            <h3 className="h5">
              Average Rating: {avgRating > 0 ? `${avgRating}/5` : 'No ratings yet'}
            </h3>
            <p className="text-muted">{reviews.length} review(s)</p>
          </div>

          {user && !userReview && (
            <form onSubmit={handleReviewSubmit} className="mb-4 p-3 border rounded">
              <h3 className="h5 mb-3">Add Your Review</h3>
              <div className="mb-3">
                <label className="form-label">Rating:</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  className="form-select retro-input"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <textarea
                  placeholder="Write your review..."
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({...newReview, reviewText: e.target.value})}
                  className="form-control retro-input"
                  rows="3"
                  required
                />
              </div>
              <button type="submit" className="btn retro-btn">
                Submit Review
              </button>
            </form>
          )}

          <div>
            <h3 className="h5 mb-3">Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-muted">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="fw-bold">{review.userId.name}</span>
                      <span className="ms-2 text-warning">{'★'.repeat(review.rating)}</span>
                    </div>
                  </div>
                  <p>{review.reviewText}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this book? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleDeleteBook} className="btn btn-danger">
                  Delete Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;