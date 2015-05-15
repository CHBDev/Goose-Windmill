var bookmarksController = require('./bookmarksController.js');

module.exports = function (app, router) {
  //Router routing to the controller
  router
    .post('/addBookmark', bookmarksController.addBookmark)
    .post('/removeBookmark', bookmarksController.removeBookmark)
}