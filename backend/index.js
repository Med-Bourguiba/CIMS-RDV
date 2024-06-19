
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const rdvRoutes = require("./routes/rdv.route.js");
const paymentRouter = require("./routes/payment.js");

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from the backend !");
});


/* Routes*/
app.use("/rdvs", rdvRoutes);
app.use("/api", paymentRouter );


//Connection DB
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("\x1b[32m%s\x1b[0m", "database connected successfully !");
});


//listner
app.listen(process.env.PORT, () => {
  console.log(`app listning on port \x1b[33m  ${process.env.PORT} \x1b[0m`);
});
