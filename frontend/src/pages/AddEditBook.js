import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { booksAPI } from '../utils/api';

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    year: new Date().getFullYear()
  });
  const [error, setError] = useState('');

  const fetchBook = useCallback(async () => {
    try {
      const { data } = await booksAPI.getBook(id);
      setFormData({
        title: data.book.title,
        author: data.book.author,
        description: data.book.description,
        genre: data.book.genre,
        year: data.book.year
      });
    } catch (error) {
      setError('Error fetching book details');
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchBook();
    }
  }, [isEdit, fetchBook]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      if (isEdit) {
        await booksAPI.updateBook(id, formData);
      } else {
        await booksAPI.createBook(formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card retro-card">
            <div className="card-body">
              <h2 className="card-title mb-4 retro-title">{isEdit ? 'EDIT BOOK' : 'ADD NEW BOOK'}</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Book Title</label>
                  <input
                    type="text"
                    className="form-control retro-input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    className="form-control retro-input"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control retro-input"
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Genre</label>
                  <input
                    type="text"
                    className="form-control retro-input"
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Published Year</label>
                  <input
                    type="number"
                    className="form-control retro-input"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    min="1000"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn retro-btn"
                  >
                    {isEdit ? 'Update Book' : 'Add Book'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn retro-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBook;