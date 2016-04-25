angular
  .module('app.groups', [])
  .controller('GroupController', GroupController);

  GroupController.$inject = ['$scope', 'auth', 'Group'];

  function GroupController($scope, auth, Group){
    $scope.interests = '';
    $scope.name = '';

    auth.profilePromise.then(function(profile) {
      $scope.profile = profile;
      console.log($scope.profile);
      $scope.user = $scope.profile.nickname;
    });

    $scope.createGroup = function(){
      console.log($scope.name, $scope.interests, $scope.user);
      if($scope.name){
        console.log('made it past the if')
        var group = {
          name: $scope.name,
          user: $scope.user,
          interests: $scope.interests
        };
        Group.createGroup(group)
          .then(function(data){
            console.log('success!');
            $scope.name = '';
            $scope.interests = '';
          });
      }
    };
  }