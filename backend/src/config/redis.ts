import { createClient } from "redis";

export let redisClient: ReturnType<typeof createClient>; 

export async function initializeRedis() {
    redisClient = createClient({
  url: 'redis://127.0.0.1:6379'
});

    redisClient.on('connect', () => console.log("Connected to Redis successfully!"));
    redisClient.on('error', (err: any) => console.error('Redis client error', err));

    await redisClient.connect();
    return redisClient;
}

