import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const client: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.log("Redis Client Error", err));

export const getCachedData = async (key: string): Promise<any> => {
  try {
    const cachedData = await client.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    throw error;
  }
};

export const setCachedData = async (key: string, value: any): Promise<void> => {
  try {
    await client.set(key, JSON.stringify(value));
  } catch (error) {
    throw error;
  }
};

// delete cached data
export const deleteCachedData = async (key: string): Promise<void> => {
  try {
    await client.del(key);
  } catch (error) {
    throw error;
  }
};
