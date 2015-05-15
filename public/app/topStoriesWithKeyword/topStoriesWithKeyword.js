angular.module('topStoriesWithKeyword', [])

.controller('TopStoriesWithKeywordController', function ($scope, $window, Links, Followers) {
  angular.extend($scope, Links);
  $scope.stories = Links.topStoriesWithKeyword;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.keyword;
  $scope.checked = 'start';

  // now i want to add a scope variable that is equal to the value of an input box
  // this might need to be a global variable so that its value can be set in the topStories page and still exist here
  // an alternative would be to click a link that takes us to the keyword page with the keyword initially set to ''

  $scope.currentlyFollowing = Followers.following;

  $scope.getData = function() {
    Links.getTopStoriesWithKeyword($scope.keyword);
    // $scope.checked = $scope.keyword;
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.getData(''); // the argument here will eventually be set by the input box
});

