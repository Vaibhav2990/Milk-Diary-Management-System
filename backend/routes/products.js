const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);
router.post('/', protect, authorize('owner'), createProduct);
router.put('/:id', protect, authorize('owner'), updateProduct);
router.delete('/:id', protect, authorize('owner'), deleteProduct);

module.exports = router;
