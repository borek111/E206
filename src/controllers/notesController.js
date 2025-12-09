const notesModel = require('../models/notesModel');

async function getAll(req, res) {
    const notes = await notesModel.getAllNotes(req.user.userId.toString());
    res.render('pages/index', { notes, token: req.token });
}

function getAddForm(req, res) {
    res.render('pages/add', { token: req.token });
}

async function postAdd(req, res) {
    const { title, content, status } = req.body;
    await notesModel.addNote(title, content, status, req.user.userId.toString());
    res.redirect('/notes');
}

async function getEditForm(req, res) {
    const note = await notesModel.getNoteById(req.params.id, req.user.userId.toString());
    if (!note) {
        return res.redirect('/notes');
    }
    res.render('pages/edit', { note, token: req.token });
}

async function postEdit(req, res) {
    const { title, content, status } = req.body;
    await notesModel.updateNote(req.params.id, title, content, status, req.user.userId.toString());
    res.redirect('/notes');
}

async function deleteNote(req, res) {
    await notesModel.deleteNote(req.params.id, req.user.userId.toString());
    res.redirect('/notes');
}

module.exports = { getAll, getAddForm, postAdd, getEditForm, postEdit, deleteNote };