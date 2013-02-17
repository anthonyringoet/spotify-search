/**
 * @see: https://github.com/mbostock/d3/wiki/Geo-Paths
 */
define(
  [
      'flight/component'
    , 'components/d3/d3'
  ],
  function(createComponent, d3){

//          window.geoSelect = function(){
//              d3.selectAll('#PAK').transition().style('fill', 'green');
//          }

    return createComponent(Geo);

    function Geo() {

      var svg, drag, projection;

      this.after('initialize', function(){
        this.setUpMap();
        this.setUpDrag();
        this.displayMap();
      });

      this.defaultAttrs({
          'width': 600
        , 'height': 600
      });


      /**
       * Set up map.
       */
      this.setUpMap = function(){

        // Our canvas...
        svg = d3.select('.visualization').append('svg')
             .attr('width', this.attr.width)
             .attr('height', this.attr.height);

        // Set projection.
        projection = d3.geo.orthographic()
          .scale(290)
          .translate([this.attr.width/2,this.attr.height/2])
          .clipAngle(90);


        // New geographic path generator.
        // Path defaults to albersUsa but we need the orthographic.
        path = d3.geo.path()
          .projection(projection);
      }


      /**
       * Sets dragbehavior
       */
      this.setUpDrag = function() {

        // Define drag behavior...
        drag = d3.behavior.drag()
          .origin(Object)
          .on('drag', dragMove);

       
        // Rotate the sphere while dragging...
        function dragMove() {
          rotation = projection.rotate();
          projection.rotate([rotation[0] + d3.event.dx, rotation[1] - d3.event.dy]);
          svg.selectAll("path").attr("d", path);
        }


        // A background element to catch the drag behavior...
        var rect = svg.selectAll('.drag-surface')
            .data([{x: 0, y:0}])
          .enter().append('rect')
            .attr('class', 'drag-surface')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.attr.width)
            .attr('height', this.attr.height)
            .call(drag);
      }


      /**
       * Actually display map.
       */
      this.displayMap = function() {
        
        var self = this;

         d3.json('app/assets/countries.json', function(error, data){
            console.log(data);
  
            // Position globe...
            projection.rotate([0, -50]);
  
            // Draw the countries
            var countries = svg.selectAll('.country')
                .data(data.features)
              .enter()
                .append('path')
                .attr('class', function(data, index) { 
                  return 'country '+data.id+' '+data.properties.name; 
                })
                .attr('id', function(d, i) { return d.id })
                .attr('d', path)
                .style('fill', '#333')
                .call(drag);
  
            // Add behavior
            countries
              .on('mouseover', hoverAction)
              .on('mouseout', stopHoverAction)
              .on('click', function(event, data) {
                  // Trigger a custom event.
                  self.trigger('countryClicked', {obj: event});
              });

            function hoverAction(data, index) {
              d3.select(countries[0][index])
                .transition()
                .style('fill', 'red');
            }
  
            function stopHoverAction(data, index) {
              d3.select(countries[0][index]).transition().style('fill', '#333');            
            }
          });
      }

    }

});