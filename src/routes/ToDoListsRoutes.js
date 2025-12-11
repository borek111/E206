const express = require('express');
const router = express.Router();
const ToDoListsController = require('../controllers/ToDoListsController');

router.get('/ToDoLists', ToDoListsController.getAll);
router.get('/ToDoLists/add', ToDoListsController.getAddForm);
router.post('/ToDoLists/add', ToDoListsController.postAdd);

router.get('/ToDoLists/edit/:id', ToDoListsController.getEditForm);
router.post('/ToDoLists/edit/:id', ToDoListsController.postEdit);
router.post('/ToDoLists/delete/:id', ToDoListsController.deleteToDoList);

module.exports = router;
