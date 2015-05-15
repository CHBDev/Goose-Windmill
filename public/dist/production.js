angular.module('hack.authService', [])

.factory('Auth', ["$http", "$location", "$window", function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.hack');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.hack');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
}]);
// HOW OUR FOLLOWING SYSTEM WORKS:
// We want users to be able to follow people before they even
// log in, because who actually has time to decide on a story/password?

// So, we do this by saving the users that they follow into localStorage.
// On signup, we'll send the users string in localStorage to our server
// which wil save them to a database.

angular.module('hack.bookmarkService', [])

.factory('Bookmarks',  ["$http", "$window", function($http, $window) {
  var bookmarks = [];
  var user = $window.localStorage.getItem('com.hack');

  var addBookmark = function(story){

    var article = {
      points: story.points,
      url: story.url,
      title: story.title,
      author: story.author,
      created_at: story.created_at,
      objectID: story.objectID,
      num_comments: story.num_comments
    };
    var data = {
      username: user,
      bookmark: article
    };

   $http({
      method: 'POST',
      url: '/api/bookmarks/addBookmark',
      data: data
    });

    if (bookmarks.indexOf(article.objectID) === -1) {
      bookmarks.push(article.objectID);
    }
  };

  var removeBookmark = function(story){
    var article = {
      objectID: story.objectID
    };

    var data = {
      username: user,
      bookmark: article
    };

   $http({
      method: 'POST',
      url: '/api/bookmarks/removeBookmark',
      data: data
    });

    var splicePoint = bookmarks.indexOf(article.objectID);
    bookmarks.splice(splicePoint, 1);
  };

  return {
    bookmarks: bookmarks,
    addBookmark: addBookmark,
    removeBookmark: removeBookmark
  }
}]);

// HOW OUR FOLLOWING SYSTEM WORKS:
// We want users to be able to follow people before they even
// log in, because who actually has time to decide on a username/password?

// So, we do this by saving the users that they follow into localStorage.
// On signup, we'll send the users string in localStorage to our server
// which wil save them to a database.

angular.module('hack.followService', [])

.factory('Followers',  ["$http", "$window", function($http, $window) {
  var following = [];

  var updateFollowing = function(){
    var user = $window.localStorage.getItem('com.hack');

    if(!!user){
      var data = {
        username: user,
        following: localStorageUsers()
      };

      $http({
        method: 'POST',
        url: '/api/users/updateFollowing',
        data: data
      });
    }
  };

  var addFollower = function(username){
    var localFollowing = localStorageUsers();

    if (!localFollowing.includes(username) && following.indexOf(username) === -1) {
      localFollowing += ',' + username
      $window.localStorage.setItem('hfUsers', localFollowing);
      following.push(username);
    }

    // makes call to database to mirror our changes
    updateFollowing();
  };

  var removeFollower = function(username){
    var localFollowing = localStorageUsers();

    if (localFollowing.includes(username) && following.indexOf(username) > -1) {
      following.splice(following.indexOf(username), 1);

      localFollowing = localFollowing.split(',');
      localFollowing.splice(localFollowing.indexOf(username), 1).join(',');
      $window.localStorage.setItem('hfUsers', localFollowing);
    }

    // makes call to database to mirror our changes
    updateFollowing();
  };

  var localStorageUsers = function(){
    return $window.localStorage.getItem('hfUsers');
  }


  // this function takes the csv in localStorage and turns it into an array.
  // There are pointers pointing to the 'following' array. The 'following' array
  // is how our controllers listen for changes and dynamically update the DOM.
  // (because you can't listen to localStorage changes)
  var localToArr = function(){
    if(!localStorageUsers()){
      // If the person is a new visitor, set pg and sama as the default
      // people to follow. Kinda like Tom on MySpace. Except less creepy.
      $window.localStorage.setItem('hfUsers', 'pg,sama');
    }

    var users = localStorageUsers().split(',');

    following.splice(0, following.length);
    following.push.apply(following, users);
  };

  

  var init = function(){
    localToArr();
  };

  init();

  return {
    following: following,
    addFollower: addFollower,
    removeFollower: removeFollower,
    localToArr: localToArr
  }
}])

angular.module('hack.linkService', [])

.factory('Links', ["$window", "$http", "$interval", "Followers", function($window, $http, $interval, Followers) {
  var personalStories = [];
  var topStories = [];
  var bookmarkStories = [];


  var topStoriesWithKeyword = [];

  var getTopStories = function() {
    console.log('getTopStories');
    var url = '/api/cache/topStories'

    return $http({
      method: 'GET',
      url: url
    })
    .then(function(resp) {

      // Very important to not point topStories to a new array.
      // Instead, clear out the array, then push all the new
      // datum in place. There are pointers pointing to this array.
      topStories.splice(0, topStories.length);
      topStories.push.apply(topStories, resp.data);
    });
  };

  var getTopStoriesWithKeyword = function(keyword) {
    console.log('getTopStoriesWithKeyword');
    var url = '/api/cache/topStoriesWithKeyword'

    return $http({
      method: 'GET',
      url: url,
      params: {keyword: keyword}
    })
    .then(function(resp) {
      console.log(resp);

      // Very important to not point topStories to a new array.
      // Instead, clear out the array, then push all the new
      // datum in place. There are pointers pointing to this array.
      topStoriesWithKeyword.splice(0, topStoriesWithKeyword.length);
      topStoriesWithKeyword.push.apply(topStoriesWithKeyword, resp.data);
      console.log(topStoriesWithKeyword);
    });
  }

  var getPersonalStories = function(usernames){
    var query = 'http://hn.algolia.com/api/v1/search_by_date?hitsPerPage=500&tagFilters=(story,comment),(';
    var csv = arrToCSV(usernames);

    query += csv + ')';

    return $http({
      method: 'GET',
      url: query
    })
    .then(function(resp) {
      angular.forEach(resp.data.hits, function(item){
        // HN Comments don't have a title. So flag them as a comment.
        // This will come in handy when we decide how to render each item.
        if(item.title === null){
          item.isComment = true;
        }
      });

      // Very important to not point personalStories to a new array.
      // Instead, clear out the array, then push all the new
      // datum in place. There are pointers pointing to this array.
      personalStories.splice(0, personalStories.length);
      personalStories.push.apply(personalStories, resp.data.hits);
    });
  };

  var getBookmarks = function(){
    var user = $window.localStorage.getItem('com.hack');

    var data = {username: user};
    return $http({
      method: 'POST',
      url: '/api/bookmarks/getBookmarks',
      data: data
    })
    .then(function(resp) {
      bookmarkStories.splice(0, bookmarkStories.length);
      angular.forEach(resp.data, function (story) {
        bookmarkStories.push(story);
      });
    });
  };

  var arrToCSV = function(arr){
    var holder = [];

    for(var i = 0; i < arr.length; i++){
      holder.push('author_' + arr[i]);
    }

    return holder.join(',');
  };

  var init = function(){
    getPersonalStories(Followers.following);

    $interval(function(){
      getPersonalStories(Followers.following);
      getTopStories();
    }, 300000);
  };

  init();

  return {
    getTopStories: getTopStories,
    getTopStoriesWithKeyword: getTopStoriesWithKeyword,
    getPersonalStories: getPersonalStories,
    personalStories: personalStories,
    topStories: topStories,
    topStoriesWithKeyword: topStoriesWithKeyword,
    getBookmarks: getBookmarks,
    bookmarkStories: bookmarkStories
  };
}]);



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

angular.module('hack.currentlyFollowing', [])

.controller('CurrentlyFollowingController', ["$scope", "Followers", function ($scope, Followers) {
  $scope.currentlyFollowing = Followers.following;

  $scope.unfollow = function(user){
    Followers.removeFollower(user);
  };

  $scope.follow = function(user){
    Followers.addFollower(user);
    $scope.newFollow = "";
  };
}]);

angular.module('hack.personal', [])

.controller('PersonalController', ["$scope", "$window", "Links", "Followers", "Auth", "Bookmarks", function ($scope, $window, Links, Followers, Auth, Bookmarks) {
  $scope.stories = Links.personalStories;
  $scope.users = Followers.following;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.loggedIn = Auth.isAuth();

  $scope.isBookmark = function(story) {
    if (Bookmarks.bookmarks.indexOf(story.objectID) === -1) {
      return false;
    } else {
      return true;
    }
  };
  
  $scope.addBookmark = function(story) {
    Bookmarks.addBookmark(story);
  };

  $scope.removeBookmark = function(story) {
    Bookmarks.removeBookmark(story);
  };

  var init = function(){
    fetchUsers();
  };
  
  var fetchUsers = function(){
    Links.getPersonalStories($scope.users);
  };
  
  init();
}]);


angular.module('hack.bookmarks', [])

.controller('BookmarksController', ["$scope", "$window", "Links", "Followers", "Bookmarks", "Auth", function ($scope, $window, Links, Followers, Bookmarks, Auth) {
  $scope.currentBookmarks = Bookmarks.bookmarks;
  $scope.loggedIn = Auth.isAuth();
  $scope.stories = Links.bookmarkStories;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.currentlyFollowing = Followers.following;

  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };
  
  var init = function () {
    Links.getBookmarks();
  };
  init();
}]);

angular.module('hack.tabs', [])

.controller('TabsController', ["$scope", "$location", "$window", "Links", "Followers", function ($scope, $location, $window, Links, Followers) {
  // If a user refreshes when the location is '/personal',
  // it will stay on '/personal'.
  var hash = $window.location.hash.split('/')[1];
  hash = !hash ? 'all' : hash;
  $scope.currentTab = hash;

  // What is angle? Don't worry. This just makes the
  // refresh button do a cool spin animation. We splurged.
  $scope.angle = 360;

  $scope.changeTab = function(newTab){
    $scope.currentTab = newTab;
    $location.path(newTab);
  };

  $scope.refresh = function(){
    Links.getTopStories();
    Links.getPersonalStories(Followers.following);
    //technically this needs bookmarks and maybe filters here
    $scope.angle += 360;
  };
}]);

angular.module('hack.topStories', [])

.controller('TopStoriesController', ["$scope", "$window", "Links", "Followers", "Bookmarks", "Auth", function ($scope, $window, Links, Followers, Bookmarks, Auth) {
  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.loggedIn = Auth.isAuth();
  $scope.currentlyFollowing = Followers.following;

  $scope.getData = function() {
    Links.getTopStories();
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.isBookmark = function(story) {
    if (Bookmarks.bookmarks.indexOf(story.objectID) === -1) {
      return false;
    } else {
      return true;
    }
  };

  $scope.addBookmark = function(story) {
    Bookmarks.addBookmark(story);
  };

  $scope.removeBookmark = function(story) {
    Bookmarks.removeBookmark(story);
  };

  $scope.getData();
}]);



angular.module('hack.topStoriesWithKeyword', [])

.controller('TopStoriesWithKeywordController', ["$scope", "$window", "Links", "Followers", function ($scope, $window, Links, Followers) {
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
}]);


angular.module('hack', [
  'hack.topStories',
  'hack.topStoriesWithKeyword',
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

.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
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
}])

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

