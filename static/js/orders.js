$(document).ready( function() {
  $("#manifest-select").val(window.location.pathname);
  $("#manifest-select").change( function() {
    location.replace($(this).val());
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

function getShipments(groupId) {
  $("#get-shipments-btn").addClass("disabled");
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/orders/contractshipping/'+groupId, true);
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

function getManifest(groupId) {
  $("#get-manifest-btn").addClass("disabled");
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/orders/manifest/'+groupId, true);
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

function openModalDelete(receiptId) {
  $("#modal-delete").addClass("active");
  $("#input-receipt-id").val(receiptId);
}
function closeModalDelete() {
  $("#modal-delete").removeClass("active");
}
function sendRemoveReceipt(receiptId) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/orders/remove', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        closeModalDelete();
        location.reload();
      }
      else {
        alert('Error deleting receipt\n'+this.responseText);
      }
    }
  }
  xhr.send('receipt_id='+receiptId);
}