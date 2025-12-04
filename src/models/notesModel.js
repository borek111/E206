const {ObjectId} = require('mongodb');
const {getDB} = require('../data/connection');

async function getAllNotes() {
    const db = getDB();
    return await db.collection('czolgi').find().sort({ createdAt: -1 }).toArray();
}

async function getNoteById(id) {
    const db = getDB();
    return await db.collection('czolgi').findOne({ _id: new ObjectId(id) });
}

async function addNote(title, content,status) {
    const db = getDB();
    await db.collection('czolgi').insertOne({ title, content, status, createdAt: new Date() });
}

async function updateNote(id, title, content,status) {
    const db = getDB();
    await db.collection('czolgi').updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, content, status} }
    );
}

async function deleteNote(id) {
    const db = getDB();
    await db.collection('czolgi').deleteOne({ _id: new ObjectId(id) });
}
module.exports = { getAllNotes, getNoteById, addNote, updateNote, deleteNote };
