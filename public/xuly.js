var socket = io("http://localhost:3000");

socket.on("Server-send-failRegister", function () {
    alert("User da ton tai");
});


socket.on("Server-send-successRegister", function (data) {
    $("#currentUser").html(data);
    $("#loginForm").hide();
    $("#chatForm").fadeIn("slow");
    $("#body").css("background", "white");

});

socket.on("Server-send-listUser", function (data) {
    $("#boxContent").html("");
    data.forEach(function (item) {
        $("#boxContent").append("<div class = 'user'>" + item + "</div>");
    });
});
socket.on("Server-send-message", function (data) {
    if (data.id === socket.id) {
        $("#listMessage").append("<div class = 'block-message'><div class =' message float-right'>" + data.user + ' : ' + data.message + "</div></div>");
    }
    else {
        $("#listMessage").append("<div class = 'block-message-left'><div class='message float-right'>" + data.user + ' : ' + data.message + "</div></div>");
    }
    var pos = document.getElementById('listMessage').scrollHeight;
    document.getElementById('listMessage').scrollTop = pos;
});

$(document).ready(function () {
    $("#loginForm").show();
    $("#chatForm").hide();

    // resgister
    $("#btnRegister").click(function () {
        var value = $("#txtUsername").val();
        if (value.trim() === "") {
            alert("ban phai nhap");
        }
        else {
            value = value.trim();
            socket.emit("Client-send-user", value);

        }
    });
    $("#txtUsername").keydown(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            var value = $("#txtUsername").val();
            if (value.trim() === "") {
                alert("ban phai nhap");
            }
            else {
                value = value.trim();
                socket.emit("Client-send-user", value);

            }
        }
    });

    // logout
    $("#btnLogout").click(function () {
        socket.emit("logout");
        $("#chatForm").hide();
        $("#loginForm").fadeIn(2000);
    });
    // send message
    $("#btnSendMessage").click(function () {
        var message = $("#txtMessage").val();
        message = message.trim();
        var pos = document.getElementById('listMessage').scrollHeight;
        if (message !== "") {
            socket.emit("User-send-message", message);
            $("#txtMessage").val("");
        }
    });
    $("#txtMessage").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            var message = $("#txtMessage").val();
            message = message.trim();
            var pos = document.getElementById('listMessage').scrollHeight;
            if (message !== "") {
                socket.emit("User-send-message", message);
                $("#txtMessage").val("");
            }
        }
    });
});