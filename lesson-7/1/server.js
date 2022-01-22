const net = require('net');
const fs = require('fs/promises');
const path = require('path');

const { validateFields } = require('./utils/validator');
const { findUsers } = require('./utils/users');

const server = net.createServer();
const PORT = process.env.PORT || 8080;

let users = null

server.on('connection', async socket => {
    console.log('New client connected!');

    socket.on('data', async msg => {
        const filterObj = JSON.parse(msg.toString());

        validateFields(filterObj);

        const resUsers = findUsers(users, filterObj);

        socket.write(JSON.stringify(resUsers));
    });

    socket.on('end', () => {
        console.log('Client is disconnected!');
    });
});

server.on('listening', async () => {
    const { port } = server.address();

    const file = await fs.readFile(path.resolve('./data/users.json'), 'utf-8');

    users = JSON.parse(file);

    console.log(`TCP Server started on port ${port}!`);
});

server.listen(PORT);
