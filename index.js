/* Load the HTTP library */
var http = require("http");
var Spotify = require("node-spotify-api");
const fs = require("fs");
var request = require("sync-request");
var express = require("express");
var app = express();
const mongoose = require('mongoose');

//how to get the access_token
//https://accounts.spotify.com/authorize?client_id=f6637938aa9e4f40b5aa88b1c9f50a7f&redirect_uri=https://casinowebguide.com&response_type=token

let songs = [];
let songsobject = []


function savetodb(){
const connexion = 'mongodb://127.0.0.1/eurovision'

mongoose.connect(connexion, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', _ => {
    console.log('Database Connected:', connexion);
})

db.on('error', err => {
    console.error('Connection error:', err)
})

var Schema = mongoose.Schema;
//the schema of the songs
var SongSchema = new Schema({
year: Number,
artist: String,
name: String,
duration: String,
key: Number,
mode: Number,
signature: Number,
loudness: Number,
mood: Number,
speechiness: Number,
danceability: Number,
energy: Number,
accousticness: Number,
instrumentalness: Number,
liveness: Number,
tempo: Number,
});

 // Initializing the collection of documents by setting up a new model based on the SongSchema schema
 var SongModel = mongoose.model("songs", SongSchema);
 SongModel.deleteMany({})
songs.forEach((song, index) => {
  let songdb = new SongModel({
    year: song.year,
    artist: song.artist,
    name: song.name,
    duration: song.duration_ms,
    mode: song.mode,
    signature: song.signature,
    loudness: song.loudness,
    mood: song.mood,
    speechiness: song.speechiness,
    energy: song.energy,
    accousticness: song.acousticness,
    instrumentalness: song.instrumentalness,
    liveness: song.liveness,
    tempo: song.tempo
  })
  songdb.save((err) => {
    if (err) return handleError(err);
  });
})
}
 



function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }


const access_token =
  "BQBxeLlVWiztV-Jmfeo_FPo_H9pQ_Xnu9O9LQZIe3yQlUrkfXMQO7YqJW0jgVpwfN65-yY84tKOc1A9FPMf3x_EcdK_Wv7QwFhj9j_D8u-IJRiZkUkCduborUlLeO98EkpC3djtVSCUtXdA";
const playlists = [
  // { year: 2003, id: "3sxozYHQFvZ9yoZI0irRnA" },
  // { year: 2004, id: "5fGHP7oZzm9VE7DOW1a61e" },
  // { year: 2005, id: "7gubzwf45FI6Vuz8YqxoAC" },
  // { year: 2006, id: "6JHVNBiQrZK8jZbPJo3IQe" },
  // { year: 2007, id: "3b7eCqwUaI15OkKf1ew7bC" },
  // { year: 2008, id: "2W6Km8zv5P0Dwro0RJ0d9E" },
  // { year: 2009, id: "0yoZw30ogd6gENBtx0q0HS" },
  // { year: 2010, id: "3Vf3E8WavFCRLGF3a97nR9" },
  // { year: 2011, id: "4HPdL5jwsxKnh7RTAwq9hF" },
  // { year: 2012, id: "5tjy5qbWxaFFFTseRDptC7" },
  // { year: 2013, id: "2YPpTFZPn6s1y7q8PFRLv7" },
  // { year: 2014, id: "3svTn0yv1hfv8vzMzVd31D" },
  // { year: 2015, id: "1HtXxHLxLvC5ePfd0hQC7U" },
  // { year: 2016, id: "0VEtwmjx3FK77jWLlI16EV" },
  // { year: 2017, id: "6Ey20ccpxRCd0AlaIuGJrB" },
  // { year: 2018, id: "5sxwk5T34E2l2Ng02lipHS" },
  // { year: 2019, id: "3ZdQUt8Tmtt7oOU8UM2koe" },
  // {year: 2021, id: "37i9dQZF1DWVCKO3xAlT1Q"},
     {year: 2022, id: "37i9dQZF1DWVCKO3xAlT1Q"}
];

fs.appendFileSync(
    "file.txt",
    "YEAR$NAME$DURATION$KEY$MODE$SIGNATURE$MOOD$DANCEABILITY$ENERGY$SPEECHINESS$ACOUSTICNESS$INSTRUMENTALNESS$LIVENESS&TEMPO" +
      "\n"
  );
playlists.forEach(function (playitem) {
  console.log(playlists[0].id);
  var res = request(
    "GET",
    "https://api.spotify.com/v1/playlists/" +
      playitem.id +
      "/tracks?access_token=" +
      access_token
  );
  const jsonres = JSON.parse(res.getBody().toString());

  jsonres.items.forEach(function (jsonitem, index) {
    songs.push(jsonitem);
    console.log('playlist year is: ' + playitem.year);
    console.log('name of song belonging to the ' + playitem.id + ' playlist, is ' + jsonitem.track.name);
    console.log('iteration number of the ' + playitem.id + ' playlist is : ' + index);
    songs[songs.length - 1].year = playitem.year;
    console.log('song number ' + index + ' has year: ' + songs[index].year);

    var res2 = request(
        "GET",
        "https://api.spotify.com/v1/audio-features/" +
        jsonitem.track.id +
          "?access_token=" +
          access_token
      );
      const jsonres2 = JSON.parse(res2.getBody().toString());
      console.log("track id is: " + jsonitem.track.id);
      if (jsonitem.track.id == "3kOAf0t5pHr5iKO0R3msiO") {
        return;
      }
      songsobject.push(jsonres2)
      songs[index].name = jsonitem.track.name;
      songs[index].artist = jsonitem.track.artists[0].name
      songs[index].year = playitem.year;
      songsobject[index].name = jsonitem.track.name;
      jsonitem.duration = jsonres2.duration_ms;
      jsonitem.key = jsonres2.key;
      jsonitem.mode = jsonres2.mode;
      jsonitem.signature = jsonres2.time_signature;
      jsonitem.loudness = jsonres2.loudness;
      jsonitem.mood = jsonres2.valence;
      jsonitem.speechiness = jsonres2.speechiness;
      jsonitem.danceability = jsonres2.danceability;
      jsonitem.energy = jsonres2.energy;
      jsonitem.acousticness = jsonres2.acousticness;
      jsonitem.instrumentalness = jsonres2.instrumentalness;
      jsonitem.liveness = jsonres2.liveness;
      jsonitem.tempo = jsonres2.tempo;
    
      console.log('index is: ' + index + ' year is: ' + jsonitem.year + " - " + jsonitem.track.name);
      console.log('songsobject.name is: ' + songsobject[index].name);
    













      //console.log(item.year + ',' + item.danceability)
      fs.appendFileSync(
        "file.txt",
        jsonitem.year +
          "$" +
          jsonitem.track.name +
          "$" +
          /*item.track.artists+','+*/ millisToMinutesAndSeconds(jsonitem.duration) +
          "$" +
          jsonitem.key +
          "$" +
          jsonitem.mode +
          "$" +
          jsonitem.signature +
          "$" +
          (jsonitem.mood * 100).toFixed() +
          "$" +
          (jsonitem.danceability * 100).toFixed() +
          "$" +
          (jsonitem.energy * 100).toFixed() +
          "$" +
          (jsonitem.speechiness * 100).toFixed() +
          "$" +
          (jsonitem.acousticness * 100).toFixed() +
          "$" +
          (jsonitem.instrumentalness * 100).toFixed() +
          "$" +
          (jsonitem.liveness * 100).toFixed() +
          "$" +
          jsonitem.tempo +
          "\n"
      );
  });

  console.log("playlist id is: " + playitem.id);
});

savetodb();



  

console.log(songs[90])
console.log(songs[20])
console.log(songs.length)