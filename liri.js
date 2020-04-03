require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios")
var fs = require("fs")
var moment = require("moment")

var defaultMovie = 'Mr. Nobody';
var defaultSong= 'The Sign';

var Command = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");

function goLiri(Command, userSearch) {
switch (Command) {
    case "spotify-this":
        getSpotify(userSearch);
        break;

    case "concert-this":
        getBandsinTown(userSearch);
        break;

    case "movie-this":
        getOMDB(userSearch);
        break;

    case "do-what-it-says":
        getRandom();
        break;

    default:
        console.log("Please enter one of the following: 'spotify-this', 'concert-this', 'movie-this','do-what-it-says'");
    }
};

function getSpotify(songName) {
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret,
    });
        if(!songName) {
            songName = defaultSong;
        }
        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var songData = data.tracks.items[0];
            var songResults = 
                        `\n=========NEW SPOTIFY SONG=========
                        \nArtist:  + ${songData.artists[0].name}
                        \nName of Song:  + ${songData.name} 
                        \nPreview Link:  + ${songData.preview_url}
                        \nAlbum:  + ${songData.album.name}
                        \n===================================`;
                        console.log(songResults);
            var logSongData = songResults;
            fs.appendFile("log.txt", logSongData, function(err){
                if (err) throw err;
            });
        }
)};

function getOMDB(movieName) {
    axios.get("http://www.omdbapi.com/?apikey=42518777&t=" + movieName)
    .then(function(data) {
        var movieData = data.data;
        var movieResults = `
        \n========MOVIE DATA=========
        \nTitle of movie: ${movieData.Title}
        \nYear of Release: ${movieData.Year}
        \nMovie Rating: ${movieData.Rated}
        \nRotten Tomatoes Rating: ${movieData.Ratings[1].Value}
        \nMovie Country Origin: ${movieData.Country}
        \nMovie Language: ${movieData.Language}
        \nMovie Plot: ${movieData.Plot}
        \nMovie Actors ${movieData.Actors}
        \n===========================
        `;
        console.log(movieResults);

        var logMovie = movieResults;
        
        fs.appendFile("log.txt", logMovie, function(err){
            if (err) throw (err);
        });
    })
    if(!movieName) {
            var defaultMovieArguemnt = 
            `
            \n=========Default Movie============
            \nYou should watch ${defaultMovie}!
            \nIf you havent already:
            \nhttp://www.imdb.com/title/tt0485947/
            `
        console.log(defaultMovieArguemnt);
        fs.appendFile("log.txt", defaultMovieArguemnt, function(err){
            if (err) throw (err);
        });
    }
};

function getBandsinTown(artist) {
    var artist = userSearch;
    var bandQuery = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    axios.get(bandQuery)
        .then(function (response) {
            var concertData =response.data[0];
            var eventDate = moment(concertData.datetime).format("MM/DD/YYYY"); 
            var concertResults =`
            \n=========Concert Entry===========
            \nArtist: ${artist}
            \nName of Venue: ${concertData.venue.name}
            \nVenue Location: ${concertData.venue.city}
            \nEvent Date: ${eventDate}
            \n=================================
            `;
            console.log(concertResults);

            var logConcert = concertResults;

            fs.appendFile("log.txt", logConcert, function(err){
                if (err) throw err;
            });

        });
    };

function getRandom () {
    fs.readFile("random.txt", "utf8", function(err, data){
        data = data.split(",");
        var command = data[0];
        var userSearch = data[1];
            switch(command){
                case "spotify-this":
                    getSpotify(userSearch);
                    break;

                case "concert-this":
                    getBandsinTown(userSearch);
                    break;

                case "movie-this":
                    getOMDB(userSearch);
                    break;
                default:
                    console.log(`Please enter one of the following: 'spotify-this', 'concert-this', 'movie-this','do-what-it-says`);
                    break;
            }
    });
}

goLiri(Command, userSearch);