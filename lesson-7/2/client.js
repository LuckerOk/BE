const net = require('net');

const { PORT } = require('./config');

const client = new net.Socket();

const FILTER = {
    filter: {
        name: {
            first: 'Ron',
        },
        phone: '89',
        email: '@hotmail.com',
    },
    meta: {
        format: 'csv',
        archive: true,
    }
}

client.connect(PORT, async () => {
    console.log('Connected!');

    client.write(JSON.stringify(FILTER))
});

client.on('data', data => {
    console.log(data.toString());
});

client.on('close', () => {
    console.log('Connection closed!');
});
