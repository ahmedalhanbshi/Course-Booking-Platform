import Redis from 'ioredis';
import { config } from './index';

let redis: Redis;

try {
    const redisOptions = {
        maxRetriesPerRequest: 1,
        retryStrategy(times: number) {
            if (times > 3) {
                console.error('Redis connection retries exhausted. Disabling Redis retries.');
                return null;
            }
            return Math.min(times * 50, 2000);
        },
        // Fail fast if disconnected so service-level try/catch can handle gracefully
        enableOfflineQueue: false,
    };

    redis = config.redis.url
        ? new Redis(config.redis.url, redisOptions)
        : new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
            ...redisOptions,
        });

    redis.on('connect', () => {
        console.log('Redis connected successfully');
    });

    redis.on('error', () => {
        // Optional: suppress noisy connection errors in logs.
    });
} catch (error) {
    console.error('Failed to initialize Redis client:', error);
    redis = new Redis({ lazyConnect: true });
}

export default redis;
