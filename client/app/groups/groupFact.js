angular
  .module('app.groups')
  .factory('Group', Group);

Group.inject = ['$scope', 'auth', '$http']

function Group($scope, auth, $http){

  return {}
}