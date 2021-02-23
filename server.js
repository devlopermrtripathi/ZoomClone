//Server Side 
const express = require('express');
const app = express();
const { v4: uuidv4} = require('uuid');
const server = require('http').Server(app); // created a web server that will listen 
const io = require('socket.io')(server);
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug : true
});

app.use('/peerjs',peerServer);
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{
        roomId : req.params.room
    })
})

io.on('connection',socket=>{ // This is responsible for listening the message
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId);
        socket.on('message',message =>{
            io.to(roomId).emit('createMessage',message);
        })
    })
})

server.listen(process.env.PORT||'3000',()=>{
    console.log('Connected to port 3000...');
})

