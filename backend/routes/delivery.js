const express = require('express');
const router = express.Router();
const { getMyDeliveries, updateDeliveryStatus, createDelivery, getAllDeliveries } = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, authorize('distributor'), getMyDeliveries);
router.put('/:id/status', protect, authorize('distributor'), updateDeliveryStatus);
router.post('/', protect, authorize('owner'), createDelivery);
router.get('/', protect, authorize('owner'), getAllDeliveries);

module.exports = router;
