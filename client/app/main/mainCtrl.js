angular
  .module('app.main', [])
  .controller('MainController', MainController);

// Dependency injection. Done this way for minification purposes.
MainController.$inject = ['$scope', '$timeout', 'auth', 'Goals', 'Friend', 'Profile'];

function MainController($scope, $timeout, auth, Goals, Friend, Profile) {
  // User information from our MongoDB
  $scope.user = {};

  // Used in partial-app-main to toggle comment display
  $scope.isAddCommentClosed = true;
  
  // Comment counter
  var currentCount;

  // Retrieves the logged in user's goals from server.
  $scope.getGoals = function() {
    Goals.getGoals($scope.profile.user_id)
      .then(function(goals) {
        $scope.user.goals = goals;

        // Checks each goal to display status message based on activity.
        $scope.user.goals.forEach(function(goal) {
          $scope.checkGoalsM(goal);
        });
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Checks a goal to determine what status message (based on last activity time)
  // displayed. Takes an optional friend parameter that (if present) will provide
  // status messages based on your friend's activity with appropriate context.
  // Hours version.
  $scope.checkGoalsH = function(goal, friend) {
    var message = {};
    var goalDate;

    // Determine date the goal was last updated.
    if(friend) {
      goalDate = new Date(goal.latestPost.createdAt);
    } else if(goal.posts.length) {
      goalDate = new Date(goal.posts[goal.posts.length-1].createdAt);
    } else {
      goalDate = new Date(goal.createdAt);
    }
    // Date added to goal locally for sorting purposes.
    goal.lastUpdate = goalDate;
    var currDate = new Date();
    var dateDiff = (currDate - goalDate)/3600000;
    if(friend) {
      message.done="Your friend met their goal! Let them know they rock!!!"
      message.great="Your friend is doing great! Be sure to let them know!";
      message.good="It's been a couple of days since your friend updated their goal. Maybe cheer them on to get them motivated!";
      message.bad="It's been days since your friend updated their goal. Don't let them give up now!";
      message.terrible="Oh no!!! Your friend hasn't updated their goal in over a week. Are they ok? Be sure to check in with\
      them to see how they're doing!";
    } else {
      message.done="You nailed it! That goal is toast!!!"
      message.great="Doing great! Keep it up!!!";
      message.good="It's been a couple of days since you updated this goal. Keep at it and post to your friends to let them know!";
      message.bad="It's been days since you updated this goal. Don't give up now! You can do it!";
      message.terrible="It's been more than a week since you last updated this goal. What happened?! Is everything ok? Be sure to \
      reach out to your friends for some support if you need it!";
    }
    if(goal.complete) {
      goal.status = message.done;
      goal.warn = false;
    } else if(dateDiff < 24) {
      goal.status = message.great;
      goal.warn = false;
    } else if (dateDiff < 48) {
      goal.status = message.good;
      goal.warn = false;
    } else if (dateDiff < 168) {
      goal.status = message.bad;
      goal.warn = true;
    } else {
      goal.status = message.terrible;
      goal.warn = true;
    }
  };

  // Checks a goal to determine what status message (based on last activity time)
  // displayed. Takes an optional friend parameter that (if present) will provide
  // status messages based on your friend's activity with appropriate context.
  // Minutes version.
  $scope.checkGoalsM = function(goal, friend) {
    var message = {};
    var goalDate;

    // Determine date the goal was last updated.
    if(friend) {
      goalDate = new Date(goal.latestPost.createdAt);
    } else if(goal.posts.length) {
      goalDate = new Date(goal.posts[goal.posts.length-1].createdAt);
    } else {
      goalDate = new Date(goal.createdAt);
    }
    // Date added to goal locally for sorting purposes.
    goal.lastUpdate = goalDate;
    var currDate = new Date();
    var dateDiff = (currDate - goalDate)/60000;
    if(friend) {
      message.done="Your friend met their goal! Let them know they rock!!!"
      message.great="Your friend is doing great! Be sure to let them know!";
      message.good="It's been more than 15 minutes since your friend updated their goal. Maybe cheer them on to get them motivated!";
      message.bad="It's over 30 minutes since your friend updated their goal. Don't let them give up now!";
      message.terrible="Oh no!!! Your friend hasn't updated their goal in over an hour. Are they ok? Be sure to check in with\
      them to see how they're doing!";
    } else {
      message.done="You nailed it! That goal is toast!!!"
      message.great="Doing great! Keep it up!!!";
      message.good="It's been more than 15 minutes since you updated this goal. Keep at it and post to your friends to let them know!";
      message.bad="It's been over 30 minutes you updated this goal. Don't give up now! You can do it!";
      message.terrible="It's been more than an hour since you last updated this goal. What happened?! Is everything ok? Be sure to \
        reach out to your friends for some support if you need it!";
    }

    if(goal.complete) {
      goal.status = message.done;
      goal.warn = false;
    } else if(dateDiff < 15) {
      goal.status = message.great;
      goal.warn = false;
    } else if (dateDiff < 30) {
      goal.status = message.good;
      goal.warn = false;
    } else if (dateDiff < 60) {
      goal.status = message.bad;
      goal.warn = true;
    } else {
      goal.status = message.terrible;
      goal.warn = true;
    }
  };

  // Gets a list of the user's 5 most inactive friends.
  $scope.getInactiveFriends = function() {
    Friend.getInactiveFriends($scope.profile.user_id)
      .then(function(data) {
        $scope.friends = data;
        // Sends the friend and their goal through the checkGoalsM function to provide
        // a status message for that goal.
        $scope.friends.forEach(function(friend) {
          $scope.checkGoalsM(friend, true);
        });
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Gets posts from all the user's friends to display
  $scope.getFriendsPosts = function() {
    $scope.posts = [];
    Friend.getFriendsPosts($scope.profile.user_id)
      .then(function(data) {
        // Series of tuples returned. The first part of the tuple is the friend's info and
        // the second part is their posts. We're adding each post to a posts array with
        // the friend info added to the post.
        data.forEach(function(obj) {
          var friend = {};
          friend.firstname = obj[0].firstname || '';
          friend.lastname = obj[0].lastname || '';
          friend.username = obj[0].username || '';
          friend.auth_id = obj[0].auth_id;
          obj[1].forEach(function(post) {
            post.friend = friend;
            $scope.posts.push(post);
          });
        });
        currentCount = Profile.countComment($scope.posts);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Add a post to a user's goal
  $scope.$on('newGoal', function() {
    console.log('one of the steps');
    $scope.addPost();
  });
  
  $scope.addPost = function() {
    // Check to be sure the text field isn't empty
    if($scope.input.post) {
      var post = {
        post: $scope.input.post,
        goal_id: $scope.input.selected._id
      };
      Profile.addPost($scope.profile.user_id, post)
        .then(function(data) {
          // Reset input field
          $scope.input.post = '';
          // Refresh goals to show the status has changed
          $scope.getGoals();
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  // Add a comment to a friend's post
  $scope.addComment = function(post_id, goal_id, input, friend_id) {
    // Check to verify that the input field isn't empty
    if(input) {
      Profile.addComment($scope.profile.user_id, goal_id, post_id, input, friend_id)
        .then(function(data) {
          // push the new comment to the relevant comment array
          Profile.pushComment(data, $scope.posts, currentCount);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  // Checks with the back-end every couple of seconds to add new posts/comments without
  // refreshing the views entirely. This prevents the user from being popped to the top
  // of the screen while providing the live data.
  $scope.poller = function() {
    // create an array similar to $scope.posts
    var newPosts = [];
    Friend.getFriendsPosts($scope.profile.user_id)
      .then(function(data) {
        data.forEach(function(friend) {
          friend[1].forEach(function(post) {
            newPosts.push(post);
          });
        });
        // count the comment in each post
        var newCount = Profile.countComment(newPosts);
        return newCount;
      })
      .then(function(newCount) {
        // check for any difference in new count and current count
        Profile.checkComment(currentCount, newCount, $scope.posts, newPosts);
      })
      .catch(function(error) {
        console.error(error);
      });
    $timeout($scope.poller, 2000);
  };

  // Once auth0 profile info has been set, query our database for friends' posts, inactive friends and personal goals.
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
    $scope.getFriendsPosts();
    $scope.getInactiveFriends();
    $scope.getGoals();
    $scope.poller();
  });
}
