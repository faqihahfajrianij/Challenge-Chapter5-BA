const prisma = require('../prismaClient'); 

module.exports = {
  createTransaction: async (req, res) => {
    try {
      const { sourceAccountId, destinationAccountId, amount } = req.body;

      const sourceAccount = await prisma.account.findUnique({
        where: { id: sourceAccountId },
      });

      const destinationAccount = await prisma.account.findUnique({
        where: { id: destinationAccountId },
      });

      // Lakukan transaksi
      await prisma.$transaction([
        prisma.account.update({
          where: { id: sourceAccountId },
          data: {
            balance: {
              decrement: amount,
            },
          },
        }),
        prisma.account.update({
          where: { id: destinationAccountId },
          data: {
            balance: {
              increment: amount,
            },
          },
        }),
        prisma.transactions.create({
          data: {
            sourceAccountId,
            destinationAccountId,
            amount,
          },
        }),
      ]);

      res.json({ status: true, message: 'Transaction successful' });
    } catch (error) {
      console.error('Failed to process transaction:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while processing the transaction',
      });
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params;

      const transaction = await prisma.transactions.findUnique({
        where: { id: parseInt(id) },
        include: {
          sourceAccount: true,
          destinationAccount: true,
        },
      });

      if (!transaction) {
        return res.status(404).json({
          status: false,
          message: 'Transaction not found',
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      });
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while fetching the transaction',
        data: null,
      });
    }
  },
};
