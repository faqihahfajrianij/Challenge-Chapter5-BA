const prisma = require('../prismaClient'); 

module.exports = {
  createAccount: async (req, res) => {
    try {
      const { userId, accountName } = req.body;

      const newAccount = await prisma.account.create({
        data: {
          name: accountName,
          userId: parseInt(userId),
        },
      });

      res.status(201).json({
        status: true,
        message: 'Account created successfully',
        data: newAccount,
      });
    } catch (error) {
      console.error('Failed to create account:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while creating the account',
        data: null,
      });
    }
  },

  getAccountById: async (req, res) => {
    try {
      const { accountId } = req.params;

      const account = await prisma.account.findUnique({
        where: { id: parseInt(accountId) },
      });

      if (!account) {
        return res.status(404).json({
          status: false,
          message: 'Account not found',
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'Account retrieved successfully',
        data: account,
      });
    } catch (error) {
      console.error('Failed to fetch account:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while fetching the account',
        data: null,
      });
    }
  },

  updateAccount: async (req, res) => {
    try {
      const { id } = req.params;
      const { accountName } = req.body;

      const updatedAccount = await prisma.account.update({
        where: { id: parseInt(id) },
        data: {
          name: accountName,
        },
      });

      res.status(200).json({
        status: true,
        message: 'Account updated successfully',
        data: updatedAccount,
      });
    } catch (error) {
      console.error('Failed to update account:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while updating the account',
      });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedAccount = await prisma.account.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({
        status: true,
        message: 'Account deleted successfully',
        data: deletedAccount,
      });
    } catch (error) {
      console.error('Failed to delete account:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while deleting the account',
      });
    }
  },
};
