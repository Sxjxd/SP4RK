const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bikeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,  // Index for quicker queries on bike name
  },
  description: {
    type: String,
    default: 'No description available',
  },
  pricePerDay: { 
    type: Number,
    required: true,
    default: 5000, 
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  images: [{
    type: String,  // Array of image URLs
    default: '',
  }],
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    index: true,  // Index for queries based on stations
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available',
    index: true,  // Index for quicker queries on availability
  },
  reviews: [reviewSchema],  // Array of reviews
  averageRating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bikeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  
  // Ensure availableQuantity never exceeds totalQuantity
  if (this.availableQuantity > this.totalQuantity) {
    this.availableQuantity = this.totalQuantity;
  }
  
  next();
});

// Calculate the average rating when a new review is added
bikeSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  } else {
    this.averageRating = 0;
  }
  return this.averageRating;
};

module.exports = mongoose.model('Bike', bikeSchema);
