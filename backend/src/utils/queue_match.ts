import { createClient } from 'redis'; 

type RedisClientType = ReturnType<typeof createClient>;

export async function joinQueueAndMatch(
    client: RedisClientType,
    mode: "text" | "video",
    userId: string | number
) {
    const key_mode = `queue:${mode}`;
    const timestamp = Date.now();

    const luaScript = `
        redis.call('ZADD', KEYS[1], ARGV[1], ARGV[2])
        local waitingUsers = redis.call('ZRANGE', KEYS[1], 0, 1)
        if #waitingUsers >= 2 then
            local user1 = waitingUsers[1]
            local user2 = waitiingUsers[2]
            redis.call('ZREM', KEYS[1], user1, user2)
            return { user1, user2 }
        end 
        return nil
    `;

    try {
        const matchedPair = await client.eval(luaScript, {
            keys: [key_mode],
            arguments: [String(timestamp), String(userId)]
        }) as string[] | null;

        if (matchedPair && matchedPair.length === 2) {
            const friendId = matchedPair[0] === String(userId) ? matchedPair[1] : matchedPair[0];
            const roomId = `room:${mode}:${Math.random().toString(36).substring(2, 11)}`;
            return { status: 'matched', friendId, roomId };
        }
        return { status: 'waiting' };
    } catch (error) {
        console.error('Error in matching', error);
        throw error;
    }
}