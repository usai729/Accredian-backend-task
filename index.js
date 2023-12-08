const express = require("express");
const cors = require("cors");

const UserRoute = require("./Routes/UserRoute");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", UserRoute);

app.listen(3001, () => {
  console.log(`Connected to http://localhost:3001`);
});
