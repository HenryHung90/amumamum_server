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
router.post(
  process.env.ROUTER_DIALOGFLOW,
  express.json(),
  async (req, res, next) => {
    //使用者輸入
    //console.log(req.body.queryResult.queryText);

    let UserInput = req.body.queryResult.queryText.split("/");
    let UserNote;

    //輸入不符合規定(學號)
    let IdIdentify = /^1[0-1][0-9][0-9][0-9][0-9][0-9]$/;
    //Create param[1] = StudentId param[2] = contents
    //Read   param[1] = StudentId
    //Update param[1] = StudentId param[2] = contentsKey param[3] = contents
    //Delete param[1] = StudentId param[2] = contentsKey
    // console.log(UserInput);
    const NotingSearch = UserNoteTemplateCopy.findOne({
      StudentId: UserInput[1],
    }).exec();

    await NotingSearch.then((doc) => {
      if (doc !== null) {
        //Obj
        UserNote = doc.Noting;
      } else {
        UserNote = null;
      }
    });

    const agent = new dialogflowAgent.WebhookClient({
      request: req,
      response: res,
    });

    //Create Note
    //Create param[1] = StudentId param[2] = contents
    async function Note_Create(agent) {
      if (IdIdentify.test(UserInput[1])) {
        if (UserNote === null) {
          const FirstSave = new UserNoteTemplateCopy({
            StudentId: UserInput[1],
            Noting: [{ Note: UserInput[2], Time: new Date() }],
          });
          await FirstSave.save().then(() => {
            agent.add("新增完成囉！");
          });
        } else {
          let Temp = {
            Note: UserInput[2],
            Time: new Date(),
          };
          UserNote.push(Temp);
          const NotingCreate = UserNoteTemplateCopy.updateOne(
            {
              StudentId: UserInput[1],
            },
            { Noting: UserNote }
          ).exec();
          await NotingCreate;
          agent.add("新增的筆記記好囉！");
          return;
        }
      }
      agent.add("學號的輸入不符合需求喔！");
    }

    //Read Note
    //Read   param[1] = StudentId
    async function Note_Read(agent) {
      if (IdIdentify.test(UserInput[1])) {
        await NotingSearch.then((doc) => {
          if (doc !== null) {
            IsUserHaveNote = doc.Noting;
          } else {
            IsUserHaveNote = null;
          }
        });

        if (IsUserHaveNote === null) {
          agent.add("目前還沒有筆記喔！");
        } else {
          IsUserHaveNote.map((val, key) => {
            agent.add(
              "條目" + key + "=>內容:" + val.Note + " 時間:" + val.Time
            );
          });
        }
        return;
      }
      agent.add("學號的輸入不符合需求喔！");
    }

    //Update Note
    //Update param[1] = StudentId param[2] = contentsKey param[3] = contents
    async function Note_Update(agent) {
      if (UserInput[0] === "從網頁修改筆記") {
        agent.add("OK 已跳轉頁面");
        return;
      }
      if (IdIdentify.text(UserInput[1])) {
        let Temp = {
          Note: UserInput[3],
          Time: new Date(),
        };
        UserNote[UserInput[2]] = Temp;
        const NotingUpdate = UserNoteTemplateCopy.updateOne(
          {
            StudentId: UserInput[1],
          },
          { Noting: UserNote }
        ).exec();
        await NotingUpdate;
        agent.add("修改完成！");
        return;
      }
      agent.add("學號的輸入不符合需求喔！");
    }

    //Delete Note
    //Delete param[1] = StudentId param[2] = contentsKey
    async function Note_Delete(agent) {
      if (IdIdentify.test(UserInput[1])) {
        let Temp = UserNote.filter((val, index) => {
          return index !== parseInt(UserInput[2]);
        });
        const NotingDelete = UserNoteTemplateCopy.updateOne(
          { StudentId: UserInput[1] },
          { Noting: Temp }
        ).exec();
        await NotingDelete;
        agent.add("刪除完成！");
        return;
      }
      agent.add("學號的輸入不符合需求喔！");
    }

    let intentMap = new Map();
    intentMap.set("Menu_Note_Read_Create", Note_Create);
    intentMap.set("Menu_Note_Read_Search", Note_Read);
    intentMap.set("Menu_Note_Read_Update", Note_Update);
    intentMap.set("Menu_Note_Read_Delete", Note_Delete);

    agent.handleRequest(intentMap);
  }
);
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
/////////////////管理員下載行為紀錄//////////////////
router.post(process.env.ROUTER_ADMINDOWNLOADMARK, async (req, res) => {
  MarkUserTemplateCopy.findOne(
    {
      StudentId: req.body.StudentId,
    },
    (err, result) => {
      if (err) throw err;
      if (result != null || result != undefined) {
        let Output = [];
        Temp = result.Mark.Description;
        console.log(Temp);
        for (let i = 0; i < Temp.length; i++) {
          //param[1]=Time param[2]=Doing param[3]=Content
          let TempCut = Temp[i].split("-");
          let OutputParam = {
            Doing: TempCut[2],
            Content: TempCut[3],
            Time: TempCut[1],
          };
          Output.push(OutputParam);
        }
        //console.log(Output);
        res.send(Output);
      } else {
        res.send("undefined");
      }
    }
  );
});

module.exports = router;
