define(
  [
    'flight/component',
  ],

  function(createComponent){


    return createComponent(DisplayDetail);


    function DisplayDetail() {

      /**
       * Initialization, listen for events.
       */
      this.after('initialize', function() {
        this.on(document, 'searchResultDetailRequestedAugmented', this.displayDetailResult);
      });


      this.defaultAttrs({
        'dataPlaceholder': '.data-summary-data'
      });


      /**
       * Display detail result.
       */
      this.displayDetailResult = function(event, data) {

      	var embed, result;

      	embed = '<iframe src="https://embed.spotify.com/?uri='+data.spotifyUri+'&view=list" width="250" height="80" frameborder="0" allowtransparency="true"></iframe>';

      	//result = embed;
      	result = '';
      	result += (data.type === 'track') ? this.displayTrackDetails(data) : this.displayAlbumDetails(data);

      	this.select('dataPlaceholder').html(result);
      }

      this.displayTrackDetails = function(data) {

      	var album, territories, artists, output;
        artists = '<h3>Artists</h3>';
        artists += '<ul>';
        data.data.artists.forEach(function(artist){
          artists += '<li><a href="' + artist.href + '">'+artist.name+'</a></li>';
        });
        artists += '</ul>';

        album = '<h3>Album</h3>';
        album += '<ul><li><a href="' + data.data.album.href + '">'+data.data.album.name+'</a></li></ul>';

        // console.log(data);

      	return artists+album;
      };

      this.displayAlbumDetails = function(data) {

       	var output, territories, artists, output;

      	output = '<h2>Album details: '+data.data.name+'</h2>';
      	output += '<ul>';
      	territories = data.data.availability.territories.split(' ');
      	territories.forEach(function(territory, index){
      	  output += '<li>'+territory+'</li>';
      	});

      	output += '<h2>Artists</h2>';
      	output += '<ul>';
        data.data.artists.forEach(function(artist){
          output += '<li>'+artist.name+'</li>';
        });
      	output += '</ul>';

      	return output;
      };
    }

});