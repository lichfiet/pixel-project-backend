import { createClient } from 'redis';

const redisClient = createClient();

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
        seed: async () => {
            for (let y = 0; y < 2500; y++) {
                let val = Math.floor(Math.random() * (4 - 1 + 1) + 1);
                let color;



                await redisClient.set(`${y}`, `white`);
            }

        },
        wipeCanvas: async () => {
            await redisClient.flushAll()
        }
    }
}

export default db