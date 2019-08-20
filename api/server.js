const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knexConnection = require('../database/dbConfig');
const server = express();

const sessionOptions = {
    name: 'fiftyfirstdates',
    secret: process.env.COOKIE_SECRET || 'keep it secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.COOKIE_SECURE || false,
        httpOnly: true,
    },
    store: new KnexSessionStore({
        knex: knexConnection,
        createtable: true,
        clearInterval: 1000 * 60 * 30//how long before we clear our expired sessions
    }),
};
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.json({ api: 'up', session: req.session });
});

module.exports = server;
