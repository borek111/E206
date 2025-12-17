const ToDoListsModel = require('../models/ToDoListsModel');

async function getAll(req, res) {
    const filters = {
        title: req.query.title,
        Pilne: req.query.Pilne,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
    };
    const toDoLists = await ToDoListsModel.getAllToDoLists(req.user.userId.toString(), filters);
    res.render('pages/index', { toDoLists, token: req.token, filters });
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

async function postAdd(req, res) {
    const { title, tresc, status, DataUtworzenia, DataZakonczenia } = req.body;
    const Pilne = req.body.Pilne === 'on';

    if (new Date(DataZakonczenia) < new Date(DataUtworzenia)) {
        return res.render('pages/add', {
            token: req.token,
            error: 'Data zakończenia nie może być wcześniej niż data utworzenia',
            formData: req.body
        });
    }

    await ToDoListsModel.addToDoList(title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, req.user.userId.toString());
    res.redirect('/ToDoLists');
}

async function getEditForm(req, res) {
    const toDoList = await ToDoListsModel.getToDoListById(req.params.id, req.user.userId.toString());
    if (!toDoList) {
        return res.redirect('/ToDoLists');
    }
    res.render('pages/edit', { toDoList, token: req.token, error: null });
}

async function postEdit(req, res) {
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
        return res.render('pages/edit', {
            token: req.token,
            error: 'Data zakończenia nie może być wcześniej niż data utworzenia',
            toDoList
        });
    }

    await ToDoListsModel.updateToDoList(req.params.id, title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, req.user.userId.toString());
    res.redirect('/ToDoLists');
}

async function deleteToDoList(req, res) {
    await ToDoListsModel.deleteToDoList(req.params.id, req.user.userId.toString());
    res.redirect('/ToDoLists');
}

module.exports = { getAll, getAddForm, postAdd, getEditForm, postEdit, deleteToDoList };
