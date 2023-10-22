require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const swaggerJSON = require('./swagger.json');
const swaggerUI = require('swagger-ui-express');

const usersRouter = require('./routes/users.routes');
const accountsRouter = require('./routes/accounts.routes');
const transactionsRouter = require('./routes/transactions.routes');
const authRouter = require('./routes/auth.routes');

app.use(morgan('dev'));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);
app.use('/transactions', transactionsRouter);
app.use('/api/v1/auth', authRouter);
app.use(passport.initialize());
app.use(passport.session());
app.use('/docs', swaggerUI, swaggerUI.setup(swaggerJSON));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

module.exports = app;


