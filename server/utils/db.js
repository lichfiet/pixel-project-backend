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
            console.log('Pixel set: ' + await redisClient.hSet(`pixel`, {
                    index: 1,
                    coordinate: '1, 1', 
                    color: "white"
                }));
        },
        getCanvas: async () => {
            let keys = await redisClient.hGetAll('pixel');

            console.log(keys)
            
            keys.forEach(async (key) => {

                console.log(key + ' ' + await redisClient.hGet(key))
            })
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

                await redisClient.hSet(`${y}`, {
                    index: y,
                    coordinate: coordinate, 
                    color: color
                });
            }

        },
        wipeCanvas: async () => {
            await redisClient.flushAll()
        }
    }
}

export default db