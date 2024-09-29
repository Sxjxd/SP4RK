const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Get all stations (Admin Only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const stations = await Station.find().populate('availableBikes');
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get a specific station by ID (Admin Only)
router.get('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const station = await Station.findById(req.params.id).populate('availableBikes');
    if (!station) return res.status(404).json({ message: 'Station not found' });
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create a new station (Admin Only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, address, availableBikes } = req.body;

    const newStation = new Station({
      name,
      address,
      availableBikes,
    });

    const savedStation = await newStation.save();
    res.status(201).json(savedStation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a station (Admin Only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, address, availableBikes } = req.body;

    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      { name, address, availableBikes },
      { new: true }
    );

    if (!updatedStation) return res.status(404).json({ message: 'Station not found' });
    res.json(updatedStation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a station (Admin Only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedStation = await Station.findByIdAndDelete(req.params.id);
    if (!deletedStation) return res.status(404).json({ message: 'Station not found' });
    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
