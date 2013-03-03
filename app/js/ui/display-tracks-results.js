define(
  [
    'flight/component',
    './search-result-item-actions'
  ],

  function(createComponent, SearchResultItemActions){


    return createComponent(DisplayTracksResults);


    function DisplayTracksResults() {

      /**
       * Initialization, listen for events.
       */
      this.after('initialize', function() {
        this.on(document, 'searchTrackResultsFound', this.displayTracksResults);
      });


      /**
       * Display the artists results.
       */
      this.displayTracksResults = function(event, data) {

        var results = data.results.map(function(track) {
      	  return '<li class="search-result-item track" data-spotifyuri="'+track.href+'" data-type="track">'+track.name+'</li>';
      	});

        var output = '<h3>Tracks</h3><ul>' + results.join('') + '</ul>';

      	this.$node.html(output);

        // animate
        var stepTwo = document.querySelector('.step-two');
        stepTwo.classList.remove('visuallyhidden');
        stepTwo.classList.add('animated');

        var results = document.querySelector('.search-results');
        results.classList.remove('visuallyhidden');
        results.classList.add('animated-delay-one');
        results.classList.add('animated');

        // Attach behaviors to it.
        SearchResultItemActions.attachTo('.search-result-item.track');
      }
    }

});