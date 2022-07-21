const express = require("express");
const router = express.Router();

const BstGradeTemplateCopyEasy = require("../models/BstGradeModelsEasy");
const AvlGradeTemplateCopyEasy = require("../models/AvlGradeModelsEasy");
const RbtGradeTemplateCopyEasy = require("../models/RbtGradeModelsEasy");
const BstGradeTemplateCopyMedium = require("../models/BstGradeModelsMedium");
const AvlGradeTemplateCopyMedium = require("../models/AvlGradeModelsMedium");
const RbtGradeTemplateCopyMedium = require("../models/RbtGradeModelsMedium");
const BstGradeTemplateCopyHard = require("../models/BstGradeModelsHard");
const AvlGradeTemplateCopyHard = require("../models/AvlGradeModelsHard");
const RbtGradeTemplateCopyHard = require("../models/RbtGradeModelsHard");
const GradesRankingTemplateCopy = require("../models/GradesRanking");
const GoogleSheetTemplateCopy = require("../models/GoogleSgeetModels");
const SignUpTemplateCopy = require("../models/SignUpModels");
////////////////////成績寫入資料庫---BST EASY////////////////////
router.post(process.env.ROUTER_BSTGRADEEASY, async (req, res) => {
  BstGradeTemplateCopyEasy.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        BstGradeTemplateCopyEasy.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const BstGrade = new BstGradeTemplateCopyEasy({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        BstGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績BST EASY/////////////////////////
router.post(process.env.ROUTER_BSTGRADEINFOEASY, async (req, res) => {
  BstGradeTemplateCopyEasy.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      if (result !== null) {
        const SendResponse = {
          StudentId: result.StudentId,
          Grades: result.Grades,
          Time: result.Time,
          ////////////////////////////////////////////////////////////////
        };
        res.send(SendResponse);
      }
    }
  );
});
////////////////////成績寫入資料庫---BST MEDIUM////////////////////
router.post(process.env.ROUTER_BSTGRADEMEDIUM, async (req, res) => {
  BstGradeTemplateCopyMedium.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        BstGradeTemplateCopyMedium.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const BstGrade = new BstGradeTemplateCopyMedium({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        BstGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績BST MEDIUM/////////////////////////
router.post(process.env.ROUTER_BSTGRADEINFOMEDIUM, async (req, res) => {
  BstGradeTemplateCopyMedium.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        StudentId: result.StudentId,
        Grades: result.Grades,
        Time: result.Time,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
////////////////////成績寫入資料庫---BST HARD////////////////////
router.post(process.env.ROUTER_BSTGRADEHARD, async (req, res) => {
  BstGradeTemplateCopyHard.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        BstGradeTemplateCopyHard.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const BstGrade = new BstGradeTemplateCopyHard({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        BstGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績BST HARD/////////////////////////
router.post(process.env.ROUTER_BSTGRADEINFOHARD, async (req, res) => {
  BstGradeTemplateCopyHard.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        StudentId: result.StudentId,
        Grades: result.Grades,
        Time: result.Time,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});

////////////////////成績寫入資料庫---AVL EASY////////////////////
router.post(process.env.ROUTER_AVLGRADEEASY, async (req, res) => {
  AvlGradeTemplateCopyEasy.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        AvlGradeTemplateCopyEasy.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const AvlGrade = new AvlGradeTemplateCopyEasy({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        AvlGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績AVL EASY/////////////////////////
router.post(process.env.ROUTER_AVLGRADEINFOEASY, async (req, res) => {
  AvlGradeTemplateCopyEasy.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        StudentId: result.StudentId,
        Grades: result.Grades,
        Time: result.Time,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
////////////////////成績寫入資料庫---AVL////////////////////
router.post(process.env.ROUTER_AVLGRADEMEDIUM, async (req, res) => {
  AvlGradeTemplateCopyMedium.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        console.log("fuck1");
        console.log(result);
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          console.log(result[0].Grades[i]);
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        console.log(GradesArr);
        console.log(TimesArr);
        AvlGradeTemplateCopyMedium.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        console.log("fuck2");
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const AvlGrade = new AvlGradeTemplateCopyMedium({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        AvlGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績AVL MEDIUM/////////////////////////
router.post(process.env.ROUTER_AVLGRADEINFOMEDIUM, async (req, res) => {
  AvlGradeTemplateCopyMedium.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        StudentId: result.StudentId,
        Grades: result.Grades,
        Time: result.Time,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
////////////////////成績寫入資料庫---AVL HARD////////////////////
router.post(process.env.ROUTER_AVLGRADEHARD, async (req, res) => {
  AvlGradeTemplateCopyHard.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        AvlGradeTemplateCopyHard.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const AvlGrade = new AvlGradeTemplateCopyHard({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        AvlGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績AVL HARD/////////////////////////
router.post(process.env.ROUTER_AVLGRADEINFOHARD, async (req, res) => {
  AvlGradeTemplateCopyHard.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        StudentId: result.StudentId,
        Grades: result.Grades,
        Time: result.Time,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
////////////////////成績寫入資料庫---RBT EASY////////////////////
router.post(process.env.ROUTER_RBTGRADEEASY, async (req, res) => {
  RbtGradeTemplateCopyEasy.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        console.log("fuck1");
        console.log(result);
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          console.log(result[0].Grades[i]);
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        console.log(GradesArr);
        console.log(TimesArr);
        RbtGradeTemplateCopyEasy.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        console.log("fuck2");
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const RbtGrade = new RbtGradeTemplateCopyEasy({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        RbtGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績RBT EASY/////////////////////////
router.post(process.env.ROUTER_RBTGRADEINFOEASY, async (req, res) => {
  RbtGradeTemplateCopyEasy.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        StudentId: result.StudentId,
        Grades: result.Grades,
        Time: result.Time,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
////////////////////成績寫入資料庫---RBT MEDIUM////////////////////
router.post(process.env.ROUTER_RBTGRADEMEDIUM, async (req, res) => {
  RbtGradeTemplateCopyMedium.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        RbtGradeTemplateCopyMedium.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const RbtGrade = new RbtGradeTemplateCopyMedium({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        RbtGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績RBT MEDIUM/////////////////////////
router.post(process.env.ROUTER_RBTGRADEINFOMEDIUM, async (req, res) => {
  RbtGradeTemplateCopyMedium.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        StudentId: result.StudentId,
        Grades: result.Grades,
        Time: result.Time,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
////////////////////成績寫入資料庫---RBT HARD////////////////////
router.post(process.env.ROUTER_RBTGRADEHARD, async (req, res) => {
  RbtGradeTemplateCopyHard.find(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        let GradesArr = [];
        let TimesArr = [];
        for (let i = 0; i < result[0].Grades.length; i++) {
          GradesArr[i] = result[0].Grades[i];
          TimesArr[i] = result[0].Time[i];
        }
        GradesArr[result[0].Grades.length] = req.body.Grades;
        TimesArr[result[0].Grades.length] = req.body.Time;
        RbtGradeTemplateCopyHard.updateOne(
          { StudentId: req.body.StudentId },
          { Grades: GradesArr, Time: TimesArr },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        /////////////Schema///////////////////
        let GradesArr = [];
        let TimesArr = [];
        GradesArr[0] = req.body.Grades;
        TimesArr[0] = req.body.Time;
        const RbtGrade = new RbtGradeTemplateCopyHard({
          StudentId: req.body.StudentId,
          Grades: GradesArr,
          Time: TimesArr,
        });
        ////////////////////////////////
        RbtGrade.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績RBT HARD/////////////////////////
router.post(process.env.ROUTER_RBTGRADEINFOHARD, async (req, res) => {
  RbtGradeTemplateCopyHard.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        StudentId: result.StudentId,
        Grades: result.Grades,
        Time: result.Time,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
////////////////////成績排名寫入資料庫---GRADESRANKING////////////////////
router.post(process.env.ROUTER_GRADESRANKING, async (req, res) => {
  GradesRankingTemplateCopy.find(
    { MajorAndType: req.body.MajorAndType },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        let find = 0;
        let tmpRanking = result[0].Ranking;
        let length = tmpRanking.length;
        console.log("here1");
        console.log(result);

        for (let i = 0; i < length; i++) {
          if (tmpRanking[i].StudentId === req.body.Ranking.StudentId) {
            if (tmpRanking[i].Grades < req.body.Ranking.Grades) {
              console.log("here2");
              tmpRanking[i].Grades = req.body.Ranking.Grades;
              tmpRanking[i].Time = req.body.Ranking.Time;
              console.log(tmpRanking);
            }
            tmpRanking.sort(function (a, b) {
              return parseInt(b.Grades) - parseInt(a.Grades);
            });
            find = 1;
            break;
          }
        }
        if (find === 0) {
          tmpRanking[length] = req.body.Ranking;
          tmpRanking.sort(function (a, b) {
            return parseInt(b.Grades) - parseInt(a.Grades);
          });
        }
        GradesRankingTemplateCopy.updateOne(
          { MajorAndType: req.body.MajorAndType },
          { Ranking: tmpRanking },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        let tmpRanking = [];
        tmpRanking[0] = req.body.Ranking;
        const GradesRanking = new GradesRankingTemplateCopy({
          MajorAndType: req.body.MajorAndType,
          Ranking: tmpRanking,
        });
        ////////////////////////////////
        GradesRanking.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
/////////////取得成績排名---GRADESRANKING/////////////////////////
router.post(process.env.ROUTER_GRADESRANKINGINFO, async (req, res) => {
  GradesRankingTemplateCopy.findOne(
    { MajorAndType: req.body.MajorAndType },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        MajorAndType: result.MajorAndType,
        Ranking: result.Ranking,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
/////////////反向 取得使用者（除密碼）/////////////////////////
router.post(process.env.ROUTER_REVERSEUSERINFO, async (req, res) => {
  SignUpTemplateCopy.findOne(
    { StudentId: req.body.StudentId },
    (err, result) => {
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
    }
  );
});
////////////////////成績寫入資料庫---GOOGLESHEETGRADES////////////////////
router.post(process.env.ROUTER_GOOGLESHEETGRADES, async (req, res) => {
  GoogleSheetTemplateCopy.find(
    { MajorAndType: req.body.MajorAndType },
    (err, result) => {
      if (err) throw err;
      ////////////////////////////////
      if (result.length > 0) {
        GoogleSheetTemplateCopy.updateOne(
          { MajorAndType: req.body.MajorAndType },
          { Grades: req.body.Grades },
          { AnsType: req.body.AnsType },
          (err, result) => {
            if (err) throw err;
            res.send("success");
          }
        );
      } else {
        const GoogleSheet = new GoogleSheetTemplateCopy({
          MajorAndType: req.body.MajorAndType,
          Grades: req.body.Grades,
          AnsType: req.body.AnsType,
        });
        ////////////////////////////////
        GoogleSheet.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});
////////////////////取得google成績---GOOGLESHEETGRADES////////////////////
router.post(process.env.ROUTER_GOOGLESHEETGRADESINFO, async (req, res) => {
  GoogleSheetTemplateCopy.findOne(
    { MajorAndType: req.body.MajorAndType },
    (err, result) => {
      if (err) throw err;
      const SendResponse = {
        MajorAndType: result.MajorAndType,
        Grades: result.Grades,
        AnsType: result.AnsType,
        ////////////////////////////////////////////////////////////////
      };
      res.send(SendResponse);
    }
  );
});
module.exports = router;
