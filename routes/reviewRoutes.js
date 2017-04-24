'use strict'
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
const formidable = require("formidable");
const fs = require('fs');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const multer = require("multer");
var upload = multer({ dest: './public/img/' }).single("file");
require("../models/Review.js");
require("../models/User.js");

const review = mongoose.model("Review");
const user = mongoose.model("User");

router.get('/', function (req, res){
    review.find({},
       function (err, found) {
        res.json(found);
    })
});
router.get("/freelancer/:id", function(req, res){
  if(req.params.id == undefined){
    res.status(404).end();
    return;
  }
  review.find({freelancer:req.params.id}).lean().exec(function(err,found){
    res.json(found);
  })
})

router.get("/:id", function(req,res){
  review.find({_id: req.params.id}, function (err, found) {
      if(err){
        res.status(404).end();
        return;
      }
      if (Object.keys(found).length === 0) {
          res.status(404).end();
      }
    else{
      found[0] = found[0].toObject();
      found[0].links = [];
      found[0].links.push({'rel': 'self',
      'href': 'http://localhost:4000/reviewRoutes/' + found[0]._id})
      res.json(found[0]);
    }
  })
});



router.delete("/:id",function(req,res){
  review.find({_id: req.params.id}, function(err,found){
    if(err || Object.keys(found).length === 0){
      res.status(404).end();
    }
    else{
      review.remove({_id: req.params.id}, function(err){
                if(err){
                  res.status(404).json().end();
                }
                else{
                  res.sendStatus(204);
                }
              })
    }
  })
});

router.post("/", function(req,res){
  upload(req,res,function(err){
    if(err){
      console.log(err);
      res.status(400).end();
    }else{

        if(req.body == undefined){
          console.log("Error: no body");
          res.status(400);
          res.end();
          return;
        }
        user.findOne({_id:req.body.secretKey}).lean().exec(function(err,found){
          if(err){
            console.log("Error while retrieving from DB");
            res.status(400).end;
          }
          if(found == undefined){
            console.log("Error finding user");
            res.status(203).end()
          }else{
            var a = new review(req.body);
            if(req.file){
              a.reviewImg='/img/'+req.file.filename;
            }
            console.log(JSON.stringify(a));
            a.save(function(err, saved){
              if(err){

                console.log("Error saving review!");
                console.log(err);
                res.status(203).json().end();
                return;
              }else{
                saved = saved.toObject();
                console.log(saved);
                res.status(201).json(saved).end();
                return;
              }
            })
          }
        });
      }})});


router.put("/:id", function(req,res){
  let a = req.body;
  review.update({_id:req.params.id}, a, function(err,modified){
    if(err){
      res.sendStatus(400);
    }
    else{
      res.sendStatus(200);
    }
  })
});

router.put("/respond/:id",function(req,res){
  review.update({_id:req.params.id}, {$push:{replys:req.body.responseText}}, function(err,modified){
    if(err){
      res.sendStatus(400);
    }
    else{
      res.json({responseText:req.body.responseText, reviewId:req.params.id});
    }
  })
});

module.exports = router;
