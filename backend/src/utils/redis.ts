const { createClient } = require('redis');

async function initializeRedis() {
    const client = createClient({
  url: 'redis://127.0.0.1:6379'
});

    client.on('connect', () => console.log("Connected to Redis successfully!"));
    client.on('error', (err: any) => console.error('Redis client error', err));

    await client.connect();
    return client;
}