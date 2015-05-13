angular.module('hack.auth', [])

.controller('AuthController', ["$scope", "$window", "$location", "Auth", "Followers", "Bookmarks",
  function ($scope, $window, $location, Auth, Followers, Bookmarks) {
  
  $scope.user = {};
  $scope.newUser = {};
  $scope.loggedIn = Auth.isAuth();

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (followers, bookmarks) {
        $window.localStorage.setItem('com.hack', $scope.user.username);
        $window.localStorage.setItem('hfBookmarks', bookmarks);
        $window.localStorage.setItem('hfUsers', followers);

        Followers.localToArr();
        Bookmarks.localToArr();

        $scope.loggedIn = true;
        $scope.user = {};
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    $scope.newUser.following = Followers.following.join(',');

    Auth.signup($scope.newUser)
      .then(function (data) {
        $window.localStorage.setItem('com.hack', $scope.newUser.username);

        $scope.loggedIn = true;
        $scope.newUser = {};
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.logout = function () {
    Auth.signout();
    $scope.loggedIn = false;
  }
}]);
