const express = require('express');
const  router = express.Router();
const prisma = require('../prismaClient');

const {create, getUserById, updateUser, deleteUser} = require('../controllers/users.controllers.js');

router.post('/', create);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
