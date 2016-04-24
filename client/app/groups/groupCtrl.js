angular
  .module('app.groups', [])
  .controller('GroupController', GroupController);

  GroupController.$inject = ['$scope', 'Group', 'auth'];

  function GroupController($scope, Group, auth){

  }