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


};


function spotifySearch() {

    spotClient.search({ type: 'track', query: userInput, limit: 1 }, function(err, data) {
        if (err) {
          console.log("---------------ERROR");
          return console.log('Error occurred: ' + err);
          console.log("--------------------");
        } else {

            var songInfo = [
                
                "Artist Name: " + data.tracks.items[0].artists[0].name,
                "Song Name: " + data.tracks.items[0].name, 
                "Song Preview: " + data.tracks.items[0].preview_url,
                "Album Name: " + data.tracks.items[0].album.name,
            ]

            for (var i = 0; i < songInfo.length; i++) {


                console.log(songInfo[i]);

                fs.appendFile('log.txt', '\n' + songInfo[i] + '\n', (error) => {
                    if (error) throw error;
                });
      
            }
   
        }
      
    });
};

function twitterFunction() {

    var userName = { screen_name: userInput };
    twitterClient.get('statuses/user_timeline', userName, function(err, tweets, response) {
    if (!err) {
        for (var i = 0; i < tweets.length; i++) {
           
            console.log(tweets[i].text);

            fs.appendFile('log.txt', '\n' + tweets[i].text + '\n', (err) => {
                if (err) throw err;
            });

        };

        
    } else {
        console.log("---------------ERROR");
        return console.log('Error occurred: ' + err);
        console.log("--------------------");
    }

    
    });

}

function movie() {
    request("http://www.omdbapi.com/?t=" + userInput + "&apikey=trilogy", function(err, response, body) {
        if (err) {

            console.log("---------------ERROR");
            return console.log('Error occurred: ' + err);
            console.log("--------------------");

        }  else if (!err && response.statusCode === 200) {

            var body = JSON.parse(body)
   
            var movieInfo = [
                
                "Title: " + body.Title,  
                "Year: " + body.Year,  
                "IMDB: " + body.imdbRating,   
                "Rotten Tomatoes: " + body.Ratings[1].Value,      
                "Country: " + body.Country,
                "Language: " + body.Language,
                "Plot: " + body.Plot,
                "Actors: " + body.Actors,
                
            ];
            for (var i = 0; i < movieInfo.length; i++) {  

                console.log(movieInfo[i]);

                fs.appendFile('log.txt', '\n' + movieInfo[i] + '\n', (err) => {
                    if (err) throw err;
                });
            };
        }
    });
};

function doWhat() {
    fs.readFile('random.txt', 'utf8', (error, data) => {
        if (error) {
            console.log("=======================")
            console.log(error);
            console.log("=======================")
        }
        else {
            // Split out the command name and the parameter name
            var cmdString = data.split(',');
            var command = cmdString[0].trim();
            var input = cmdString[1].trim();
            userInput = input

            switch (command) {
                case 'my-tweets':
                    myTweets();
                    break;

                case 'spotify-this-song':
                    spotifySong(input);
                    break;

                case 'movie-this':
                    movieLook(input);
                    break;
            };
        };
    });
};

