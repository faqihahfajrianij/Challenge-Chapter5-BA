const express = require('express');
const  router = express.Router();
const prisma = require('../prismaClient');

const {createTransaction, getTransactionById} = require('../controllers/transactions.controllers.js');

router.post('/', createTransaction);
router.get('/:id', getTransactionById);


module.exports = router;