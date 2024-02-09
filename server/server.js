import express from 'express'
import ViteExpress from 'vite-express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('dist'))

const server = http.createServer(app)
const io = new Server(server)
ViteExpress.config({ printViteDevServerHost: true })

// routes
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '.' })
})

app.get('/api', (req, res) => {
    res.json({Success: "true"})
})

server.listen(8000, () => {
    console.log(`Hold ctrl and click this: http://localhost:8000/`)
})

//open server
ViteExpress.bind(app, server)
