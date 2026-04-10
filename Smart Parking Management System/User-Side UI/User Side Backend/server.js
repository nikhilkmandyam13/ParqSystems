const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const { setupWebSocket } = require("./Services/ParkingService.js");
const cors = require("cors");
const ParkingRoutes = require("./routes/ParkingRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', ParkingRoutes);



const server = http.createServer(app);


setupWebSocket(server);


mongoose.connect("mongodb+srv://KanishkSanadi:Ludovico@kanishks-cluster.imvlvbw.mongodb.net/Smart-Parking-System?retryWrites=true&w=majority&appName=Kanishks-Cluster", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database successfully");
}).catch((error) => {
    console.log("Could not connect to database due to error : " + error);
});


server.listen(5000, () => {
    console.log("Backend running successfully");
});