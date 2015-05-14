angular.module('hack.personal', [])

.controller('PersonalController', function ($scope, $window, Links, Followers, Auth) {
  $scope.stories = Links.personalStories;
  $scope.users = Followers.following;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.loggedIn = Auth.isAuth();

  var init = function(){
    fetchUsers();
  };
  
  var fetchUsers = function(){
    Links.getPersonalStories($scope.users);
  };
  
  init();
});
