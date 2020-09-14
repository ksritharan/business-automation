$(document).ready( function() {
    $("#order-status-select").val(window.location.pathname);
    $("#order-status-select").change( function() {
      window.location = $(this).val();
    });
});

function updateReceipts() {
  $("#update-btn").addClass("disabled");
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/orders/update', true);
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload();
      }
      else {
        alert(this.responseText);
      }
    }
  }
  xhr.send();
}

function getShipping(receiptId) {
  $("#shipping-btn-"+receiptId).addClass("disabled");
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/orders/shipping/'+receiptId, true);
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload();
      }
      else {
        if (!alert(this.responseText)) {
          location.reload();
        }
      }
    }
  }
  xhr.send();
}

function completeOrder(receiptId) {
  $("#complete-btn-"+receiptId).addClass("disabled");
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/orders/complete/'+receiptId, true);
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload();
      }
      else {
        if (!alert(this.responseText)) {
          location.reload();
        }
      }
    }
  }
  xhr.send();
}