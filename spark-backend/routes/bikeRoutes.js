const express = require('express');
const multer = require('multer');
const router = express.Router();
const Bike = require('../models/Bike');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename the file to avoid conflicts
  }
});

const upload = multer({ storage });

router.post('/', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, pricePerDay, totalQuantity, station, status } = req.body;

    const newBike = new Bike({
      name,
      description,
      pricePerDay,
      totalQuantity,
      availableQuantity: totalQuantity, // Ensure the available quantity is initially set
      station,
      images: req.file ? [req.file.path] : [],
      status,
    });

    await newBike.save();
    res.status(201).json(newBike);
  } catch (error) {
    console.error('Error creating bike:', error); // Log the full error message for debugging
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update a bike with a new image (Admin Only)
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const updateData = req.body;
    
    if (req.file) {
      updateData.images = [req.file.path]; // If a new image is uploaded, replace the existing images array
    }

    const updatedBike = await Bike.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('station')
      .populate('reviews.user', 'name');

    if (!updatedBike) return res.status(404).json({ message: 'Bike not found' });

    res.json(updatedBike);
  } catch (error) {
    console.error('Error updating bike:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});


// Get all bikes with reviews
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.find().populate('station').populate('reviews.user', 'name'); // Populate reviews and users
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific bike by ID
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate('station').populate('reviews.user', 'name');
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// // Create a new bike (Admin Only)
// router.post('/', verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const { name, description, pricePerDay, totalQuantity, availableQuantity, station, images, status } = req.body;

//     const newBike = new Bike({
//       name,
//       description,
//       pricePerDay,
//       totalQuantity,
//       availableQuantity,
//       station,
//       images, // Ensure images are stored in an array of strings (URLs)
//       status,
//     });

//     await newBike.save();
//     res.status(201).json(newBike);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// });

// // Update a bike (Admin Only)
// router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const updatedBike = await Bike.findByIdAndUpdate(req.params.id, req.body, { new: true })
//       .populate('station') // Populate the station field
//       .populate('reviews.user', 'name'); // Populate reviews with user data

//     if (!updatedBike) return res.status(404).json({ message: 'Bike not found' });

//     res.json(updatedBike); // Return the populated bike document
//   } catch (error) {
//     console.error('Error updating bike:', error);
//     res.status(500).json({ message: 'Server Error', error });
//   }
// });

// Delete a bike (Admin Only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedBike = await Bike.findByIdAndDelete(req.params.id);
    if (!deletedBike) return res.status(404).json({ message: 'Bike not found' });
    res.json({ message: 'Bike deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Add a review to a bike (Authenticated Users Only)
router.post('/:id/review', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });

    const review = {
      user: req.user._id,
      rating,
      comment,
    };

    bike.reviews.push(review);
    bike.calculateAverageRating(); // Update average rating
    await bike.save();

    res.json({ message: 'Review added successfully', bike });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
