angular.module('hack.bookmarks', [])

.controller('BookmarksController', function ($scope, $window, Links, Followers, Auth) {
  $scope.currentBookmarks = Bookmarks.bookmarks;
  $scope.loggedIn = Auth.isAuth();
  // $scope.stories = Links.personalStories;
  // $scope.users = Followers.following;
  // $scope.perPage = 30;
  // $scope.index = $scope.perPage;

  // var init = function(){
  //   fetchUsers();
  // };
  
  // var fetchUsers = function(){
  //   Links.getBookmarkStories($scope.users);
  // };
  
  // init();
});
