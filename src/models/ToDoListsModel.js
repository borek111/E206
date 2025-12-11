const { ObjectId } = require('mongodb');
const { getDB } = require('../data/connection');

async function getAllToDoLists(id, filters = {}) {
    const db = getDB();
    const query = { id };

    if (filters.title) {
        query.title = { $regex: filters.title, $options: 'i' };
    }
    if (filters.Pilne) {
        if (filters.Pilne === 'true') {
            query.Pilne = true;
        } else if (filters.Pilne === 'false') {
            query.Pilne = false;
        }
    }

    let sort = { createdAt: -1 };
    if (filters.sortBy) {
        const order = filters.sortOrder === 'asc' ? 1 : -1;
        sort = { [filters.sortBy]: order };
    }

    return await db.collection('ToDoList').find(query).sort(sort).toArray();
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
