const usersModel = require('../models/usersModel');
const crypto = require('crypto');

// Prosta mapa tokenów w pamięci
const tokens = new Map();

function getLoginForm(req, res) {
    res.render('pages/login', { error: null, success: null });
}

async function postLogin(req, res) {
    const { Email, Password } = req.body;

    try {
        const user = await usersModel.getUserByEmail(Email);

        if (!user) {
            return res.render('pages/login', { error: 'Nieprawidłowy email lub hasło', success: null });
        }

        const isValid = await usersModel.verifyPassword(user.password, Password);

        if (!isValid) {
            return res.render('pages/login', { error: 'Nieprawidłowy email lub hasło', success: null });
        }

        // Generuj token i przekieruj
        const token = crypto.randomBytes(32).toString('hex');
        tokens.set(token, { userId: user._id, email: user.email });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/notes');
    } catch (err) {
        console.error('Login error:', err);
        res.render('pages/login', { error: 'Wystąpił błąd podczas logowania', success: null });
    }
}

function getRegisterForm(req, res) {
    res.render('pages/register', { error: null, success: null });
}

async function postRegister(req, res) {
    const { Email, Password } = req.body;

    try {
        const existingUser = await usersModel.getUserByEmail(Email);

        if (existingUser) {
            return res.render('pages/register', { error: 'Użytkownik z tym adresem email już istnieje', success: null });
        }

        if (Password.length < 6) {
            return res.render('pages/register', { error: 'Hasło musi mieć co najmniej 6 znaków', success: null });
        }

        await usersModel.createUser(Email, Password);

        res.redirect('/');
    } catch (err) {
        console.error('Registration error:', err);
        res.render('pages/register', { error: 'Wystąpił błąd podczas rejestracji', success: null });
    }
}

// Middleware sprawdzający token w ciasteczkach
function requireAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token || !tokens.has(token)) {
        return res.redirect('/');
    }

    req.user = tokens.get(token);
    req.token = token;
    next();
}

function logout(req, res) {
    res.clearCookie('token');
    res.redirect('/');
}

module.exports = { getLoginForm, postLogin, getRegisterForm, postRegister, requireAuth, logout };
