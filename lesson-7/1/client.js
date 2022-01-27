const net = require('net');

const { PORT } = require('./config');

const client = new net.Socket();

const FILTER = {
    name: {
        first: 'Ron',
    },
    phone: '89',
    email: '@hotmail.com',
}

client.connect(PORT, async () => {
    console.log('Connected!');

    client.write(JSON.stringify(FILTER))
});

client.on('data', data => {
    console.log(JSON.parse(data.toString()));
});

client.on('close', () => {
    console.log('Connection closed!');
});
