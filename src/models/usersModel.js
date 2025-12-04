const { getDB } = require('../data/connection');
const argon2 = require('argon2');

async function getUserByEmail(email) {
    const db = getDB();
    return await db.collection('users').findOne({ email });
}

async function createUser(email, password) {
    const db = getDB();
    const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4
    });

    const result = await db.collection('users').insertOne({
        email,
        password: hashedPassword,
        createdAt: new Date()
    });

    return result;
}

async function verifyPassword(hashedPassword, plainPassword) {
    return await argon2.verify(hashedPassword, plainPassword);
}

module.exports = { getUserByEmail, createUser, verifyPassword };
