$(document).ready( function() {
  $( ".form-select" ).change( function () {
    location.replace("/inventory/" + $(this).children("option:selected").text());
  });
});

function sendCreateManifest() {
  var data = {
    'strategy': $("#strategy").val()
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/manifest/create', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.replace("/orders/" + this.responseText);
      }
      else {
        alert('Error creating manifest\n'+this.responseText);
      }
    }
  }
  xhr.send($.param(data));
}


function sendAddRandom() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/inventory/random', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload();
      }
      else {
        alert('Error adding random\n'+this.responseText);
      }
    }
  }
  xhr.send();
}