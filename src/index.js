const path = require('path')
const express = require('express')
const http = require('http')

const {set,generateLocationMessage} = require('./utils/time')
const {addUsers,getUser,getUsersInRoom,removeUser} = require('./utils/users')

const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)


const io = socketio(server)
const port= process.env.port || 3000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('connection established')

    socket.on('sendMessage',(msg,callback)=>{
        const user = getUser(socket.id)
        
        io.to(user.room).emit('message',set(msg,user.username))
        callback('message delivered')
        
        
    })

    socket.on('location',(position,callback)=>{
        const user = getUser(socket.id)
        console.log(user)
        io.to(user.room).emit('locationmessage',generateLocationMessage
        (`https://google.com/maps?q=${position.latitude},${position.longitude}`,user.username))
        callback('location delivered')
    })

    socket.on('join',(options,callback)=>{

        const {error,user} = addUsers({id:socket.id,...options})

        if(error)
            return callback(error)
            
        socket.join(user.room)

        socket.emit('message',set('welcome','admin'))
        socket.broadcast.to(user.room).emit('message',set(`${user.username} has joined`,'admin'))
        io.to(user.room).emit('userlist',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',set(`${user.username} has left`,'admin'))
            io.to(user.room).emit('userlist',{room:user.room,users:getUsersInRoom(user.room)})
        }
    })

    // socket.emit('countUpdated',count)

    // socket.on('increment',()=>{
    //     count++
    //     io.emit('countUpdated',count)                        
    // })
})


server.listen(port,()=>{
    console.log(`server has started on port ${port}`)
})