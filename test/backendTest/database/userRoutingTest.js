'use strict'
var should = require("should")
var app = require("../../../app")
var request = require('supertest');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
const ObjectId = mongoose.Types.ObjectId
let utils = require('../../../utils.js')
require("../../../models/User.js");

const User = mongoose.model("User");
const id = ObjectId();

let user1 = {
  "_id"          : ObjectId(),
  "firstName"    : "Masiar",
  "lastName"     : "Babazadeh",
  "userName"     : "masiar",
  "email"        : "masiar.babazadeh@usi.ch",
  "password"     : "ciao",
  "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)",
};
describe("Testing Create on userRouting ", function(){
  // before(utils.dropDb)
  // after(utils.dropDb)
  describe("POST/userRouting",function(){
    it("should add user to db if the data is valid", function(done){
      var newUserData = {
        "_id":id,
        "firstName" : "Seth",
        "lastName" : "MacFarlane",
        "userName" : "seth",
        "email" : "seth.macfarlane@gmail.com",
        "password" : "peg"
      }
      request(app)
      .post("/userRouting")
      .set("content-type", "application/json")
      .send(newUserData)
      .expect(201)
      .end(function(err,res){
        done();
      })
    })
    it("should not add user to db if the data is invalid", function(done){
      var newUserData = {
        "firstName" : "Seth",
        "lastName" : "MacFarlane",
      }
      request(app)
      .post("/userRouting")
      .set("content-type", "application/json")
      .send(newUserData)
      .expect(400)
      .end(function(err,res){
        done();
      })
    })
  })
  describe('PUT /userRouting/:userid', function(){

    it('should update an existing user', function(done){
      var newUserData =  {

        "firstName" : "Seth",
        "lastName" : "MacFarlane",
        "userName" : "seth",
        "email" : "hello",
        "password" : "peg"
      };

      request(app)
        .put('/userRouting/' + id)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(newUserData)
        .expect(204)
        .end(function(err, res){
          var body = res.body;
          body.should.be.empty;

          //check if user was updated
          request(app)
            .get('/userRouting/' + id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/, 'it should respond with json' )
            .expect(200)
            .end(function(err, res){
              done();
            });

        });
    });
})
describe('GET /userRouting', function(){

    it('should list all the users with correct data', function(done){
      request(app)
        .get('/userRouting')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          done();
        });
    });
  });

  describe('GET /xd', function(){
    var newUserData = {
      "firstName" : "Seth",
      "lastName" : "asdf",
      "userName" : "seth",
      "email" : "seth.macfarlane@gmail.com",
      "password" : "peg"
    }
      it('should add user if userdata is valid', function(done){
        request(app)
          .get('/userRouting/xd')
          .set('Accept', 'application/json')
          .send(newUserData)
          .expect('Content-Type', /json/, 'it should respond with json' )
          .expect(200)
          .end(function(err, res){
            done();
          });
      });
    });

  describe('GET /userRouting/:userid', function(){


    it('should list the user with correct data', function(done){
      request(app)
        .get('/userRouting/' + id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          done();
        });
    });
    it('should respond with a 404 if the user does not exist', function(done){
        request(app)
          .get('/userRouting/' +"dsadsadsadas")
          .set('Accept', 'application/json')
          .expect(404, done);
      });
  })

  describe('DELETE /userRouting/:userid', function(){
    // after(utils.dropDb)

    it('should delete an existing user', function(done){
      request(app)
        .del('/userRouting/' + id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(204)
        .end(function(err, res){
          done();
        });
    });

    it('should not list the previous resource', function(done){
      request(app)
        .get('/userRouting/' + id)
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should respond with a 404 for a previously deleted resource', function(done){
      request(app)
        .delete('/userRouting/' + id)
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should respond with a 404 if the user does not exist', function(done){
      request(app)
        .delete('/userRouting/'+'dsadasdsads')
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });
  describe('DELETE /userRouting/:userid', function(){
    it("should check if the guy login is succesful", function(done){
      request(app)
      .get("/userRouting/login")
      .query(user1)
      .expect(200)
      .end(function(err, res){
        if(err){
          done(err);
        }
        else{
          done(err);
        }
      })
    })
    it("should check if the login is unsuccesful", function(done){
      request(app)
      .get("/userRouting/login")
      .query({})
      .expect(404)
      .end(function(err, res){
        if(err){
          done(err);
        }
        else{
          done(err);
        }
      })
    })
  })

})
