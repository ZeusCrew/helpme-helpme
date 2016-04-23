angular
  .module('app.goals', [])
  .controller('GoalsController', GoalsController);

// Dependency injection. Done this way for minification purposes.
// See https://docs.angularjs.org/tutorial/step_05 for more info on minification.
GoalsController.$inject = ['$scope', 'auth', 'Goals', 'Profile'];

function GoalsController($scope, auth, Goals, Profile) {
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

  // Retrieves the data for the user's goal(s)
  $scope.getGoals = function() {
    Goals.getGoals($scope.profile.user_id)
      .then(function(goals) {
        $scope.user.goals = goals;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Add a goal to the user's set of goals
  $scope.addGoal = function() {
    // Check to be sure the goal has a title
    if($scope.input.title) {
      var goal = {
        title: $scope.input.title,
        description: $scope.input.description,
        due_date: $scope.input.due_date
      };
      Goals.addGoal($scope.profile.user_id, goal)
        .then(function(data) {
          console.log(data);
          // Reset input fields to blank
          $scope.input.title = '';
          $scope.input.description = '';
          //Add post at the same time, will now show automatically in main
          var post = {
              post: 'I\'ve set a new goal',
              goal_id: data[data.length-1]._id
          };
          Profile.addPost($scope.profile.user_id, post)
          // Refresh goals
          $scope.getGoals();
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  // Mark a goal as completed
  $scope.completeGoal = function(goalId) {
    console.log(goalId);
    var goal = {
      _id: goalId,
      complete: true
    };
    Goals.updateGoal($scope.profile.user_id, goal)
      .then(function(data) {
        $scope.getGoals();

      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Delete a goal
  $scope.deleteGoal = function(goalId) {
    console.log($scope.profile.user_id)
    Goals.deleteGoal($scope.profile.user_id, goalId)
      .then(function(data) {
        $scope.getGoals();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Once auth0 profile info has been set, query our database for user's goals
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
    $scope.getGoals();
  });
}
