import express from 'express'
import ViteExpress from 'vite-express'
import http from 'http'
import { Server } from 'socket.io'
import db from './utils/db.js'

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

        console.log(data.data)
        
        try {
            console.log(await db.redis.setPixel(data.data.index, data.data.color))
        } catch (err) {

        }

        io.emit('pixel-update', {data: {index: data.data.index, color: data.data.color}});
    })
})

server.listen(8000, () => {
    console.log(`Hold ctrl and click this: http://localhost:8000/`)
})

//open server
ViteExpress.bind(app, server)