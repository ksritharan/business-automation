var data = "";

$(document).keypress( function() {
  //Enter
  console.log(event.which);
  if (event.which == 13) {
    //tracking num can be in the format of (0000 0000 0000, AA 000 000 000 AA, 0000 0000 0000 0000)
    //if below filtering isn't good then probably need regex check or redirects
    if (data.length == 12 || data.length == 13 || data.length == 16 || data.length == 27) {
      if (data.length == 27) {
        data = data.slice(7, 23); //2M1B3R58765432112345780000 -> 876543211234578
      }
      location.assign("/orderinfo/"+data);
    }
    else {
      location.assign("/manifestinfo/"+data);
    }
  }
  else {
    data += String.fromCharCode(event.which);
  }
});