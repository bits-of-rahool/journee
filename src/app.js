import express from "express";
import defaultRouter from "./routes/default.route.js";
import userRouter from "./routes/user.route.js";
import journalRouter from "./routes/journal.route.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//routes
app.use("/user", userRouter);
app.use("/journal", journalRouter);
app.use("/", defaultRouter);

export { app };
