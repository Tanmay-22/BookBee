import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RatingChart = ({ reviews }) => {
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating > 1 ? 's' : ''}`,
    count: reviews.filter(review => review.rating === rating).length
  }));

  return (
    <div className="mt-4">
      <h4 className="mb-3">Rating Distribution</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ratingDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#00ff00" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingChart;