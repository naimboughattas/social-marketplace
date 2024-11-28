const { createClient } = require("redis");

const client = createClient({
  url: "redis://default:YaTJGD3f2z4ShliZ2mHZ3Og8uK05mQGh@redis-16673.c83.us-east-1-2.ec2.redns.redis-cloud.com:16673",
});

client.on("error", (err) => console.log("Redis Client Error", err));

export const getCachedData = async (key) => {
  await client.connect();
  const cachedData = await client.get(key);
  await client.disconnect();
  return cachedData;
};

export const setCachedData = async (key, value) => {
  await client.connect();
  await client.set(key, value);
  await client.disconnect();
};
