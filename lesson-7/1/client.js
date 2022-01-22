const net = require('net');

const client = new net.Socket();

const FILTER = {
    name: {
        first: 'Ron',
    },
    phone: '89',
    email: '@hotmail.com',
}

client.connect(8080, async () => {
    console.log('Connected!');

    client.write(JSON.stringify(FILTER))
});

client.on('data', data => {
    console.log(JSON.parse(data.toString()));
});

client.on('close', () => {
    console.log('Connection closed!');
});
