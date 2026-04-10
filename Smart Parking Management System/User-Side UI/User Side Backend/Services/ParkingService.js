const { Server } = require("socket.io");
const Parking = require("../Models/ParkingModel.js");


function setupWebSocket(server) {
    const io = new Server(server, { cors: { origin: "*" } });

    io.on('connection', (socket) => {
        console.log("Connected via WebSocket successfully");
        Parking.findOne().then((data) => {
            socket.emit('parkingUpdate', data);
        });
    });

    setInterval(async () => {
        const data = await Parking.findOne();
        io.emit('parkingUpdate', data);
    },1000);
}


module.exports = { setupWebSocket };