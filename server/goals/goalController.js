var User = require('../users/userModel.js');
var Achievements = require('../achievements/achievementController.js');

module.exports = {
  getGoals: function(req, res) {
    var user_id = req.params.user_id;

    User.findOne({ auth_id: user_id })
      .then(function(user) {
        var goals = user.goals;
        res.status(200).json(goals);
      });
  },

  addGoal: function(req, res) {
    var user_id = req.params.user_id;
    var goal = req.body;

    User.findOne({ auth_id: user_id })
      .then(function(user) {
        user.goals.push(goal);
        user.numGoals += 1;
        Achievements.check(user);
        user.save();
        res.status(201).json(user.goals);
      });
  },

  updateGoal: function(req, res) {
    var user_id = req.params.user_id;
    var goal = req.body;
    var id = goal._id;
    delete goal._id; //so we don't cause problems

    User.findOne({ auth_id: user_id })
      .then(function(user) {
        for (var i = 0; i < user.goals.length; i++) {
          var g = user.goals[i];
          if (g._id == id) { //because one of these is a string and the other is not
            for (var key in goal) {
              g[key] = goal[key];
            };
          }
        }
        if (goal.complete) {user.numComplete += 1}
        user.save();
        res.status(201).json(user.goals);
      });
  },

  deleteGoal: function(req, res) {
    var params = req.params.user_id.split('+');
    var user_id = params[0];
    var goal_id = params[1];

    User.findOne({ auth_id: user_id })
      .then(function(user) {
        for (var i = 0; i < user.goals.length; i++) {
          var g = user.goals[i];
          if (g._id == goal_id) { //because one of these is a string and the other is not
            user.goals.splice(i, 1);
            //if check weather or not they completed that goal and increment the appropriate counter
            g.complete ? user.numDeletedComplete += 1 : user.numDeletedIncomplete += 1;
            Achievements.check(user);
          }
        }
        user.save();
        res.status(200).json(user.goals);
      });
  },
};
