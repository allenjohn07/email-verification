import axios from 'axios'

export const instance = axios.create({
    // baseURL: 'http://localhost:6500',
    baseURL: 'https://email-verification-server.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
})