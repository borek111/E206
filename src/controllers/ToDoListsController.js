const ToDoListsModel = require('../models/ToDoListsModel');

async function getAll(req, res) {
    const filters = {
        title: req.query.title,
        Pilne: req.query.Pilne,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
    };
    const ToDoLists = await ToDoListsModel.getAllToDoLists(req.user.userId.toString(), filters);
    res.render('pages/index', { ToDoLists, token: req.token, filters });
}

function getAddForm(req, res) {
    res.render('pages/add', { token: req.token });
}

async function postAdd(req, res) {
    const { title, tresc, status, DataUtworzenia, DataZakonczenia } = req.body;
    const Pilne = req.body.Pilne === 'on';
    await ToDoListsModel.addToDoList(title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, req.user.userId.toString());
    res.redirect('/ToDoLists');
}

async function getEditForm(req, res) {
    const ToDoList = await ToDoListsModel.getToDoListById(req.params.id, req.user.userId.toString());
    if (!ToDoList) {
        return res.redirect('/ToDoLists');
    }
    res.render('pages/edit', { ToDoList, token: req.token });
}

async function postEdit(req, res) {
    const { title, tresc, status, DataUtworzenia, DataZakonczenia } = req.body;
    const Pilne = req.body.Pilne === 'on';
    await ToDoListsModel.updateToDoList(req.params.id, title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, req.user.userId.toString());
    res.redirect('/ToDoLists');
}

async function deleteToDoList(req, res) {
    await ToDoListsModel.deleteToDoList(req.params.id, req.user.userId.toString());
    res.redirect('/ToDoLists');
}

module.exports = { getAll, getAddForm, postAdd, getEditForm, postEdit, deleteToDoList };
