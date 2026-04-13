const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);
router.get('/', protect, authorize('owner', 'distributor'), getAllOrders);
router.put('/:id/status', protect, authorize('owner', 'distributor'), updateOrderStatus);
router.put('/:id/cancel', protect, authorize('customer'), cancelOrder);

module.exports = router;
