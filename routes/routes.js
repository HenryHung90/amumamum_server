const express = require("express");
const router = express.Router();
const bcryptjs = require("bcrypt");
//dialogflowAgent使用
const dialogflowAgent = require("dialogflow-fulfillment");
//引入Schema
const SignUpTemplateCopy = require("../models/SignUpModels");
const MarkUserTemplateCopy = require("../models/MarkUserModels");
const UserNoteTemplateCopy = require("../models/UserNoteModels");

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
router.post(process.env.ROUTER_DIALOGFLOW, express.json(), (req, res, next) => {
  const agent = new dialogflowAgent.WebhookClient({
    request: req,
    response: res,
  });
  //test
  function demo(agent) {
    agent.add("Sending response from webhook server");
  }

  //Read Note
  function Note_read(agent) {
    console.log("使用者提問：", req.body.queryResult.queryText);
    agent.add("Response from webhook server");
    FindUserNote = new UserNoteTemplateCopy();
    // FindUserNote.findOne(
    //   {
    //     StudentId: req.body.StudentId,
    //   },
    //   (err, result) => {
    //     if (err) throw err;
    //     agent.add("Fuck you");
    //   }
    // );
  }

  let intentMap = new Map();

  intentMap.set("webhookDemo", demo);
  intentMap.set("Menu_Note_Read_Find", Note_read);

  agent.handleRequest(intentMap);
  // console.log("使用者提問：", req.body.queryResult.queryText);
  // console.log("回覆：", req.body.queryResult.fulfillmentText);
  // console.log("使用Intents：", req.body.queryResult.intent.displayName);
});
/////////////取得使用者（除密碼）/////////////////////////
router.post(process.env.ROUTER_USERINFO, async (req, res) => {
  if (req.body._id == null) {
    res.send(false);
    return;
  }
  SignUpTemplateCopy.findOne({ _id: req.body._id }, (err, result) => {
    if (err) throw err;
    const SendResponse = {
      _id: result._id,
      Name: result.Name,
      StudentId: result.StudentId,
      Email: result.Email,
      Access: result.Access,
      ////////////////////////////////////////////////////////////////
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

/////////////////管理員修改資料//////////////////
router.post(process.env.ROUTER_ADMINEDIT, async (req, res) => {
  if (req.body.Password === "") {
    SignUpTemplateCopy.updateOne(
      { Name: req.body.Name },
      {
        StudentId: req.body.StudentId,
        Email: req.body.Email,
        Access: req.body.Access,
      },
      (err, result) => {
        if (err) throw err;
        res.send("success");
      }
    );
  } else {
    bcryptjs.hash(req.body.Password, 10, (err, hashed) => {
      SignUpTemplateCopy.updateOne(
        { Name: req.body.Name },
        {
          StudentId: req.body.StudentId,
          Email: req.body.Email,
          Password: hashed,
          Access: req.body.Access,
        },
        (err, result) => {
          if (err) throw err;
          res.send("success");
        }
      );
    });
  }
});
/////////////////管理員刪除資料//////////////////
router.post(process.env.ROUTER_ADMINDELETED, async (req, res) => {
  SignUpTemplateCopy.deleteOne({ Name: req.body.Name }, {}, (err, result) => {
    if (err) throw err;
    res.send("success");
  });
});
/////////////////管理員批量修改//////////////////
router.post(process.env.ROUTER_ADMINUPLOAD, async (req, res) => {
  let InputData = req.body;

  for (let i = 0; i < InputData.length; i++) {
    if (req.body[i].Password === "") {
      SignUpTemplateCopy.updateOne(
        { Name: req.body[i].Name },
        {
          Name: req.body[i].Name,
          StudentId: req.body[i].StudentId,
          Access: req.body[i].Access,
          Email: req.body[i].Email,
        },
        (err, result) => {
          if (err) {
            res.send("failed");
            throw err;
          }
        }
      );
    } else {
      bcryptjs.hash(req.body[i].Password, 10, (err, hashed) => {
        SignUpTemplateCopy.updateOne(
          { Name: req.body[i].Name },
          {
            Name: req.body[i].Name,
            StudentId: req.body[i].StudentId,
            Access: req.body[i].Access,
            Email: req.body[i].Email,
            Password: hashed,
          },
          (err, result) => {
            if (err) {
              res.send("failed");
              throw err;
            }
            if (result.matchedCount === 0) {
              let TempUpdate = new SignUpTemplateCopy({
                Name: req.body[i].Name,
                StudentId: req.body[i].StudentId,
                Access: req.body[i].Access,
                Email: req.body[i].Email,
                Password: hashed,
              });
              TempUpdate.save();
            }
          }
        );
      });
    }
  }
  res.send("success");
});

module.exports = router;
