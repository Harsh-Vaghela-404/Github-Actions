const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser } = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');

// GET all users
router.get('/', getUsers);

// GET user by ID
router.get('/:id', getUserById);

// POST create new user
router.post('/', validateUser, createUser);

module.exports = router;