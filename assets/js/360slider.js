$(function(){
  
  ///////////////////////////////////////////////////////////////////////////
  //SETUP
  ///////////////////////////////////////////////////////////////////////////

  var $track = $("#track"),
      $thumb = $("#thumb"),
      $txtDegrees = $("#txtDegrees"),
      $window = $(window),
      distMax = $("#track").outerWidth(true),
      thumbHalf = $thumb.width() * .5,
      max = distMax - $thumb.width(),
      animDuration = 400,
      hits = [0, 90, 180, 270, 360];

  ///////////////////////////////////////////////////////////////////////////
  //INIT
  ///////////////////////////////////////////////////////////////////////////
  
  $thumb.on("mousedown", onDown);
  $window.on("mouseup", onUp);
  for(var i = 0, len = hits.length, $hit; i < len; i++) {
    $hit = $("<div class='hotspot' data-degree='" + hits[i] + "'></div>");
    $hit.css("left", (hits[i]/360 * max) + "px");
    $track.after($hit);
    $hit.css("left", $hit.position().left + $hit.width()/2);
  }
  $("#slider").on("click", ".hotspot", onHotspot);
  
  ///////////////////////////////////////////////////////////////////////////
  //METHODS
  ///////////////////////////////////////////////////////////////////////////

  function skipToHotspot(targetVal) {
    $thumb.stop().animate({
    	left: targetVal/360 * max,
  	}, animDuration);
    
    var startingVal = $txtDegrees.text();
    $({ val: startingVal }).stop().animate({ val: targetVal }, {
      duration: animDuration,
      step: function() {
        updateDegree(Math.round(this.val));
      }
    });
  }

  function updateDegree(val) {
    $txtDegrees.html(val);

    //you could broadcast val here to enable a subject/product to update its angle
  }
  
  ///////////////////////////////////////////////////////////////////////////
  //HANDLERS
  ///////////////////////////////////////////////////////////////////////////

  function onDown(e) {
    $thumb.addClass("grabbing");
    $window.on("mousemove", onMove);
  }
  
  function onUp(e) {
    $thumb.removeClass("grabbing");
    $window.off("mousemove", onMove);
  }
  
  function onMove(e) {
    var x = e.pageX - $track.offset().left,
        fraction = parseFloat(x/max).toFixed(2);
    
    //bounds pos
    if(x < 0)
      x = 0;
    else if(x > max)
      x = max;
    
    //bounds fraction
    if(fraction < 0)
      fraction = 0;
    else if(fraction > 1)
      fraction = 1;
    
    //update
    $thumb.css("left", x + "px");
    updateDegree(Math.round(fraction * 360));
  }
  
  function onHotspot(e) {
    var degreeTarget = $(e.target).attr("data-degree");
    skipToHotspot(degreeTarget);
  }
  
});