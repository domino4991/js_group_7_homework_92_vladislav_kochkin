const express = require('express');
const cors = require('cors');
const config = require('./config');
const mongoose = require('mongoose');
const expressWs = require('express-ws');
const users = require('./app/users');
const {nanoid} = require('nanoid');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
expressWs(app);
const PORT = 8000;

app.use(express.json());
app.use(cors());

const connections = {};
const activeUsers = {};

const run = async () => {
    await mongoose.connect(config.database, config.databaseOpt);
    console.log('Connected to MongoDB chatDB');
    app.use('/users', users);

    app.ws('/chat', async (ws, req) => {
        const token = req.query.token;
        if(!token) {
            ws.send(JSON.stringify({
                type: 'AUTH_ERROR',
                message: 'Нет токена.'
            }));
        }
        const user = await User.findOne({token});
        if(!user) {
            ws.send(JSON.stringify({
                type: 'USER_NOT_FOUND',
                message: 'Пользователь не найден.'
            }));
        }
        const id = nanoid();
        connections[id] = ws;
        activeUsers[id] = user.username;
        const messages = await Message.find().sort({datetime: 1}).populate('user', 'username -_id').limit(30);
        ws.send(JSON.stringify({
            type: 'LAST_MESSAGES',
            messages
        }));

        Object.keys(connections).forEach(connId => {
            const conn = connections[connId];
            conn.send(JSON.stringify({
                type: 'ACTIVE_USERS',
                activeUsers
            }));
        });

        ws.on('message', async (msg) => {
            const data = JSON.parse(msg);
            switch (data.type) {
                case 'CREATE_MESSAGE':
                    const message = {
                        user: user._id,
                        message: data.message
                    }
                    const newMessage = new Message(message);
                    await newMessage.save();
                    Object.keys(connections.forEach(connId => {
                        const conn = connections[connId];
                        conn.send(JSON.stringify({
                            type: 'NEW_MESSAGE',
                            message: {
                                user: user.username,
                                message: data.message
                            }
                        }));
                    }));
                    break;
                default:
                    console.log('No data type.');
                    break;
            }
        });

        ws.on('close', async () => {
            delete connections[id];
            delete activeUsers[id];
        });
    });

    app.use((req, res) => {
        res.status(404).send({error: '404 Page Not Found'});
    });

    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
};

run().catch(console.log);