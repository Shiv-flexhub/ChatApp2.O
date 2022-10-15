const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require("cors");
const { addUsers, removeUsers, getUsers, getUsersInRoom } = require('./users')


const PORT = process.env.PORT || 5000;

const router = require("./router");
const { use } = require('./router');

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(router);

const io = new Server(server, {
    cors: {
      origin: "https://chatapp2-o.herokuapp.com/",
      methods: ["GET", "POST"]
    }
  });
  



io.on('connect',(socket)=>{

    socket.on('join',({name,room},callback)=>{
      const {error, user} = addUsers({id:socket.id,name,room});

      if(error)  return callback(error)
      

      socket.broadcast.to(user.room).emit('message',{ user:'Admin', text:`${user.name} has joined!!` });
      
      socket.emit('message', { user:'Admin',text:`${user.name}, welcome to ${user.room}` });

      socket.join(user.room)

      io.to(user.room).emit('roomData',{room: user.room, users: getUsersInRoom(user.room)});
      
      callback();
    });
    
    socket.on('sendMessage',(message, callback) => {
      const user = getUsers(socket.id);
      
      io.to(user.room).emit('message',{ user: user.name, text: message });
      io.to(user.room).emit('roomData',{room: user.room, users: getUsersInRoom(user.room)});

      callback();
    })

    socket.on('disconnect',()=>{
        const user = removeUsers(socket.id);
        if(user){
          io.to(user.room).emit('message',{ user: 'Admin', text: `${user.name} has left!!` });
        }
    })
})

if(process.env.NODE_ENV === 'production'){
  app.use(express.static("client/build"))
}


server.listen(PORT, ()=>{ 
    console.log(`Server is running on port ${PORT}`)
})