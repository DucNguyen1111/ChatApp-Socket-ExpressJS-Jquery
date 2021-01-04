var express = require('express');
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app);
server.listen(3000);
var io = require("socket.io")(server);

var users = [];

io.on("connection", function (socket) {
    console.log("co nguoi ket noi 1", socket.id);

    socket.on("Client-send-user", function (data) {
        var index = users.indexOf(data);
        if (index !== -1) {
            socket.emit("Server-send-failRegister");
        }
        else {
            users.push(data);
            socket.username = data;
            socket.emit("Server-send-successRegister", data);

            io.sockets.emit("Server-send-listUser", users);
        }
    });

    socket.on("disconnect", function () {
        console.log(socket.id, " ngat ket noi");

    });

    socket.on("logout", function () {
        var index = users.indexOf(socket.username);
        if (index !== -1) {
            users.splice(
                users.indexOf(socket.username), 1
            );
            socket.broadcast.emit("Server-send-listUser", users);
        }
    });
    socket.on("User-send-message", function (data) {
        let messageBlock = {
            id: socket.id,
            user: socket.username,
            message: data
        };
        io.sockets.emit("Server-send-message", messageBlock);
    });
});

app.get("/", function (req, res) {
    res.render("trangchu");
});








// socket.on("Client-send-data", function (data) {
    //     //console.log(data);
    //     // everyone can receive
    //     //io.sockets.emit("Server-send-data", data + "888");


    //     // only you can receive
    //     //socket.emit("Server-send-data", data + "888");

    //     // everyone can receive except you
    //     //socket.broadcast.emit("Server-send-data", data + "888");
    // })