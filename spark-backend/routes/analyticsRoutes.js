// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Bike = require('../models/Bike');
const Station = require('../models/Station');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Get total revenue generated (Admin Only)
router.get('/total-revenue', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalRevenue = await Reservation.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalCost' } } },
    ]);

    // If no revenue data exists, return 0
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;
    res.json({ totalRevenue: revenue });
  } catch (error) {
    console.error('Error calculating total revenue:', error.message);
    res.status(500).json({ message: 'Server error while calculating total revenue', error: error.message });
  }
});


// Get total number of bikes (Admin Only)
router.get('/total-bikes', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalBikes = await Bike.countDocuments();
    res.json({ totalBikes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get total number of reservations (Admin Only)
router.get('/total-reservations', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    res.json({ totalReservations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get top 5 most rented bikes for charts (Admin Only)
router.get('/popular-bikes-rentals', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const popularBikes = await Reservation.aggregate([
      { $group: { _id: '$bike', totalRentals: { $sum: 1 } } },
      { $sort: { totalRentals: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'bikes', localField: '_id', foreignField: '_id', as: 'bikeDetails' } },
      { $unwind: '$bikeDetails' },
      { $project: { 'bikeDetails.name': 1, totalRentals: 1 } }
    ]);

    res.json(popularBikes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get stations with the most activity (Admin Only)
router.get('/most-active-stations', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const mostActiveStations = await Reservation.aggregate([
      { $group: { _id: '$station', totalActivity: { $sum: 1 } } },
      { $sort: { totalActivity: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'stations', localField: '_id', foreignField: '_id', as: 'stationDetails' } },
      { $unwind: '$stationDetails' },
    ]);
    res.json(mostActiveStations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get revenue over time (monthly breakdown) (Admin Only)
router.get('/revenue-over-time', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const revenueOverTime = await Reservation.aggregate([
      { $match: { status: 'returned' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$endDate" } },
          totalRevenue: { $sum: '$totalCost' }
        }
      },
      { $sort: { _id: 1 } } // Sort by month
    ]);

    res.json(revenueOverTime);
  } catch (error) {
    console.error('Error calculating revenue over time:', error.message);
    res.status(500).json({ message: 'Server error while calculating revenue over time', error: error.message });
  }
});

module.exports = router;
