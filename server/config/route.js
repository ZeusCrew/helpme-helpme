var goalController = require('../goals/goalController');
var userController = require('../users/userController');
var postController = require('../posts/postController');
var achievementController = require('../achievements/achievementController');
var helpers = require('./helper');

module.exports = function(app, express) {
  app.route('/api/goals/:user_id')
    .get(goalController.getGoals)
    .post(goalController.addGoal)
    .put(goalController.updateGoal)
    .delete(goalController.deleteGoal);

  app.route('/api/profile/:user_id')
    .get(postController.getProfile)
    .post(postController.updateProfile);

  app.route('/api/profile/posts/:user_id')
    .get(postController.getPosts)
    .post(postController.addPost);

  app.route('/api/friends/pending/:user_id')
    .get(userController.getFriendRequests)
    .post(userController.acceptFriendRequest);

  app.get('/api/friends/:user_id', userController.allFriends);
  app.get('/api/friends/requests/:user_id', userController.getRequestedFriends);
  app.post('/api/friends/add/:user_id', userController.sendFriendRequest);
  app.post('/api/friends/remove/:user_id', userController.removeFriend);
  app.post('/api/friends/search/', userController.searchUsers);

  app.get('/api/main/:user_id', userController.getFriendsPosts);
  app.get('/api/main/inactive/:user_id', userController.getInactiveFriends);

  app.post('/api/comment/:user_id', postController.addComment);
  app.post('/api/signin/', userController.addUser);

  app.get('/api/groups/', groupController.getAllGroups);
  app.get('/api/groups/user-groups', groupController.getUserGroups);
  app.post('/api/groups/', groupController.createGroup);
  app.post('/api/groups/:group_name', groupController.joinGroup);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
