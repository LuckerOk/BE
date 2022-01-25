const { createServer } = require('net');
const path = require('path');
const { createGzip } = require('zlib');
const fsPromises = require('fs/promises');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream/promises');

const Json2csv = require('./src/Json2csv');
const { findUsers } = require('./src/utils/users');
const { validateFields, validateMeta } = require('./src/utils/validator');

const server = createServer();
const PORT = process.env.PORT || 8080;

const formatToCsv = async (users) => {
    const json2csv = new Json2csv()
    const csvData = json2csv.transform(users);

    await fsPromises.writeFile(path.resolve('./src/data/resUsers.csv'), csvData, 'utf-8');

    return fsPromises.readFile(path.resolve('./src/data/resUsers.csv'), 'utf-8');
}

const archive = async (source) => {
    const gzip = createGzip();
    const destination = createWriteStream(path.resolve('./src/data/resUsers.gz'));

    await pipeline(source, gzip, destination);

    return fsPromises.readFile(path.resolve('./src/data/resUsers.gz'), 'utf-8');
}

server.on('connection', async socket => {
    console.log('New client connected!');

    const file = await fsPromises.readFile(path.resolve('./src/data/users.json'), 'utf-8');

    const users = JSON.parse(file);

    socket.on('data', async msg => {
        const filterObj = JSON.parse(msg.toString());

        validateFields(filterObj.filter);
        validateMeta(filterObj.meta);

        const { filter, meta: { format: isFormat, archive: isArchive } } = filterObj

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
                await fsPromises.writeFile(path.resolve('./src/data/resUsers.json'), JSON.stringify(resUsers), 'utf-8');

                const file = await fsPromises.readFile(path.resolve('./src/data/resUsers.json'), 'utf-8');

                const archivedFile = await archive(file);

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
