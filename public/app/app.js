angular.module('hack', [
  'hack.topStories',
  'topStoriesWithKeyword',
  'hack.personal',
  'hack.bookmarks',
  'hack.bookmarkService',
  'hack.currentlyFollowing',
  'hack.linkService',
  'hack.authService',
  'hack.followService',
  'hack.tabs',
  'hack.auth',
  'ngRoute'
])

.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/topStories/topStories.html',
      controller: 'TopStoriesController'
    })
    .when('/personal', {
      templateUrl: 'app/personal/personal.html',
      controller: 'PersonalController'
    })
    .when('/bookmarks', {
      templateUrl: 'app/bookmarks/bookmarks.html',
      controller: 'BookmarksController'
    })
    .when('/keyword', {
      templateUrl: 'app/topStoriesWithKeyword/topStoriesWithKeyword.html',
      controller: 'TopStoriesWithKeywordController'
    })
    .otherwise({
      redirectTo: '/'
    });
})

.filter('fromNow', function(){
  return function(date){
    var foo = 3;
    return humanized_time_span(new Date(date));
  }
})

.filter('htmlsafe', ['$sce', function ($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };
}])

.directive('rotate', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(attrs.degrees, function (rotateDegrees) {
        var r = 'rotate(' + rotateDegrees + 'deg)';
        // console.log(r);
        element.css({
          '-moz-transform': r,
          '-webkit-transform': r,
          '-o-transform': r,
          '-ms-transform': r,
          'transform': r
        });
      });
    }
  }
});

