angular
  .module('app.groups', [])
  .controller('GroupController', GroupController);

  GroupController.$inject = ['$scope', 'auth', 'Group'];

  function GroupController($scope, auth, Group){
    $scope.interests = '';
    $scope.name = '';
    $scope.profile = 'cats';

    auth.profilePromise.then(function(profile) {
      $scope.profile = profile;
      $scope.user = $scope.profile.nickname;
    });

    $scope.getAllGroups = function(){
      console.log('get all', $scope.user)
      Group.getAllGroups().then(function(groups){
        for(var i = 0; i < groups.length; i++){
          var memberList = groups[i].users.join(', ');
          groups[i].users = memberList;
          var interestsList = groups[i].interests.join(', ')
          groups[i].interests = interestsList
        }
        $scope.allGroups = groups;
      });
    }


    $scope.getUserGroups = function(){
      console.log('get groups', $scope.user);
      var userInfo = {
        user: $scope.user
      };
      Group.getUserGroups(userInfo).then(function(groups){
        $scope.myGroups = groups;
      });
    };

    $scope.createGroup = function(){
      console.log($scope.user);
      if($scope.name){
        var group = {
          name: $scope.name,
          user: $scope.user,
          interests: $scope.interests
        };
        Group.createGroup(group)
          .then(function(data){
            $scope.name = '';
            $scope.interests = '';
            $scope.getAllGroups();
          });
      }
    };

    $scope.joinGroup = function(group){
      var user = $scope.user;
      Group.joinGroup(group, user).then(function(data){
        $scope.getAllGroups();
      })
    };
    
    $scope.getAllGroups();

  }