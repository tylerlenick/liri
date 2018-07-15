// dotenv package configuration
require('dotenv').config();
// spotify and twitter variables for keys access
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var twitterClient = new twitter(keys.twitter);
var spotClient = new spotify(keys.spotify);
var userInput = "";
var operation = process.argv[2];


for (var i = 3; i < process.argv.length; i++) {
    userInput = userInput + " " + process.argv[i];
};

//Switch statement to determine which input the user selected.
switch(operation) {

    case 'my-tweets':
        twitterFunction();
        break;
    case `spotify-this-song`:
        spotifySearch();
        break;
    case `movie-this`:
        movie();
        break;
    case `do-what-it-says`:
        doWhat();
        break;
    default:
        console.log("Not a valid command...");


}


function spotifySearch() {

    spotClient.search({ type: 'track', query: userInput, limit: 1 }, function(err, data) {
        if (err) {
          console.log("---------------ERROR");
          return console.log('Error occurred: ' + err);
          console.log("--------------------");
        }
      
      console.log(JSON.stringify(data.tracks.items[0].artists[0].name)); 
      console.log(JSON.stringify(data.tracks.items[0].name));
      console.log(JSON.stringify(data.tracks.items[0].external_urls.spotify));
      console.log(JSON.stringify(data.tracks.items[0].album.name)); 
      
      });
};

function twitterFunction() {

    var userName = { screen_name: userInput };
    twitterClient.get('statuses/user_timeline', userName, function(error, tweets, response) {
    if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            var tweetsArr = tweets[i].text
            console.log(tweetsArr);
        }
      }

    
    });

}