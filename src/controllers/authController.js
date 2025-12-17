const usersModel = require('../models/usersModel');
const crypto = require('crypto');

// Prosta mapa tokenów w pamięci
const tokens = new Map();

function getLoginForm(req, res) {
    res.render('pages/login', { error: null });
}

async function postLogin(req, res) {
    const { Email: email, Password: password } = req.body;

    try {
        const user = await usersModel.getUserByEmail(email);

        if (!user) {
            return res.status(401).render('pages/login', { error: 'Nieprawidłowy email lub hasło' });
        }

        const isValid = await usersModel.verifyPassword(user.password, password);

        if (!isValid) {
            return res.status(401).render('pages/login', { error: 'Nieprawidłowy email lub hasło' });
        }

        // Generuj token i przekieruj
        const token = crypto.randomBytes(32).toString('hex');
        tokens.set(token, { userId: user._id, email: user.email });

        res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 }); // 1 day
        res.redirect('/ToDoLists');
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).render('pages/errors/500', { message: 'Wystąpił błąd podczas logowania' });
    }
}

function getRegisterForm(req, res) {
    res.render('pages/register', { error: null });
}

async function postRegister(req, res) {
    const { Email: email, Password: password } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).render('pages/register', { error: 'Hasło musi mieć co najmniej 8 znaków, zawierać jedną małą literę, jedną dużą literę i jedną cyfrę.' });
    }

    try {
        const existingUser = await usersModel.getUserByEmail(email);

        if (existingUser) {
            return res.status(409).render('pages/register', { error: 'Użytkownik z tym adresem email już istnieje' });
        }

        if (password.length < 6) {
            return res.status(400).render('pages/register', { error: 'Hasło musi mieć co najmniej 6 znaków' });
        }

        await usersModel.createUser(email, password);

        res.redirect('/');
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).render('pages/errors/500', { message: 'Wystąpił błąd podczas rejestracji' });
    }
}

// Middleware sprawdzający token w ciasteczkach
function requireAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token || !tokens.has(token)) {
        const err = new Error('Brak autoryzacji');
        err.status = 401;
        return next(err);
    }

    req.user = tokens.get(token);
    req.token = token;
    next();
}

function logout(req, res) {
    res.clearCookie('token');
    if (req.token) tokens.delete(req.token);
    res.redirect('/');
}

module.exports = { getLoginForm, postLogin, getRegisterForm, postRegister, requireAuth, logout };
