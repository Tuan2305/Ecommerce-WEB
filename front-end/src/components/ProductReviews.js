import React from 'react';
import { FiStar, FiUser } from 'react-icons/fi';

const ProductReviews = ({ reviews }) => {
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
    
    return {
      rating,
      count,
      percentage
    };
  });
  
  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6">Đánh giá từ khách hàng</h3>
      
      <div className="flex flex-col md:flex-row mb-6">
        {/* Overall rating */}
        <div className="md:w-1/4 mb-6 md:mb-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <FiStar 
                key={star}
                className={`${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                size={20}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{reviews.length} đánh giá</div>
        </div>
        
        {/* Rating distribution */}
        <div className="md:w-3/4">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center mb-1">
              <div className="w-12 text-sm text-gray-600 flex items-center">
                {rating} <FiStar className="ml-1 text-yellow-400 fill-current" size={14} />
              </div>
              <div className="flex-grow mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-10 text-right text-sm text-gray-600">{count}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Review list */}
      <div className="divide-y divide-gray-200">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="py-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  {review.avatarUrl ? (
                    <img 
                      src={review.avatarUrl} 
                      alt={review.username} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <div>
                  <div className="font-medium">{review.username}</div>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
              </div>
              
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <FiStar 
                    key={star}
                    className={`${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    size={16}
                  />
                ))}
              </div>
              
              {review.content && <p className="text-gray-700">{review.content}</p>}
              
              {review.images && review.images.length > 0 && (
                <div className="mt-2 flex space-x-2">
                  {review.images.map((image, imgIndex) => (
                    <img 
                      key={imgIndex}
                      src={image}
                      alt={`Review image ${imgIndex + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;