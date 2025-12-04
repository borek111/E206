const express = require('express');
const path = require('path');
const notesRouter = require('./routes/notesRoutes');
const authRouter = require('./routes/authRoutes');
const { requireAuth } = require('./controllers/authController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logowanie i rejestracja bez autoryzacji
app.use('/', authRouter);

// Notatki wymagają tokenu w URL
app.use('/', requireAuth, notesRouter);

module.exports = app;
