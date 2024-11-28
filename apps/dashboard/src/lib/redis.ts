import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

export const getCachedData = async (key: string) => {
  await client.connect();
  const cachedData = await client.get(key);
  await client.disconnect();
  return cachedData;
};

export const setCachedData = async (key: string, value: any) => {
  await client.connect();
  await client.set(key, value);
  await client.disconnect();
};
