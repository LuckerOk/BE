const net = require('net');

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

client.connect(8080, async () => {
    console.log('Connected!');

    client.write(JSON.stringify(FILTER))
});

client.on('data', data => {
    console.log(data.toString());
});

client.on('close', () => {
    console.log('Connection closed!');
});
