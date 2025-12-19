const { ObjectId } = require('mongodb');
const { getDB } = require('../data/connection');

async function getAllToDoLists(idWlasciciela, filters = {}) {
    const db = getDB();
    const query = { idWlasciciela };

    if (filters.title) {
        query.title = { $regex: filters.title, $options: 'i' };
    }
    if (filters.pilne) {
        if (filters.pilne === 'true') {
            query.pilne = true;
        } else if (filters.pilne === 'false') {
            query.pilne = false;
        }
    }

    let sort = { createdAt: -1 };
    if (filters.sortBy) {
        const order = filters.sortOrder === 'asc' ? 1 : -1;
        sort = { [filters.sortBy]: order };
    }

    return await db.collection('ToDoList').find(query).sort(sort).toArray();
}

async function getToDoListById(toDoListId, idWlasciciela) {
    const db = getDB();
    return await db.collection('ToDoList').findOne({ _id: new ObjectId(toDoListId), idWlasciciela });
}

async function addToDoList(title, tresc, status, dataRozpoczecia, dataZakonczenia, pilne, idWlasciciela) {
    const db = getDB();
    await db.collection('ToDoList').insertOne({ title, tresc, status, dataRozpoczecia, dataZakonczenia, pilne, idWlasciciela, createdAt: new Date() });
}

async function updateToDoList(toDoListId, title, tresc, status, dataRozpoczecia, dataZakonczenia, pilne, idWlasciciela) {
    const db = getDB();
    await db.collection('ToDoList').updateOne(
        { _id: new ObjectId(toDoListId), idWlasciciela },
        { $set: { title, tresc, status, dataRozpoczecia, dataZakonczenia, pilne } }
    );
}

async function deleteToDoList(toDoListId, idWlasciciela) {
    const db = getDB();
    await db.collection('ToDoList').deleteOne({ _id: new ObjectId(toDoListId), idWlasciciela });
}

module.exports = { getAllToDoLists, getToDoListById, addToDoList, updateToDoList, deleteToDoList };
