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
    joinGroup: function(){

    }
  };
}