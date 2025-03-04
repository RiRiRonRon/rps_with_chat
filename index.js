const express=require("express");
const app =express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
const io= new Server(server);

const rooms = {};



app.get('/3asba',(req,res)=>{
    res.send("3asba 3asba 3asba");
})


app.use(express.static('player'));

io.on('connection',(socket)=>{
    console.log("a player is connnected");

    socket.on('disconnect', () => {
        console.log("A player has disconnected");
    });
    socket.on('createGame',()=>{
        const roomUniqueId=makeid(5);
        console.log(roomUniqueId)
        rooms[roomUniqueId] ={};
        socket.join(roomUniqueId);
        socket.emit("newGame",{roomUniqueId:roomUniqueId});
        socket.emit("joinChat",{roomUniqueId:roomUniqueId});


    })
    socket.on("joinGame",(data)=>{
        if (rooms[data.roomUniqueId] != null) {
            socket.join(data.roomUniqueId);
            socket.to(data.roomUniqueId).emit('playersConnected',{});
            socket.emit("playersConnected");
            socket.emit("joinChat",{roomUniqueId:data.roomUniqueId});
            

        }

    })
    socket.on("p1Choice",(data)=>{
        let rpschoice=data.rpschoice;
        rooms[data.roomUniqueId].p1Choice = rpschoice;
        socket.to(data.roomUniqueId).emit("p1Choice",{rpschoice: data.rpschoice});
        if (rooms[data.roomUniqueId].p2Choice != null) {
            declareWinner(data.roomUniqueId);
        }


    })
    socket.on("p2Choice",(data)=>{
        let rpschoice= data.rpschoice;
        
        rooms[data.roomUniqueId].p2Choice = rpschoice;
        socket.to(data.roomUniqueId).emit("p2Choice",{rpschoice: data.rpschoice});
        if (rooms[data.roomUniqueId].p1Choice != null){
            declareWinner(data.roomUniqueId);
        }
    })
    socket.on("send-message",(message,roomUniqueId)=>{
        socket.to(roomUniqueId).emit("receive-message",message);
    })



    


});



server.listen('3000',()=>{
    console.log('testing testing testing');
})


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function declareWinner(roomUniqueId){
    let p1Choice=rooms[roomUniqueId].p1Choice;
    let p2Choice=rooms[roomUniqueId].p2Choice;
    let winner= null;
    if (p1Choice===p2Choice){
        winner="d";
    }else if (p1Choice == "War9a") {
        if (p2Choice == "M9as") {
            winner = "p2";
            

        } else {
            winner = "p1";
            
        }
    } else if (p1Choice == "Hajra") {
        if (p2Choice == "War9a") {
            winner = "p2";
            
        } else {
            winner = "p1";
            
        }
    } else if (p1Choice == "M9as") {
        if (p2Choice == "Hajra") {
            winner = "p2";
            
        } else {
            winner = "p1";
            
        }

}
    io.sockets.to(roomUniqueId).emit('result',{winner:winner})
    rooms[roomUniqueId].p1Choice = null;
    rooms[roomUniqueId].p2Choice = null;

}

