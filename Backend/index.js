const express = require("express");

// const cookiePar = require("cookie-parser");
// const bcrypt = require('bcrypt')
const {router} = require("./src/users/routes");
const app = express();

// app.use(cookiePar());
app.use(express.json());
app.use("/api/users",router);

app.get("/",(req,res) =>{
  res.send("Trend Stack backend is working")
})

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
