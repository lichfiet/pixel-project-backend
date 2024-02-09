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
            console.log('Pixel set: ' + await redisClient.set('1, 1', 'green'));
        },
        getCanvas: async () => {

            let keys = await redisClient.keys('*');

            console.log("meow")
            console.log(keys)
            keys.forEach(async (key) => {
                
                    console.log("each")

                    await redisClient.get(key, (err, value) => {
                        if (err) {
                            console.log(`${key}: ${value}`);
                        } else {
                            console.log(`${key}: ${value}`);
                        }
                    })
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

                const coordinate = `${Math.ceil(y / 50)} ${y - ((Math.ceil(y / 50) - 1) * 50)}`

                console.log(color)
                await redisClient.set((`${coordinate}`), color);
            }

        }
    }
}

export default db