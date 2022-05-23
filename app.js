req('dotenv').config();

const express = req('express');
const hbs = req('hbs');

// req spotify-web-api-node package here:
const SpotifyWebApi = req('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
//var SpotifyWebApi = req('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '57ad007c5c514f59af15a3ee169b1bf2',
  clientSecret: 'a23f0e08caaf48b28a38edbcab95afc5',
  redirectUri: 'http://www.example.com/callback'
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      //console.log('The received data from the API: ', data.body);
      //res.json(data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      //console.log('The received data from the API: ', data.body);
      //res.json(data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('albums', { albums: data.body.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

// app.get('/tracks/:albumId', (req, res) => {
//   const albumId = req.params.albumId;
//   spotifyApi
//     .getAlbumTracks(albumId)
//     .then((data) => {
//       //console.log('The received data from the API: ', data.body);
//       //res.json(data.body.items);
//       // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//       res.render('tracks', { tracks: data.body.items });
//     })
//     .catch((err) =>
//       console.log('The error while searching artists occurred: ', err)
//     );
// });

//With Async await
app.get('/tracks/:albumId', async (req, res) => {
  const albumId = req.params.albumId;
  try {
    const {
      body: { items: tracks },
    } = await spotifyApi.getAlbumTracks(albumId);
    res.render('tracks', { tracks });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);