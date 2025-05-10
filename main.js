const express = require("express");
const {Client, LocalAuth} = require("whatsapp-web.js");
const qr2 = require("qrcode");
require("dotenv").config();

// new
const { startGrpcServer } = require("./services/grpc-server");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "pages");

const session = new Client({
    authStrategy: new LocalAuth({
        dataPath: "session",
        clientId: "primary",
    }),
});

let tokenQr = null;

session.on("qr", (qr) => {
    tokenQr = qr;
    console.log("qr", qr);
});

session.on("ready", () => {
    tokenQr = false;
    console.log("Login successful");
});

app.get("/", (req, res) => {
    res.send("grpc version whatsapp service");
});

app.get("/whatsapp/login", async (req, res) => {
    if (tokenQr === null) return res.send("please try later");
    if (tokenQr === false) return res.send("Login successful");
    qr2.toDataURL(tokenQr, (err, src) => {
        if (err) return res.status(500).send("Error occured");
        return res.render("qr", {img: src});
    });
}); 


session.initialize();

session.on("ready", () => {
    startGrpcServer(session);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
