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


// Obsługa błędu 404 musi byc osobno, po wszystkich innych trasach (bo to nie jest bład aplikacji)
app.use((req, res, next) => {
    res.status(404).render('pages/errors/404', { token: req.cookies.token || null });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;

    if (status === 401) {
        return res.status(401).render('pages/errors/401', { token: req.cookies.token || null });
    }

    if (status === 400) {
        return res.status(400).render('pages/errors/400', {
            message: err.message || 'Nieprawidłowe żądanie',
            token: req.cookies.token || null
        });
    }

    res.status(status).render('pages/errors/500', {
        message: err.message || 'Wystąpił błąd serwera',
        token: req.cookies.token || null
    });
});

module.exports = app;
