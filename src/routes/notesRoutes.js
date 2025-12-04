const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.get('/notes', notesController.getAll);
router.get('/notes/add', notesController.getAddForm);
router.post('/notes/add', notesController.postAdd);

router.get('/notes/edit/:id', notesController.getEditForm);
router.post('/notes/edit/:id', notesController.postEdit);
router.post('/notes/delete/:id', notesController.deleteNote);

module.exports = router;
