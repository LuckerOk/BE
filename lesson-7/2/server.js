const { createServer } = require('net');
const path = require('path');
const fsPromises = require('fs/promises');

const { PORT } = require('./config');
const { findUsers } = require('./src/utils/users');
const { formatToCsv, archive } = require('./src/utils/files');
const { validateFields, validateMeta } = require('./src/utils/validator');
const { ENCODING, usersJsonPath, resUsersJsonPath } = require('./src/constants');

const server = createServer();

server.on('connection', async socket => {
    console.log('New client connected!');

    socket.on('data', async msg => {
        const filterObj = JSON.parse(msg.toString());

        validateFields(filterObj.filter);
        validateMeta(filterObj.meta);

        const { filter, meta: { format: isFormat, archive: isArchive } } = filterObj;

        const file = await fsPromises.readFile(path.resolve(usersJsonPath), ENCODING);

        const users = JSON.parse(file);

        const resUsers = findUsers(users, filter);

        if (isFormat) {
            const file = await formatToCsv(resUsers);

            if (isArchive) {
                const archivedFile = await archive(file);

                socket.write(archivedFile);
            } else {
                socket.write(file);
            }
        } else {
            if (isArchive) {
                await fsPromises.writeFile(path.resolve(resUsersJsonPath), JSON.stringify(resUsers), ENCODING);

                const archivedFile = await archive(JSON.stringify(resUsers));

                socket.write(archivedFile);
            }
        }
    });

    socket.on('end', () => {
        console.log('Client is disconnected!');
    });
});

server.on('listening', () => {
    const { port } = server.address();

    console.log(`TCP Server started on port ${port}!`);
});

server.listen(PORT);
