//! -------= TO DO =-------
//// - create prod and dev env files 
//// - move project to docker for redis and docker for prod node server
//? - Add messaging queues to scale to infinity
//? - Rework grid into html grid for better performance maybe



/** 
 * * Import Dependencies 
 */
import express from 'express'
import ViteExpress from 'vite-express'
import http from 'http'
import { Server } from 'socket.io'
import db from './utils/db.js'
import logger from './utils/logger.js'
import dotenv from 'dotenv'
import cors from 'cors'

/** 
 * * Define Variables && Setup 
 */

// Load Env Vars
dotenv.config()
// Define And Init Server
const app = express()
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('dist'))
// Create Server
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["http://place.trevorlichfield.xyz:8000/", ""],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
  });
ViteExpress.config({ printViteDevServerHost: true })
// Connect and Reset Redis
await db.redis.connect(); 
await db.redis.wipeCanvas();



/**
 * * API Routes
 * 
 * ? - /health | for health check
 * ? - /getCanvas | to get canvas data on load
 * 
 */

//* Health Check
app.get('/health', (req, res) => {
    res.json({Success: "true"})
})

//* Get Ganvas Data
app.get('/getCanvas', async (req, res) => {
    res.status(200).send(await db.redis.getCanvas())
});



/**
 * * Web Socket Events
 */
io.on('connection', (socket) => {
    socket.on('disconnect', () => {})


    /** Pixel Update Event */
    socket.on('pixel-update', async (data) => {
        try {
            logger.info(`Setting Index ${data.data.index}, Redis Response: ` + await db.redis.setPixel(data.data.index, data.data.color))
        } catch (err) {
            logger.info(`An error occured updating the redis cache: ${err.message}`)
        }

        io.emit('pixel-update', {data: {index: data.data.index, color: data.data.color}});
    })


    /** Canvas Reset Event */
    socket.on('canvas-reset', async () => {
        try {            
            logger.info(`Canvas Wiped By User, Redis Response: ` + await db.redis.wipeCanvas())
            io.emit('canvas-reset', {data: {message: 'Canvas Wiped', canvas: await db.redis.getCanvas()}});
        } catch (err) {
            logger.error(err)
            io.emit('canvas-reset', {data: `Canvas Not Wiped, Error ${err.message}`});
        }

    })
})

server.listen(8000, () => {
    logger.info(`Hold ctrl and click this: ${process.env.VITE_SERVER_URL}/`)
})

//open server
ViteExpress.bind(app, server)