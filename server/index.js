import express from "express";
import http from "http";
import cors from "cors";
import con from "./configdb.js";
import {router} from "./controllers/main.js"
import cookieParser from "cookie-parser";
import setupSocketIO from "./socket.js";
import eventBus from "../eventbus.js";


const app = express();
const server = http.createServer(app);
const io = setupSocketIO(server);



function event_handler(data,ids,title){
    for (const [socketId, socket] of io.of("/").sockets) {
        if (ids.includes(socket.user.id)) {
            socket.emit(title, data);
        }
    }
}

eventBus.on("taskupdate", (payload) => {
    event_handler(payload.data,payload.ids,"taskupdate");
});
eventBus.on("taskdelete", (payload) => {
    event_handler(payload.data,payload.ids,"taskdelete");
});
eventBus.on("taskdeleteall",(payload)=>{
    event_handler(payload.data,payload.ids,"taskdeleteall")
})
eventBus.on("Admintaskupdate", (payload) => {
    console.log("admin_update")
    event_handler(payload.data,payload.ids,"Admintaskupdate");
});
eventBus.on("Admintaskdelete", (payload) => {
    event_handler(payload.data,payload.ids,"Admintaskdelete");
});
eventBus.on("teamupdate", (payload) => {
    event_handler(payload.data,payload.ids,"teamtaskupdate");
});
eventBus.on("teamdelete", (payload) => {
    event_handler(payload.data,payload.ids,"teamtaskdelete");
});
eventBus.on("userupdate", (payload) => {
    console.log("userupdate", payload.data)
    io.emit("userupdate", payload.data);
});
eventBus.on("userdelete", (payload) => {
    console.log("userdelete", payload.data)
    io.emit("userdelete", payload.data);
}
);
eventBus.on("updateteams",(payload)=>{
    event_handler(payload.data,payload.ids, "teamsupdate")
})
eventBus.on("deleteteams",(payload)=>{
    event_handler(payload.data,payload.ids,"teamsdelete")
})

eventBus.on("updateAdminteam",(payload)=>{
    event_handler(payload.data,payload.ids,"updateAdminteamtask")
}
);

eventBus.on("deleteAdminteam",(payload)=>{
    event_handler(payload.data,payload.ids,"deleteAdminteamtask")
}
);

eventBus.on("teamchange",(payload)=>{
    event_handler(payload.data,payload.ids,"teamchange")
})

eventBus.on("logout",(payload)=>{
    for (const [socketId, socket] of io.of("/").sockets) {
        if (payload.ids.includes(socket.user.id)) {
            socket.disconnect(true);
        }
    }
});

function Error_handler(err,req,res,next){
    const status = err.code || 500;
    console.log(err.message)
    if(err.code)
    res.status(status).json({
        err: err.message || "internal_error" 
    })
    else{
        res.status(status).json({err: "internal_error"})
    }


}

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
app.use(cookieParser());
app.use(express.json());
app.use("/",router);
app.use(Error_handler)
server.listen(8100, () => {
    console.log("Server is running on port 8100");
});