var Cache = require('./cacheModel.js');

module.exports = {
  topStories: function(request, response) {
    Cache.getTopStories(function(err,results){
        if(!err){
          response.status(200).json(results);
        }else{
          response.status(500).send(err);
        }
    });
  },

  topStoriesWithKeyword: function(request, response){
    console.log("THADDEUS IS A NAVY SEAL " + request.query.keyword)
  	Cache.getTopStoriesWithKeyword(request.query.keyword, function(err,results){
        if(!err){
          response.status(200).json(results);
        }else{
          response.status(500).send(err);
        }
    });
  }
};

// Initialize and refresh the top story data every two minutes
Cache.updateTopStories();
setInterval(Cache.updateTopStories, 120000);