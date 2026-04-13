const express = require('express');
const router = express.Router();
const { createSubscription, getMySubscriptions, getAllSubscriptions, updateSubscription, cancelSubscription } = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createSubscription);
router.get('/my', protect, authorize('customer'), getMySubscriptions);
router.get('/', protect, authorize('owner'), getAllSubscriptions);
router.put('/:id', protect, authorize('customer'), updateSubscription);
router.put('/:id/cancel', protect, authorize('customer'), cancelSubscription);

module.exports = router;
