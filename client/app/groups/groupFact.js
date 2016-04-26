angular
  .module('app.groups')
  .factory('Group', Group);

Group.$inject = ['$http'];

function Group($http){
  return {
    createGroup: function(group) {
      return $http({
          method: 'POST',
          url: '/api/groups/',
          data: group
        })
        .then(function(res) {
          return res.data;
        });

    },
    getAllGroups: function(){
      return $http({
          method: 'GET',
          url: '/api/groups/',
        })
        .then(function(res) {
          return res.data;
        });
    },
    getUserGroups: function(user){
      return $http({
          method: 'GET',
          url: '/api/groups/user-groups',
          data: user
        })
        .then(function(res) {
          return res.data;
        });
    },
    joinGroup: function(group, user){
      var groupInfo = {
        name: group,
        user:user
      }
      return $http({
          method: 'POST',
          url: '/api/groups/' + group,
          data: groupInfo
        })
        .then(function(res) {
          return res.data;
        });
    }
  };
}