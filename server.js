const express = require("express");
const app = express();

const host = "127.0.0.1";
const port = process.env.PORT || 4000;

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

// const path = require("path");

//跨來源資源共用（Cross-Origin Resource Sharing，簡稱 CORS）機制提供了網頁伺服器跨網域的存取控制，增加跨網域資料傳輸的安全性
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const RoutesMain = require("./routes/Mainroutes");
const RoutesGrades = require("./routes/Graderoutes");
const RoutesNote = require("./routes/Noteroutes");
//WebSocket
// const io = require("socket.io")(server);
// const io = require("socket.io")
// io = socket(server)
//view setting
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

mongoose.connect(
  process.env.MONGODB_ACCESS_TOKEN,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to MongoDB")
);

//開啟socket監聽
// io.on("connection", (socket) => {
//   console.log("Socket connected");
//   //監聽透過connection連進的事件
//   //getMessage 是可自定義的名稱
//   socket.on("getMessage", (message) => {
//     //回傳message給Client
//     //emit 為回覆訊息的function -> 只會回覆對應的function
//     socket.emit("getMessage", message);
//   });
// });
//使用Router
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ROUTER,
    credentials: true,
  })
);
//Middleware----------------------------------------------------------------
//引入body-parser(用於解析json, row, txt, URL-encoded格式)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extends: true }));
app.use(express.static(path.join(__dirname, "public")));

/** For session key
 * @param {Object} [options]
 * @param {Object} [options.cookie] Options for cookie
 * @param {Function} [options.genid]
 * @param {String} [options.name=connect.sid] Session ID cookie name
 * @param {Boolean} [options.proxy]
 * @param {Boolean} [options.resave] Resave unmodified sessions back to the store
 * @param {Boolean} [options.rolling] Enable/disable rolling session expiration
 * @param {Boolean} [options.saveUninitialized] Save uninitialized sessions to the store
 * @param {String|Array} [options.secret] Secret for signing session ID
 * @param {Object} [options.store] MemoryStore Session store
 * @param {String} [options.unset]
 */
app.use(
  session({
    //驗證資料方式
    secret: "secretcode",
    //是否強制重新儲存至Store內
    resave: true,
    //是否強制將未初始化的 Session 儲存至 Store
    saveUninitialized: true,
  })
);
//可用req.session.key取用資料
app.use(cookieParser("secretcode"));
//passport.initialize()：確認 passport.user 是否已存在，若沒有則初始化一個空的。
//passport.session()：用以處理 Session。若有找到 passport.user，則判定其通過驗證，並呼叫 deserializeUser()
//passport.authenticate()：用以驗證使用者。可設定要採用的 Strategy、驗證成功與失敗導向的頁面。
//ensureAuthenticated()：客製化 middleware，用以確認其為「已驗證」的狀態，並導向頁面。
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport); //取得passportConfig的passport
// app.get("/", (req, res, next) => {
//   res.render("test");
// });
//----------------------------------------------------------------
app.post("/app/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      res.send(process.env.LOGIN_FAIL);
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send(req.user);
        // console.log(req.user);
      });
    }
  })(req, res, next); //Why do that? Author: I don't know, but it actually works
});
app.get("/findPic/:picturelocation", async (req, res) => {
  // res.set("Content-Type", "image/png");
  res.sendFile(`${__dirname}/public/uploads/${req.params.picturelocation}`);
});

app.use(process.env.ROUTER_MAIN, RoutesMain);
app.use(process.env.ROUTER_GRADE, RoutesGrades);
app.use(process.env.ROUTER_NOTE, RoutesNote);

app.listen(port, () => console.log("Server is running at" + host + ":" + port));
