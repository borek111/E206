const express = require('express');
const router = express.Router();
const ToDoListsController = require('../controllers/ToDoListsController');

router.get('/', ToDoListsController.getAll);
router.get('/add', ToDoListsController.getAddForm);
router.post('/add', ToDoListsController.postAdd);

router.get('/edit/:id', ToDoListsController.getEditForm);
router.post('/edit/:id', ToDoListsController.postEdit);
router.post('/delete/:id', ToDoListsController.deleteToDoList);

module.exports = router;
