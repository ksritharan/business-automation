$(document).ready( function() {
  $( ".form-class-select" ).change( function () {
    var productId = $(this).attr("data-val");
    var packageClassId = $(this).children("option:selected").attr("data-val");
    $(this).prop("disabled", true);
    sendUpdateProductClass(productId, packageClassId, this);
  });
});

function openModalDelete(packageClassId) {
  $("#modal-delete").addClass("active");
  $("#input-class-id").val(packageClassId);
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
function openModalEdit(packageClassId) {
  $("#modal-edit").addClass("active");
  $('#edit-input-id').val($('#'+packageClassId+'-input-id').val());
  $('#edit-input-class').val($('#'+packageClassId+'-input-class').val());
  $('#edit-input-cost').val($('#'+packageClassId+'-input-cost').val());
  $('#edit-input-weight-kg').val($('#'+packageClassId+'-input-weight-kg').val());
}
function closeModalEdit() {
  $("#modal-edit").removeClass("active");
}

function sendAddClass() {
  var data = {
    'class': $('#add-input-class').val(),
    'cost': $('#add-input-cost').val(),
    'weight_kg': $('#add-input-weight-kg').val()
  };
  var hasEmpty = Object.values(data).some(x => (x === null || x === ''));
  if (hasEmpty === true) {
    alert('Missing value');
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/products/class/add', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          closeModalAdd();
          location.reload();
        }
        else {
          alert('Error adding package class\n'+this.responseText);
        }
      }
    }
    xhr.send($.param(data));
  }
}

function sendEditClass() {
  var data = {
    'id': $('#edit-input-id').val(),
    'class': $('#edit-input-class').val(),
    'cost': $('#edit-input-cost').val(),
    'weight_kg': $('#edit-input-weight-kg').val()
  };
  var hasEmpty = Object.values(data).some(x => (x === null || x === ''));
  if (hasEmpty === true) {
    alert('Missing value');
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/products/class/edit', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          closeModalEdit();
          location.reload();
        }
        else {
          alert('Error editing package class\n'+this.responseText);
        }
      }
    }
    xhr.send($.param(data));
  }
}
function sendRemoveClass() {
  var boxId = $("#input-class-id").val();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/products/class/remove', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        closeModalDelete();
        location.reload();
      }
      else {
        alert('Error deleting box\n'+this.responseText);
      }
    }
  }
  xhr.send('id='+boxId);
}


function sendUpdateProductClass(productId, packageClassId, dropDown) {
  var data = {
    'id': productId,
    'package_class_id': packageClassId
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/products/edit', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        $(dropDown).attr("disabled", false);
      }
      else {
        alert('Error updating package class\n'+this.responseText);
      }
    }
  }
    xhr.send($.param(data));
}

function sendEditQty(sku, input) {
  var quantity = $(input).val();
  
  if (quantity != '') {
    var data = {
      'sku': sku,
      'quantity': parseInt(quantity)
    };
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/inventory/edit', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
        }
        else {
          alert('Error editing inventory\nsku: '+sku+'\nquantity: '+quantity+'\n'+this.responseText);
        }
      }
    }
    xhr.send($.param(data));
  }
}