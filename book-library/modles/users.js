import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import md5 from 'md5';
import CryptoJS from 'crypto-js';

const FILE = 'data/users.json';

export const getDataPath = (file) => {
    return path.resolve(process.cwd(), file);
};

export const readJSON = async () => {
    try {
        const data = await fs.readFile(getDataPath(FILE), 'utf8');
        return JSON.parse(data);
    } catch {

        return [];
    }
};

export const writeJSON = async (data) => {
    try {
        await fs.writeFile(
            getDataPath(FILE),
            JSON.stringify(data, null, 2)
        );
    } catch (e) {
        console.error(e);
    }
};

export const findById = async (id) => {
    const users = await readJSON();
    return users.find(u => u.id === id) || null;
};

export const findByEmail = async (email) => {
    const users = await readJSON();
    return users.find(u => u.email === email) || null;
};

export const checkEmailUnique = async (email) => {
    const user = await findByEmail(email);
    return !!user;
};

export const create = async (data) => {
    const users = await readJSON();

    const newUser = {
        id: uuidv4(), // Generate unique ID
        ...data
    };

    users.push(newUser);
    await writeJSON(users);

    return newUser;
};


export const hashPassword = (pass) => {
    return md5(md5(pass) + process.env.PASSWORD_SECRET);
};


export const encrypt = (data) => {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.TOKEN_SECRET
    ).toString();
};


export const decrypt = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(
            ciphertext,
            process.env.TOKEN_SECRET
        );
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
        return null;
    }
};

export default {
    getDataPath,
    readJSON,
    writeJSON,
    findById,
    findByEmail,
    checkEmailUnique,
    create,
    hashPassword,
    encrypt,
    decrypt
};