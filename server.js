//use mysql or postges or mongo
const func = require('./node_util/functions')
const sessionHandler = require('express-session');
const crypto = require('crypto');
const cookie = require('cookie');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io').Server;
const cookieParser = require('cookie-parser');
const { send } = require('process');
const path = require('path');
const server =new io(http);
let config = {
    secret: 'uygGVBYYG8yG&12ygYg6637GRV4C',
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000, secure: false, httpOnly: true, secure: false },
    //store: new mysqlStore(db.sessionConfig, conn2)
}
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})
app.use(express.static('./public'))
app.use(express.query());
app.set('view engine', 'ejs')
app.use(sessionHandler(config));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '4kb' }));
server.on('connection',socket=>{
    server.emit('o','pp')
});
http.listen(port,()=>{
    console.log(`listening on port ${port}`);
})