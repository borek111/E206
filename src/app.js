const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const ToDoListsRouter = require('./routes/ToDoListsRoutes');
const authRouter = require('./routes/authRoutes');
const { requireAuth } = require('./controllers/authController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);

app.use('/', requireAuth, ToDoListsRouter);

module.exports = app;
