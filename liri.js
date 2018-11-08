//npm set ups.
//Confused here getting errors about no descriptions or repo fields installed:

//npm i node-spotify-api
//npm i request
//npm i moment
//npm i dotenv

//require variables from the npm documentation

require("dotenv").config();

const Spotify = require("node-spotify-api");
const request = require("request");
let fs = require("fs");
let keys = require("./keys.js");

//get the user

const spotify = new Spotify(keys.spotify);

const omdb = new omdb(keys.omdb);

const bandisintown = new bandisintown(keys.bandisintown);

const query = process.argv[3];
const input = process.argv[2];

//Variables needed in Api calls
let movieTitle; //used in the movie-this case
let movieUrl; //used in the movie-this case
let movieSearchResult; //used in the movie-this case
let songTitle; //used in the spotify-this-song case

//make a decision based on the command
switch (input) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("idk go to the public library");
}

function concertThis() {
  var artist = query.join(" ");

  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=" +
    bandisintown;

  request(queryURL, function(error, response, body) {
    if (error) console.log(error);
    var result = JSON.parse(body)[0];
    console.log("Venue name " + result.venue.name);
    console.log("Venue location " + result.venue.city);
    console.log(
      "Date of Event " + moment(result.datetime).format("MM/DD/YYYY")
    );
  });
}

//For spotify without being able to search using gitignore I put my ID and Secret within the search string in a seperate document to find api paths for artist/track/album/url info
songTitle = process.argv[3];
function spotifyThisSong() {
  if (songTitle == "") {
    songTitle = "The Sign Ace of Base";
  } else {
    songTitle = query;
  }
  //Use NPM package to get spotify data
  spotify.search({ type: "track", query: songTitle }, function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }
    console.log(data);
    for (let i = 0; i < 5; i++) {
      console.log("The artist is: " + data.tracks.items[i].artists[0].name);
      console.log("The track name is: " + data.tracks.items[i].name);
      console.log("The album name is: " + data.tracks.items[i].album.name);
      console.log(
        "The Spotfiy preview is: " + data.tracks.items[i].external_urls.spotify
      );
    }
  });
}

function movieThis() {
  if (query == "") {
    //if no movie is provided default to ‘Mr. Nobody’
    movieTitle = "Mr. Nobody";
  } else {
    movieTitle = titleString;
  }
  movieUrl =
    "http://www.omdbapi.com/?t=" +
    movieTitle +
    "&tomatoes=true&y=&plot=short&r=json";
  request(movieUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      //console.log(body);
      movieSearchResult = JSON.parse(body);
      console.log("The Title is: " + movieSearchResult.Title);
      console.log("The Year is: " + movieSearchResult.Year);
      console.log("The imdbRating is: " + movieSearchResult.imdbRating);
      console.log(
        "The Rotton Tomatoes Rating is: " + movieSearchResult.tomatoRating
      );
      console.log("The Rotton Tomatoes url is: " + movieSearchResult.tomatoURL);
      console.log("The Country is: " + movieSearchResult.Country);
      console.log("The Language is: " + movieSearchResult.Language);
      console.log("The Plot is: " + movieSearchResult.Plot);
      console.log("The Actors are: " + movieSearchResult.Actors);
    }
  });
}
//mirrored the spotify function to run the function for dowhat it says. Only difference is reading the file using the npm FS require
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    //check to see if there are errors
    if (error) {
      return console.log("error reading file");
    }
    let trackArr = data.split(",");

    let input = trackArr[0];
    // I can figure out how to put the input in the console so proceding with the set input of spotify search
    let trackName = trackArr[1];

    spotify.search({ type: "track", query: trackName }, function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      console.log(data);
      for (let i = 0; i < 5; i++) {
        console.log("The artist is: " + data.tracks.items[i].artists[0].name);
        console.log("The track name is: " + data.tracks.items[i].name);
        console.log("The album name is: " + data.tracks.items[i].album.name);
        console.log(
          "The Spotfiy preview is: " +
            data.tracks.items[i].external_urls.spotify
        );
      }
    });
  });
}
