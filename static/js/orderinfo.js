var trackingPin = "";

$(document).keypress( function() {
  //Enter
  console.log(event.which);
  if (event.which == 13) {
    location.assign("/orderinfo/"+trackingPin);
  }
  else {
    trackingPin += String.fromCharCode(event.which);
  }
});