angular
  .module('app.groups')
  .factory('Group', Group);

Group.$inject = ['$http'];

function Group($http){
  return {
    createGroup: function(group) {
      console.log('in the fact func')
      return $http({
          method: 'POST',
          url: '/api/groups/',
          data: group
        })
        .then(function(res) {
          console.log('finished post request')
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
      console.log('In the fact func')
      console.log('USER INFO', user)
      return $http({
          method: 'GET',
          url: '/api/groups/user-groups',
          data: user
        })
        .then(function(res) {
          console.log('finished post request', res.data);
          return res.data;
        });
    },
    joinGroup: function(group, user){
      var groupInfo = {
        name: group,
        user:user
      }
      console.log("GROUP INFO", groupInfo)
      return $http({
          method: 'POST',
          url: '/api/groups/' + group,
          data: groupInfo
        })
        .then(function(res) {
          console.log('finished post request')
          return res.data;
        });
    }
  };
}