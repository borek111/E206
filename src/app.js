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

app.use('/ToDoLists', requireAuth, ToDoListsRouter);

//Testowy endpoint do generowania błędu 500
app.get('/test-500', (req, res, next) => {
    next(new Error('Testowy błąd serwera'));
});

// Obsługa błędu 404 gdy sciezka nie zostanie znaleziona
app.use((req, res, next) => {
    const error = new Error('Strona nie została znaleziona');
    error.status = 404;
    next(error);
});



app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;

    if (status === 401) {
        return res.status(401).render('pages/errors/401', { token: req.cookies.token || null });
    }

    //Adres jest poprawny, ale dane są złe
    if (status === 404) {
        return res.status(404).render('pages/errors/404', { token: req.cookies.token || null });
    }

    res.status(status).render('pages/errors/500', {
        message: err.message || 'Wystąpił błąd serwera',
        token: req.cookies.token || null
    });
});

module.exports = app;
