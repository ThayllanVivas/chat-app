const express = require('express')
const app = express()
const PORT = 4000

const http = require('http').Server(app)
const cors = require('cors')

const socketIO = require('socket.io') (http, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

let users = [];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected`)

    socket.on('message', (data) => {
        socketIO.emit('messageResponse', data)
    })

    //Listen when a new user joins the server
    socket.on('newUser', (data) => {
        //Adds the new user to the list of users
        users.push(data)
        // console.log(users)
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users)
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typingResponse', data)
    })

    socket.on('notTyping', (data) => {
        socket.broadcast.emit('typingResponse', '')
    })

    socket.on('disconnect', () => {
        console.log('🔥: a user disconnected')
        users = users.filter((user) => user.socketID !== socket.id)
        // console.log(users)
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users)
        socket.disconnect()
    })
})

app.get('/api', (req, res) => {
    res.json({
        message: 'Hello World'
    })
})

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})