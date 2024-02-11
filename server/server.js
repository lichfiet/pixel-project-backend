import express from 'express'
import ViteExpress from 'vite-express'
import http from 'http'
import { Server } from 'socket.io'
import db from './utils/db.js'
import logger from './utils/logger.js'
import 'dotenv/config'

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('dist'))

const server = http.createServer(app)
const io = new Server(server)
ViteExpress.config({ printViteDevServerHost: true })

// routes
// app.get('/', (req, res) => {
//     res.sendFile('index.html', { root: '.' })
// })

await db.redis.connect();
await db.redis.wipeCanvas();
await db.redis.setPixel();
await db.redis.seed();

await db.redis.getCanvas();

app.get('/api', (req, res) => {
    res.json({Success: "true"})
})

app.get('/getCanvas', async (req, res) => {
    res.status(200).send(await db.redis.getCanvas())
});

app.put('/setPixel', async (req, res) => {
    res.status(200).send(await db.redis.getCanvas())
});

//on socket connection
io.on('connection', (socket) => {
    socket.on('disconnect', () => {})

    socket.on('pixel-update', async (data) => {

        logger.info(data.data)
        
        try {
            logger.info(await db.redis.setPixe(data.data.index, data.data.color))
        } catch (err) {
            logger.info(`An error occured updating the redis cache: ${err.message}`)
        }

        io.emit('pixel-update', {data: {index: data.data.index, color: data.data.color}});
    })

    socket.on('canvas-reset', async (data) => {

        try {
            await db.redis.wipeCanvas()
            await db.redis.seed()

            io.emit('canvas-reset', {data: 'Canvas Wiped'});
        } catch (err) {
            logger.error(err)
            io.emit('canvas-reset', {data: 'Canvas Not Wiped, Error'});
        }

    })
})

server.listen(8000, () => {
    logger.info(`Hold ctrl and click this: 
    /`)
})

//open server
ViteExpress.bind(app, server)