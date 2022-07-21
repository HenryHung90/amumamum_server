const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// const upload = multer({
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       cb(new Error("Plz upload an image"));
//     }
//     cb(null, true);
//   },
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const UserNoteTemplateCopy = require("../models/UserNoteModels");

///////////筆記內容規範 UserContent///////////////////////////

/////////////筆記CRUD///////////////////
//新增分類
router.post(process.env.ROUTER_NOTE_CLASSIFY_CREATE, async (req, res) => {
  //搜尋筆記相關資訊
  const UserNoteSearch = UserNoteTemplateCopy.findOne({
    StudentId: req.body.StudentId,
  }).exec();

  //現有分類內容
  let UserClassify = [];
  //現有筆記內容
  let UserContent = [];
  //是否為第一次新增
  let IsNew = false;

  let IsExist = false;

  //匯入分類
  await UserNoteSearch.then((doc) => {
    if (doc !== null) {
      UserClassify = doc.NoteClassify;
      UserContent = doc.NoteContent;
    } else {
      IsNew = true;
    }
  });

  //檢查分類是否存在
  if (UserClassify !== []) {
    UserClassify.map((val, index) => {
      if (req.body.NewClassify === UserClassify[index]) {
        res.send("該分類已經存在");
        IsExist = true;
      }
    });
  }
  if (!IsExist) {
    //加入分類
    UserClassify.push(req.body.NewClassify);

    //上傳分類
    if (IsNew) {
      const First = new UserNoteTemplateCopy({
        StudentId: req.body.StudentId,
        NoteClassify: UserClassify,
        NoteContent: [[]],
      });

      await First.save();
    } else {
      const UploadClassify = UserNoteTemplateCopy.updateOne(
        { StudentId: req.body.StudentId },
        { NoteClassify: UserClassify, NoteContent: UserContent }
      ).exec();

      await UploadClassify;
    }
    res.send("新增分類完成");
  }
});

//更新分類
router.post(process.env.ROUTER_NOTE_CLASSIFY_UPDATE, async (req, res) => {
  const UserNoteSearch = UserNoteTemplateCopy.findOne({
    StudentId: req.body.StudentId,
  }).exec();

  //現有分類內容
  let CloudClassify = [];
  let IsExist = false;

  //upload分類
  let UploadClassify = req.body.UploadClassify;
  let UploadIndex = req.body.UploadIndex;

  //匯入分類
  await UserNoteSearch.then((doc) => {
    CloudClassify = doc.NoteClassify;
  });

  CloudClassify.map((val, index) => {
    if (val === UploadClassify) {
      res.send("該分類已經存在");
      IsExist = true;
    }
  });
  if (!IsExist) {
    //加入分類
    CloudClassify[UploadIndex] = UploadClassify;

    const UpdateClassify = UserNoteTemplateCopy.updateOne(
      { StudentId: req.body.StudentId },
      { NoteClassify: CloudClassify }
    ).exec();

    await UpdateClassify;

    res.send("修改分類完成");
  }
});

//刪除分類
router.post(process.env.ROUTER_NOTE_CLASSIFY_DELETE, async (req, res) => {
  const UserNoteSearch = UserNoteTemplateCopy.findOne({
    StudentId: req.body.StudentId,
  }).exec();

  let TempUserClassify = [];
  let TempUserContent = [];

  await UserNoteSearch.then((doc) => {
    TempUserClassify = doc.NoteClassify;
    TempUserContent = doc.NoteContent;
  });

  let UpdateClassify = TempUserClassify.filter((val, index) => {
    if (index !== req.body.DeleteClassify) {
      return val;
    }
  });
  let UpdateUserContent = TempUserContent.filter((val, index) => {
    if (index !== req.body.DeleteClassify) {
      return val;
    }
  });

  const UserNoteDelete = UserNoteTemplateCopy.updateOne(
    {
      StudentId: req.body.StudentId,
    },
    { NoteClassify: UpdateClassify, NoteContent: UpdateUserContent }
  ).exec();

  await UserNoteDelete;
  res.send("success");
});

//讀取所有筆記
router.post(process.env.ROUTER_NOTE_READ, async (req, res) => {
  const UserNoteSearch = UserNoteTemplateCopy.findOne({
    StudentId: req.body.StudentId,
  }).exec();

  //讀入資料
  await UserNoteSearch.then((doc) => {
    if (doc === null) {
      res.send("NoData");
      return;
    }
    const ResData = {
      UserClassify: doc.NoteClassify,
      UserContent: doc.NoteContent,
    };
    res.send(ResData);
  });
});

//筆記內容CRUD (除對分類更動外所有更動皆由此更新)
router.post(process.env.ROUTER_NOTE_UPDATE, async (req, res) => {
  const UserNoteUpdate = UserNoteTemplateCopy.updateOne(
    { StudentId: req.body.StudentId },
    { NoteContent: req.body.NoteContent }
  ).exec();
  await UserNoteUpdate;
  res.send("修改成功!");
});

router.post("/uploadpicture", upload.array("photos", 3), async (req, res) => {
  // res.send("success");

  if (req.files == undefined) {
    return res.send("無照片上傳");
  }
  console.log(req.files);
  let filesPath = [];

  for (let i = 0; i < req.files.length; i++) {
    filesPath.push(req.files[i].filename);
  }

  res.send(filesPath);
});

router.post("/deletepicture", async (req, res) => {
  let files = [];

  if (fs.existsSync()) {
  }
});
// router.post(process.env.ROUTER_NOTE_CREATE, async (req, res) => {
//   let UserNote;
//   console.log(req.body);
//   const NotingSearch = UserNoteTemplateCopy.findOne({
//     StudentId: req.body.StudentId,
//   }).exec();
//   await NotingSearch.then((doc) => {
//     if (doc !== null) {
//       //Obj
//       UserNote = doc.Noting;
//     } else {
//       UserNote = null;
//     }
//   });
//   if (UserNote === null) {
//     const FirstSave = new UserNoteTemplateCopy({
//       StudentId: req.body.StudentId,
//       Noting: [{ Note: req.body.Note, Time: new Date() }],
//     });
//     await FirstSave.save().then(() => {
//       res.send("新增完成囉！");
//     });
//   } else {
//     let Temp = {
//       Note: req.body.Note,
//       Time: new Date(),
//     };
//     UserNote.push(Temp);
//     const NotingCreate = UserNoteTemplateCopy.updateOne(
//       {
//         StudentId: req.body.StudentId,
//       },
//       { Noting: UserNote }
//     ).exec();
//     await NotingCreate;
//     res.send("新增完成囉！");
//   }
// });
// router.post(process.env.ROUTER_NOTE_READ, async (req, res) => {
//   let UserNote;
//   const NotingSearch = UserNoteTemplateCopy.findOne({
//     StudentId: req.body.StudentId,
//   }).exec();
//   await NotingSearch.then((doc) => {
//     if (doc !== null) {
//       //Obj
//       UserNote = doc.Noting;
//     } else {
//       UserNote = null;
//     }
//   });
//   res.send(UserNote);
// });

// router.post(process.env.ROUTER_NOTE_UPDATE, async (req, res) => {
//   let UserNote;
//   const NotingSearch = UserNoteTemplateCopy.findOne({
//     StudentId: req.body.StudentId,
//   }).exec();
//   await NotingSearch.then((doc) => {
//     if (doc !== null) {
//       //Obj
//       UserNote = doc.Noting;
//     } else {
//       UserNote = null;
//     }
//   });
//   console.log(req.body);
//   let Temp = {
//     Note: req.body.Note,
//     Time: new Date(),
//   };
//   UserNote[req.body.Key] = Temp;

//   const NotingUpdate = UserNoteTemplateCopy.updateOne(
//     {
//       StudentId: req.body.StudentId,
//     },
//     { Noting: UserNote }
//   ).exec();
//   await NotingUpdate;
//   res.send("修改完成！");
// });
// router.post(process.env.ROUTER_NOTE_DELETE, async (req, res) => {
//   let UserNote;
//   const NotingSearch = UserNoteTemplateCopy.findOne({
//     StudentId: req.body.StudentId,
//   }).exec();
//   await NotingSearch.then((doc) => {
//     if (doc !== null) {
//       //Obj
//       UserNote = doc.Noting;
//     } else {
//       UserNote = null;
//     }
//   });

//   let Temp = UserNote.filter((val, index) => {
//     return index !== parseInt(req.body.Key);
//   });
//   const NotingDelete = UserNoteTemplateCopy.updateOne(
//     { StudentId: req.body.StudentId },
//     { Noting: Temp }
//   ).exec();
//   await NotingDelete;
//   res.send("刪除完成!");
// });

module.exports = router;
