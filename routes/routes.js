const express = require("express");
const router = express.Router();
const bcryptjs = require("bcrypt");
//引入Schema
const SignUpTemplateCopy = require("../models/SignUpModels");
const MarkUserTemplateCopy = require("../models/MarkUserModels");

/////////////寫入資料庫///////////////////
router.post(process.env.ROUTER_SIGNUP, async (req, res) => {
  SignUpTemplateCopy.findOne({ StudentId: req.body.StudentId }, (err, doc) => {
    if (err) throw err;
    if (doc) {
      res.send("has been registered");
    } else {
      /////////////Schema///////////////////
      const SignedUpUser = new SignUpTemplateCopy({
        Name: req.body.Name,
        StudentId: req.body.StudentId,
        Password: req.body.Password,
        Email: req.body.Email,
        Access: req.body.Access,
      });
      ////////////////////////////////
      SignedUpUser.save()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
});
/////////////紀錄行為/////////////////
router.post(process.env.ROUTER_USERINPUT, async (req, res) => {
  ///////////Schema////////////////
  const MarkedUpUser = new MarkUserTemplateCopy({
    StudentId: req.body.StudentId,
    Mark: req.body.Mark,
  });
  ////////////////////////////////
  MarkedUpUser.save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
/////////////讀取///////////////////
router.get(process.env.ROUTER_READ, async (req, res) => {
  ////////////////////////////////
  SignUpTemplateCopy.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
  ////////////////////////////////
});
/////////////Dialogflow///////////////////
router.post(process.env.ROUTER_DIALOGFLOW, (req, res, next) => {
  console.log("使用者提問：", req.body.queryResult.queryText);
  console.log("回覆：", req.body.queryResult.fulfillmentText);
  console.log("使用Intents：", req.body.queryResult.intent.displayName);
  //Socket回傳給首頁////////////////////////////////
  //存入資料庫/////////////////////////////////////
});
/////////////檢查使用者(是否正確為使用者)////////////////////
router.post(process.env.ROUTER_CHECKUSER, async (req, res) => {
  SignUpTemplateCopy.findOne({ _id: req.body._id }, (err, result) => {
    if (err) throw err;
    res.send(true);
  });
});
/////////////取得使用者（除密碼）/////////////////////////
router.post(process.env.ROUTER_USERINFO, async (req, res) => {
  SignUpTemplateCopy.findOne({ _id: req.body._id }, (err, result) => {
    if (err) throw err;
    const SendResponse = {
      _id: result._id,
      Name: result.Name,
      StudentId: result.StudentId,
      Email: result.Email,
      Access: result.Access,
    };
    res.send(SendResponse);
  });
});
////////////////////修改密碼////////////////////
router.post(process.env.ROUTER_CHANGEPASSWORD, async (req, res) => {
  SignUpTemplateCopy.findOne({ _id: req.body._id }, (err, result) => {
    if (err) throw err;
    console.log(result);
    bcryptjs.compare(req.body.OldPassword, result.Password, (err, result) => {
      if (result === true) {
        SignUpTemplateCopy.updateOne(
          { _id: req.body._id },
          { Password: req.body.NewPassword },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        res.send("NotCompare");
      }
    });
  });
});
////////////////////修改郵件////////////////////
router.post(process.env.ROUTER_CHANGEEMAIL, async (req, res) => {
  SignUpTemplateCopy.updateOne(
    { _id: req.body._id },
    { Email: req.body.Email },
    (err, result) => {
      if (err) throw err;
      res.send("success");
    }
  );
});

module.exports = router;
