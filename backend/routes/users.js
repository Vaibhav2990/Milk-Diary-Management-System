const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, createUserByAdmin } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('owner'), getAllUsers);
router.post('/', protect, authorize('owner'), createUserByAdmin);
router.get('/:id', protect, authorize('owner'), getUserById);
router.put('/:id', protect, authorize('owner'), updateUser);
router.delete('/:id', protect, authorize('owner'), deleteUser);

module.exports = router;
