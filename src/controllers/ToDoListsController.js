const ToDoListsModel = require('../models/ToDoListsModel');

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

async function getAll(req, res, next) {
    try {
        const filters = {
            title: req.query.title,
            pilne: req.query.pilne,
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
        dataRozpoczecia: formatDate(now),
        dataZakonczenia: formatDate(nextWeekDate)
    };

    res.render('pages/add', { token: req.token, error: null, formData: defaultFormData });
}

async function postAdd(req, res, next) {
    try {
        const { title, tresc, status, dataRozpoczecia, dataZakonczenia } = req.body;
        const pilne = req.body.pilne === 'on';

        if (new Date(dataZakonczenia) < new Date(dataRozpoczecia)) {
            return res.status(400).render('pages/add', {
                token: req.token,
                error: 'Data zakończenia nie może być wcześniej niż data rozpoczęcia',
                formData: req.body
            });
        }

        await ToDoListsModel.addToDoList(title, tresc, status, dataRozpoczecia, dataZakonczenia, pilne, req.user.userId.toString());
        res.redirect('/ToDoLists');
    } catch (err) {
        next(err);
    }
}

async function getEditForm(req, res, next) {
    try {
        if (!isValidObjectId(req.params.id)) {
            const error = new Error('Nie znaleziono listy zadań');
            error.status = 404;
            throw error;
        }
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
        if (!isValidObjectId(req.params.id)) {
            const error = new Error('Nie znaleziono listy zadań');
            error.status = 404;
            throw error;
        }
        const { title, tresc, status, dataRozpoczecia, dataZakonczenia } = req.body;
        const pilne = req.body.pilne === 'on';

        if (new Date(dataZakonczenia) < new Date(dataRozpoczecia)) {
            const toDoList = {
                _id: req.params.id,
                title,
                tresc,
                status,
                dataRozpoczecia,
                dataZakonczenia,
                pilne
            };
            return res.status(400).render('pages/edit', {
                token: req.token,
                error: 'Data zakończenia nie może być wcześniej niż data rozpoczęcia',
                toDoList
            });
        }

        await ToDoListsModel.updateToDoList(req.params.id, title, tresc, status, dataRozpoczecia, dataZakonczenia, pilne, req.user.userId.toString());
        res.redirect('/ToDoLists');
    } catch (err) {
        next(err);
    }
}

async function deleteToDoList(req, res, next) {
    try {
        if (!isValidObjectId(req.params.id)) {
            const error = new Error('Nie znaleziono listy zadań');
            error.status = 404;
            throw error;
        }
        await ToDoListsModel.deleteToDoList(req.params.id, req.user.userId.toString());
        res.redirect('/ToDoLists');
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getAddForm, postAdd, getEditForm, postEdit, deleteToDoList };
