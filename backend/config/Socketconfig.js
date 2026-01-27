import {Server} from 'socket.io';
import express from 'express';
import http from 'http';
import cors from 'cors';
import {socketMiddleware} from '../middlewares/socket.middleware.js'
import Group from '../models/group.models.js'



const app=express();
app.use(cors({
        origin:'http://localhost:5173',
        credentials:true,
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders:['Content-Type','Authorization']
    }));

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        credentials:true,
        
    }
})

 const mapUserIdtoSocket={};
io.use(socketMiddleware);

export const findUsersocketid=(userId)=>{
return mapUserIdtoSocket[userId]
}

io.on('connection', async(socket)=>{

    console.log("socket connected-",socket.user.name);
    mapUserIdtoSocket[socket.userId]=socket.id;

    io.emit("getonlineusers",Object.keys(mapUserIdtoSocket));

    //auto join group on connectioin

    try{
        const groups=await Group.find({members:socket.userId}).select("_id");
        groups.forEach(group=>{
            socket.join(group._id.toString())
            console.log(`${socket.user.name} joined group: ${group._id}`)
        })

    }
    catch(err){
        console.log(err)
    }

    socket.on("Leavegroup",(groupid)=>{
        socket.leave(groupid.toString())
        console.log(`${socket.user.name} left group: ${groupid}`);
    })




    socket.on('disconnect',()=>{
        console.log("socket disconnected",socket.user.name);
        delete mapUserIdtoSocket[socket.userId]

    })



})






export  {io,app,server};



