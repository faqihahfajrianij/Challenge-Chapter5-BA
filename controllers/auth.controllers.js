const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

module.exports = {
    register: async (req, res, next) => {
        try {
            let { name, email, password, password_confirmation } = req.body;
            if (password !== password_confirmation) {
                return res.status(400).json({ message: 'Password and password confirmation must match' });
            }

            let userExist = await prisma.users.findUnique({ where: { email } });
            if (userExist) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }

            let encryptedPassword = await bcrypt.hash(password, 10);
            await prisma.users.create({
                data: {
                    name,
                    email,
                    password: encryptedPassword
                }
            });

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            next(err);
        }
    },

    authUser: async (email, password, done) => {
        try {
            let user = await prisma.users.findUnique({ where: { email } });
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            let isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            return done(null, user);
        } catch (err) {
            return done(null, false, { message: err.message });
        }
    },

    authAccount: async (accountName, accountId, done) => {
        try {
            const account = await prisma.account.findUnique({
                where: {
                    id: parseInt(accountId),
                    name: accountName,
                },
            });
            if (!account) {
                return done(null, false, {message: 'invalid account'});
            }
            return done(null, account);
        } catch (error){
            return done(null, false, {message: error.message});
        }
    },

    authTransaction: async (transactionId, sourceAccountId, destinationAccountId, done) => {
        try {
            const transaction = await prisma.transactions.findUnique({
                where: {
                    id: parseInt(transactionId),
                    sourceAccountId: parseInt(sourceAccountId),
                    destinationAccountId: parseInt(destinationAccountId),
                },
            });
    
            if (!transaction) {
                return done(null, false, { message: 'Invalid transaction' });
            }
    
            return done(null, transaction);
        } catch (err) {
            return done(null, false, { message: err.message });
        }
    },
    login: async(req, res, next) => {
        try {
            let{email, password} = req.body;
            let user = await prisma.user.findUnique({where: {email}});
            if(!user){
                return res.status(400).json({
                    status: false,
                    message: "Bad request",
                    error: "invalid email or password",
                    data: null
                });
            }

            let isPasswordCorrect = await bcrypt.compare(password, user.password);
            if(!isPasswordCorrect){
                return res.status(400).json({
                    status: false,
                    message: "Bad request",
                    error: "invalid email or password",
                    data: null
                });
            }
            
            let token = jwt.sign(user, JWT_SECRET_KEY);
            return res.status(200).json({
                status: true,
                message: "created",
                error: null,
                data: {user, token}
            }); 
    } catch (error){
        next(error);
    }
    },
    whoami: (req, res, next) => {
        return res.status(200).json({
            status: true,
            message: 'OK',
            err: null,
            data: { user: req.user }
        });
    }
};