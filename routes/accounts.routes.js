const express = require('express');
const  router = express.Router();
const prisma = require('../prismaClient');

const {createAccount, getAccountById, updateAccount, deleteAccount} = require('../controllers/accounts.controllers.js');

router.post('/', createAccount);
router.get('/:id', getAccountById);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;