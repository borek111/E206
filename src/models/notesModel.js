const { ObjectId } = require('mongodb');
const { getDB } = require('../data/connection');

async function getAllNotes(id) {
    const db = getDB();
    return await db.collection('czolgi').find({ id }).sort({ createdAt: -1 }).toArray();
}

async function getNoteById(noteId, id) {
    const db = getDB();
    return await db.collection('czolgi').findOne({ _id: new ObjectId(noteId), id });
}

async function addNote(title, content, status, id) {
    const db = getDB();
    await db.collection('czolgi').insertOne({ title, content, status, id, createdAt: new Date() });
}

async function updateNote(noteId, title, content, status, id) {
    const db = getDB();
    await db.collection('czolgi').updateOne(
        { _id: new ObjectId(noteId), id },
        { $set: { title, content, status } }
    );
}

async function deleteNote(noteId, id) {
    const db = getDB();
    await db.collection('czolgi').deleteOne({ _id: new ObjectId(noteId), id });
}
module.exports = { getAllNotes, getNoteById, addNote, updateNote, deleteNote };
