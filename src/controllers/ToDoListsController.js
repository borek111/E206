const ToDoListsModel = require('../models/ToDoListsModel');

async function getAll(req, res, next) {
    try {
        const filters = {
            title: req.query.title,
            Pilne: req.query.Pilne,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };
        const toDoLists = await ToDoListsModel.getAllToDoLists(req.user.userId.toString(), filters);
        res.render('pages/index', { toDoLists, token: req.token, filters });
    } catch (err) {
        next(err);
    }
}

function getAddForm(req, res) {
    const now = new Date();
    const nextWeekDate = new Date(now);
    nextWeekDate.setDate(now.getDate() + 7);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const defaultFormData = {
        DataUtworzenia: formatDate(now),
        DataZakonczenia: formatDate(nextWeekDate)
    };

    res.render('pages/add', { token: req.token, error: null, formData: defaultFormData });
}

async function postAdd(req, res, next) {
    try {
        const { title, tresc, status, DataUtworzenia, DataZakonczenia } = req.body;
        const Pilne = req.body.Pilne === 'on';

        if (new Date(DataZakonczenia) < new Date(DataUtworzenia)) {
            return res.status(400).render('pages/add', {
                token: req.token,
                error: 'Data zakończenia nie może być wcześniej niż data utworzenia',
                formData: req.body
            });
        }

        await ToDoListsModel.addToDoList(title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, req.user.userId.toString());
        res.redirect('/ToDoLists');
    } catch (err) {
        next(err);
    }
}

async function getEditForm(req, res, next) {
    try {
        const toDoList = await ToDoListsModel.getToDoListById(req.params.id, req.user.userId.toString());
        if (!toDoList) {
            const error = new Error('Nie znaleziono listy zadań');
            error.status = 404;
            throw error;
        }
        res.render('pages/edit', { toDoList, token: req.token, error: null });
    } catch (err) {
        next(err);
    }
}

async function postEdit(req, res, next) {
    try {
        const { title, tresc, status, DataUtworzenia, DataZakonczenia } = req.body;
        const Pilne = req.body.Pilne === 'on';

        if (new Date(DataZakonczenia) < new Date(DataUtworzenia)) {
            const toDoList = {
                _id: req.params.id,
                title,
                tresc,
                status,
                DataUtworzenia,
                DataZakonczenia,
                Pilne
            };
            return res.status(400).render('pages/edit', {
                token: req.token,
                error: 'Data zakończenia nie może być wcześniej niż data utworzenia',
                toDoList
            });
        }

        await ToDoListsModel.updateToDoList(req.params.id, title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, req.user.userId.toString());
        res.redirect('/ToDoLists');
    } catch (err) {
        next(err);
    }
}

async function deleteToDoList(req, res, next) {
    try {
        await ToDoListsModel.deleteToDoList(req.params.id, req.user.userId.toString());
        res.redirect('/ToDoLists');
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getAddForm, postAdd, getEditForm, postEdit, deleteToDoList };
