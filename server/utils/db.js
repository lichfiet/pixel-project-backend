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
        setPixel: async () => {
            console.log('Pixel set: ' + await redisClient.set(`1`, 'white'));
            console.log('Pixel set: ' + await redisClient.set(`1`, `green`));
        },
        getCanvas: async () => {

            let keys = await redisClient.keys('*');

            const formattedKeys = async (keys) => {
                try {
                  let arr = [];
              
                  // Using Promise.all to wait for all async operations to complete
                  await Promise.all(keys.map(async (key) => {
                    const val = await redisClient.get(key);
                    arr[(key - 1)] = val;
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
            for (let y = 1; y < 2501; y++) {
                let val = Math.floor(Math.random() * (4 - 1 + 1) + 1);
                let color;
                if (val === 1) {
                    color = "red";
                } else if (val === 2) {
                    color = "green";
                } else if (val === 3) {
                    color = "white";
                } else {
                    color = "blue";
                }

                const coordinate = `${Math.ceil(y / 50)}, ${y - ((Math.ceil(y / 50) - 1) * 50)}`

                await redisClient.set(`${y}`, `${color}`);
            }

        },
        wipeCanvas: async () => {
            await redisClient.flushAll()
        }
    }
}

export default db