const { ObjectId } = require('mongodb');
const { getDB } = require('../data/connection');

async function getAllToDoLists(id) {
    const db = getDB();
    return await db.collection('ToDoList').find({ id }).sort({ createdAt: -1 }).toArray();
}

async function getToDoListById(toDoListId, id) {
    const db = getDB();
    return await db.collection('ToDoList').findOne({ _id: new ObjectId(toDoListId), id });
}

async function addToDoList(title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, id) {
    const db = getDB();
    await db.collection('ToDoList').insertOne({ title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, id, createdAt: new Date() });
}

async function updateToDoList(toDoListId, title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne, id) {
    const db = getDB();
    await db.collection('ToDoList').updateOne(
        { _id: new ObjectId(toDoListId), id },
        { $set: { title, tresc, status, DataUtworzenia, DataZakonczenia, Pilne } }
    );
}

async function deleteToDoList(toDoListId, id) {
    const db = getDB();
    await db.collection('ToDoList').deleteOne({ _id: new ObjectId(toDoListId), id });
}

module.exports = { getAllToDoLists, getToDoListById, addToDoList, updateToDoList, deleteToDoList };
