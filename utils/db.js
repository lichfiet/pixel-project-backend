import { createClient } from 'redis';

const redisClient = createClient({
  url: `${process.env.REDIS_URL}`,
  port: 6379
});

const db = {
    pg: {

    },
    redis: {
        connect: async () => {
            await redisClient.on('error', err => console.log('Redis Client Error', err));
            await redisClient.connect();
        },
        setPixel: async (index, color) => {
                
               return(await redisClient.set(`${index}`, `${color}`))

        },
        getCanvas: async () => {

            let keys = await redisClient.keys('*');

            const formattedKeys = async (keys) => {
                try {
                  let arr = [];
              
                  // Using Promise.all to wait for all async operations to complete
                  await Promise.all(keys.map(async (key) => {
                    const val = await redisClient.get(key);
                    arr[(key)] = val;
                  }));
              
                  return arr;
                } catch (error) {
                  console.error("Error in formattedKeys:", error);
                  throw error;
                }
              }


            const test1 = formattedKeys(keys)


            return(test1)
        },
        wipeCanvas: async () => {
          // drop canvas data
          await redisClient.flushAll();

          // seed canvas by adding 2500 white pixels
          for (let y = 0; y < 2500; y++) {
            await redisClient.set(`${y}`, `#ffffff`);
          }

          return('OK')
        }
    }
}

export default db