var Group = require('./groupSchema.js');

module.exports = {
  createGroup: function(req, res, next) {
    var interests = req.body.interests.split(', ');
    var groupInfo = {
      name: req.body.name,
      interests: interests,
      users: [req.body.user]
    };
    Group.findOne({ name: groupInfo.name })
      .then(function(group) {
        if (!group) {
          Group.create(groupInfo);
          res.sendStatus(201);
        } else {
          console.log('Group already exists.');
          res.sendStatus(200);
        }
    });
  },
  joinGroup: function(req, res, next){
    var group_name = req.body.name;
    var user = req.body.user;
    Group.findOne({ name: group_name })
      .then(function(group){
        var alreadyAdded = false;
        for(var i = 0; i < group.users.length; i++){
          if(group.users[i] === user){
            alreadyAdded = true;
          }
        }
        if(!alreadyAdded) {
          group.users.push(user);
          res.sendStatus(201);
        } else {
          console.log('User already a member of this group');
          res.sendStatus(200);
        }
      });
  },
  getAllGroups: function(req, res, next) {
    Group.find({})
      .then(function(groups){
        res.send(groups);
      });
  },
  getUserGroups: function(req, res, next) {
    Group.find({})
      .then(function(groups){
        var userGroups = [];
        for(var i = 0; i < groups.length; i++){
          for(var j = 0; j < groups[i].users.length; j++){
            if (group[i].users[j] === user){
              userGroups.push(groups[i]);
              break;
            }
          }
        }
        res.send(userGroups);
      })
  }
};