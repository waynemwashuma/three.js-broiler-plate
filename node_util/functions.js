function hash(data) {
    return crypto.createHash('sha512').update(data).digest('hex')
}
function authenticateSocket(socket, next){
    if (typeof socket.handshake.headers.cookie !== "string") return next(new Error('unathorized'));
    if (!cookie.parse(socket.handshake.headers.cookie).sessId) return next(new Error('unathorized'));
    if (typeof socket.handshake.headers.cookie === "string") {
        let sid = cookie.parse(socket.handshake.headers.cookie), sd;
        if (typeof sid.sessId === "undefined") {
            console.log('no session made for user');
            return next(new Error('unathorized'))
        } else {
            conn.query('SELECT * FROM sessions WHERE sessId=?', [sid.sessId], (err, results) => {
                if (!err) {
                    if (!results.length) return next(new Error('unathorized'));
                    if (Date.now() < results[0].expires) console.log('session expired');
                    sd = JSON.parse(results[0].data);
                    clientHandler.resolveClient(sd.uid, sd.uname, socket.id);
                    next();
                }
                if (err) console.log(err.message);
            })
        }
    }
}