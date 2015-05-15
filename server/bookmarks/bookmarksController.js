var Bookmark = require('./bookmarksModel.js');

module.exports = {
   addBookmark: function(request, response, next) {
   // console.log('in server!!!', request.body);
    var username = request.body.username;
    var bookmark = request.body.bookmark;
    
    Bookmark.prototype.addBookmark(bookmark, username, function(err, results){
      if(!err){
        console.log('Bookmark data added');
        response.status(200).end();
      } else {
        console.log('Bookmark data add ERROR');
        response.status(400).send(err);
      }
    });
  },
  removeBookmark: function(request, response, next) {
     var username = request.body.username;
     var bookmark = request.body.bookmark;
     
     Bookmark.prototype.removeBookmark(bookmark, username, function(err, results){
      if(!err){
        console.log('Bookmark data removed');
        response.status(200).end();
      } else {
        console.log('Bookmark data remove ERROR');
        response.status(400).send(err);
      }
    });
  },
  getBookmarks: function(request, response, next) {
    var username = request.body.username;
    Bookmark.prototype.getBookmarks(username, function(err,results){
      if(!err){
        console.log(results);
        response.status(200).json(results);
      } else {
        response.status(500).send(err);
      }
    });
  }
};