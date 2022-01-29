const net = require('net');
const fs = require('fs/promises');
const path = require('path');

const { validateFields } = require('./utils/validator');
const { findUsers } = require('./utils/users');
const { PORT } = require('./config');

const server = net.createServer();

server.on('connection', async socket => {
    console.log('New client connected!');

    socket.on('data', async msg => {
        const filterObj = JSON.parse(msg.toString());

        validateFields(filterObj);

        const file = await fs.readFile(path.resolve('./data/users.json'), 'utf-8');

        const users = JSON.parse(file);

        const resUsers = findUsers(users, filterObj);

        socket.write(JSON.stringify(resUsers));
    });

    socket.on('end', () => {
        console.log('Client is disconnected!');
    });
});

server.on('listening', async () => {
    const { port } = server.address();

    console.log(`TCP Server started on port ${port}!`);
});

server.listen(PORT);
