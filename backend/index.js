// require("dotenv").config();
const express = require("express");
const dotenv = require('dotenv');
dotenv.config();


require("./db/config");
const app = express();
const cors = require("cors");

const registerRoute = require("./route/user");
const loginRoute = require("./route/auth");

app.use(express.json());
app.use(cors());

app.use("/register", registerRoute); // Changed to a more conventional route
app.use("/login", loginRoute); // Changed to a more conventional route

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
 




















// ////////////////////////////////////////////////////////////////////////////////
// const express = require("express");

// const app = express();
// require("./db/config");
// const cors = require("cors");
// const schema = require("./db/schema");

// app.use(express.json());
// app.use(cors());

// app.post("/register", async (request, respond) => {
//   let user = new schema(request.body);
//   let result = await user.save();
//   result = result.toObject();
//   delete result.password;
//   respond.send(result);
// });

// app.post("/login", async (request, respond) => {
//   // resp.send(req.body);
//   // console.log(req.body);

//   if (request.body.password && request.body.email) {
//     let user = await schema.findOne(request.body).select("-password");

//     if (user) {
//       respond.send(user);
//     } else {
//       respond.send({ result: "No User Found." });
//     }
//   } else {
//     respond.send({ resut: "No User Found." });
//   }
// });

// app.listen(5000);
