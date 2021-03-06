$(document).ready( function() {
  $( ".form-select" ).change( function () {
    location.replace("/fulfillable/" + $(this).children("option:selected").text());
  });
});

function sendCreateManifest(btn) {
  $(btn).addClass("disabled");
  var data = {
    'strategy': $("#strategy").val()
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/manifest/create', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        sendContractShipping(this.responseText);
      }
      else {
        alert('Error creating manifest\n'+this.responseText);
      }
    }
  }
  xhr.send($.param(data));
}

function sendContractShipping(groupId) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/orders/contractshipping/'+groupId, true);
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      location.replace("/orders/" + groupId);
    }
  }
  xhr.send();
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