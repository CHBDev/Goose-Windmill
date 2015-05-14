var bookmarksController = require('./bookmarksController.js');

module.exports = function (app, router) {
  //Router routing to the controller
  router
    .post('/updateBookmarks', bookmarksController.updateBookmarks)
};