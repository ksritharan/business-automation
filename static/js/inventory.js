$(document).ready( function() {
  $( ".form-select" ).change( function () {
    location.replace("/inventory/" + $(this).children("option:selected").text());
  });
  $("#sku-search").keyup(function () {
    var value = $(this).val();
    search(value);
  });
  $("#sku-search").focusin(function () {
    var value = $(this).val();
    search(value);
  });
  $("#sku-search").focusout(removeAllFromAutocomplete);
});

function openModalDelete(productId) {
  $("#modal-delete").addClass("active");
  $("#input-item-sku").val($('#'+productId+'-input-sku').val());
}
function closeModalDelete() {
  $("#modal-delete").removeClass("active");
}
function openModalAdd() {
  $("#modal-add").addClass("active");
}
function closeModalAdd() {
  $("#modal-add").removeClass("active");
}
function openModalEdit(productId) {
  $("#modal-edit").addClass("active");
  $('#edit-input-sku').val($('#'+productId+'-input-sku').val());
  $('#edit-input-qty').val($('#'+productId+'-input-qty').val());
}
function closeModalEdit() {
  $("#modal-edit").removeClass("active");
}

function sendAddItems() {
  var data = {
    'sku': $('#sku-search').val(),
    'quantity': $('#add-input-qty').val()
  };
  var hasEmpty = Object.values(data).some(x => (x === null || x === ''));
  
  var skus = eval($("#skus").val());
  var hasSKU = skus.includes(data['sku']);
  
  if (hasEmpty === true) {
    alert('Missing value');
  }
  else if (hasSKU === false) {
    alert('Invalid sku');
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/inventory/add', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          closeModalAdd();
          location.reload();
        }
        else {
          alert('Error adding to inventory\n'+this.responseText);
        }
      }
    }
    xhr.send($.param(data));
  }
}

function sendEditItems() {
  var data = {
    'sku': $('#edit-input-sku').val(),
    'quantity': $('#edit-input-qty').val()
  };
  var hasEmpty = Object.values(data).some(x => (x === null || x === ''));
  if (hasEmpty === true) {
    alert('Missing value');
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/inventory/edit', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          closeModalEdit();
          location.reload();
        }
        else {
          alert('Error editing inventory\n'+this.responseText);
        }
      }
    }
    xhr.send($.param(data));
  }
}
function sendRemoveItem() {
  var data = {
    'sku': $('#input-item-sku').val(),
    'quantity': 0
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/inventory/edit', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        closeModalEdit();
        location.reload();
      }
      else {
        alert('Error deleting items\n'+this.responseText);
      }
    }
  }
  xhr.send($.param(data));
}

function search(value) {
  var skus = eval($("#skus").val());
  var filtered = skus.filter(r => String(r).startsWith(value));
  removeAllFromAutocomplete();
  filtered.forEach(e => addToAutocomplete(e));
  $("#autocomplete-list li").mousedown(function() {
    var sku = $(this).text().trim();
    $("#sku-search").val(sku);
  });
}

function addToAutocomplete(sku) {
  var item = '' +
  '  <li class="menu-item">' +
  '    <a class="noselect c-hand">' +
  '      <div class="tile tile-centered">' +
  '        <div class="tile-content">' +
            sku +
  '        </div>' +
  '      </div>' +
  '    </a>' +
  '  </li>' +
  '';
  $(item).appendTo("#autocomplete-list");
  $("#autocomplete-list").show();
}

function removeAllFromAutocomplete() {
  $("#autocomplete-list").empty();
  $("#autocomplete-list").hide();
}

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