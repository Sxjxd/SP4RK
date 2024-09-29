const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Bike = require('../models/Bike');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');


const generateReservationId = async () => {
  let reservationId;
  let exists = true;

  while (exists) {
    reservationId = `RID${Math.floor(1000 + Math.random() * 9000)}`;
    exists = await Reservation.findOne({ reservationId });
  }

  return reservationId;
};

const updateReservations = async () => {
  const reservations = await Reservation.find({ reservationId: { $exists: false } });

  for (let reservation of reservations) {
    reservation.reservationId = await generateReservationId();
    await reservation.save();
  }

  console.log('All reservations updated with reservationId');
};

updateReservations();

router.post('/rent/:bikeId', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const bike = await Bike.findById(req.params.bikeId);

    if (!bike || bike.availableQuantity <= 0 || bike.status === 'unavailable') {
      return res.status(400).json({ message: 'Bike not available for rent' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Both start and end dates are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after the start date.' });
    }

    const rentalDurationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalCost = rentalDurationDays * bike.pricePerDay;

    // Generate a unique reservation ID
    const reservationId = await generateReservationId();

    const reservation = new Reservation({
      user: req.user.id,
      bike: bike._id,
      station: bike.station,
      startDate: start,
      endDate: end,
      totalCost: totalCost,
      status: 'reserved',
      reservationId, // Save generated reservationId
    });

    bike.availableQuantity -= 1;
    await bike.save();
    const savedReservation = await reservation.save();

    return res.status(201).json({ message: 'Bike reserved successfully', reservation: savedReservation });
  } catch (error) {
    console.error('Reservation Error:', error.message);
    return res.status(500).json({ message: 'Server error during reservation', error: error.message });
  }
});

// Return a bike and calculate the rental cost (Authenticated Users Only)
router.post('/return/:reservationId', verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId).populate('bike');

    // Check if the reservation is valid and hasn't already been returned
    if (!reservation || reservation.status === 'returned') {
      return res.status(400).json({ message: 'Invalid reservation or bike already returned' });
    }

    // Calculate the total rental duration and cost
    const endDate = Date.now();
    const rentalDurationDays = Math.ceil((endDate - reservation.startDate) / (1000 * 60 * 60 * 24));
    const totalCost = rentalDurationDays * reservation.bike.pricePerDay;

    // Update the reservation details
    reservation.endDate = endDate;
    reservation.totalCost = totalCost;
    reservation.status = 'returned';
    await reservation.save();

    // Increase the available quantity of the bike
    const bike = await Bike.findById(reservation.bike._id);
    bike.availableQuantity += 1;
    await bike.save();

    res.json({ message: 'Bike returned successfully', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Delete a reservation (Admin Only)
router.delete('/:reservationId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);

    // Check if reservation exists
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Restore the bike's available quantity when a reservation is deleted
    const bike = await Bike.findById(reservation.bike);
    if (bike && reservation.status !== 'returned') {
      bike.availableQuantity += 1;
      await bike.save();
    }

    // Delete the reservation
    await Reservation.findByIdAndDelete(req.params.reservationId);

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Delete Reservation Error:', error.message);
    res.status(500).json({ message: 'Server error during reservation deletion', error: error.message });
  }
});

// Fetch all reservations (Admin Only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user')
      .populate('bike')
      .populate('station');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



// Update reservation status (Admin Only)
router.put('/:reservationId/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['reserved', 'returned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reservation = await Reservation.findById(req.params.reservationId);

    // Check if reservation exists
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Update the status
    reservation.status = status;

    // If status is 'returned', set the endDate and adjust available quantity of the bike
    if (status === 'returned') {
      reservation.endDate = Date.now();
      const bike = await Bike.findById(reservation.bike);
      bike.availableQuantity += 1; // Increase available quantity on return
      await bike.save();
    }

    await reservation.save();

    res.status(200).json({ message: 'Reservation status updated successfully', reservation });
  } catch (error) {
    console.error('Update Reservation Status Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch reservations for the logged-in user (Authenticated Users Only)
router.get('/user', verifyToken, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('bike')
      .populate('station');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
