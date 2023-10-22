const prisma = require('../prismaClient'); 

module.exports = {
  create: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          password,
        },
      });

      res.status(201).json({
        status: true,
        message: 'User created successfully',
        data: newUser,
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while creating the user',
        data: null,
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await prisma.users.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User not found',
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while fetching the user',
        data: null,
      });
    }
  },
  
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const updatedUser = await prisma.users.update({
        where: { id: parseInt(id) },
        data: {
          name,
          email,
          password,
        },
      });

      res.status(200).json({
        status: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while updating the user',
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedUser = await prisma.users.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({
        status: true,
        message: 'User deleted successfully',
        data: deletedUser,
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while deleting the user',
      });
    }
  },
};
