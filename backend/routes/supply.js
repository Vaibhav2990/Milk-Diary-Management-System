const express = require('express');
const router = express.Router();
const { addSupply, getMySupplies, getAllSupplies, updateSupply, updatePaymentStatus } = require('../controllers/supplyController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('supplier'), addSupply);
router.get('/my', protect, authorize('supplier'), getMySupplies);
router.get('/', protect, authorize('owner'), getAllSupplies);
router.put('/:id', protect, authorize('supplier'), updateSupply);
router.put('/:id/payment', protect, authorize('owner'), updatePaymentStatus);

module.exports = router;
