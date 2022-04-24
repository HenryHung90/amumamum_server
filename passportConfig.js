const UserCheck = require("./models/SignUpModels");
const bcryptjs = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

//localStrategy 預設從req.body & req.query取得username & password
//Replace to StudentId & Password
module.exports = (passport) => {
  passport.use(
    new localStrategy((username, password, done) => {
      UserCheck.findOne({ StudentId: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false); //done(err:string, user:boolean)

        // if (password === user.Password) {
        //   return done(null, user);
        // } else {
        //   return done(null, false, { message: "Wrong password" });
        // }
        bcryptjs.compare(password, user.Password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong password" });
          }
        });
      });
    })
  );
  //Method
  //serializeUser()：可設定要將哪些 user 資訊，儲存在 Session 中的 passport.user。（如 user._id）
  //deserializeUser()：可藉由從 Session 中獲得的資訊去撈該 user 的資料。
  //serialize 序列化 deserialize 反序列化

  passport.serializeUser((user, cb) => {
    //serializeUser(user,done)
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    //deserializeUser(id,done) => id：從serialize建立
    UserCheck.findOne({ _id: id }, (err, user) => {
      cb(err, user);
    });
  });
};
