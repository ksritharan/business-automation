function openModalDelete(boxId) {
  $("#modal-delete").addClass("active");
  $("#input-box-id").val(boxId);
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
function openModalEdit(boxId) {
  $("#modal-edit").addClass("active");
  $('#edit-input-id').val($('#'+boxId+'-input-id').val());
  $('#edit-input-type').val($('#'+boxId+'-input-type').val());
  $('#edit-input-length-cm').val($('#'+boxId+'-input-length-cm').val());
  $('#edit-input-width-cm').val($('#'+boxId+'-input-width-cm').val());
  $('#edit-input-height-cm').val($('#'+boxId+'-input-height-cm').val());
  $('#edit-input-length-in').val($('#'+boxId+'-input-length-in').val());
  $('#edit-input-width-in').val($('#'+boxId+'-input-width-in').val());
  $('#edit-input-height-in').val($('#'+boxId+'-input-height-in').val());
  $('#edit-input-cost').val($('#'+boxId+'-input-cost').val());
  $('#edit-input-weight-kg').val($('#'+boxId+'-input-weight-kg').val());
}
function closeModalEdit() {
  $("#modal-edit").removeClass("active");
}

function sendAddBox() {
  var data = {
    'type': $('#add-input-type').val(),
    'length_cm': $('#add-input-length-cm').val(),
    'width_cm': $('#add-input-width-cm').val(),
    'height_cm': $('#add-input-height-cm').val(),
    'length_in': $('#add-input-length-in').val(),
    'width_in': $('#add-input-width-in').val(),
    'height_in': $('#add-input-height-in').val(),
    'cost': $('#add-input-cost').val(),
    'weight_kg': $('#add-input-weight-kg').val()
  };
  var hasEmpty = Object.values(data).some(x => (x === null || x === ''));
  if (hasEmpty === true) {
    alert('Missing value');
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/boxes/add', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          closeModalAdd();
          location.reload();
        }
        else {
          alert('Error adding box\n'+this.responseText);
        }
      }
    }
    xhr.send($.param(data));
  }
}

function sendEditBox() {
  var data = {
    'id': $('#edit-input-id').val(),
    'type': $('#edit-input-type').val(),
    'length_cm': $('#edit-input-length-cm').val(),
    'width_cm': $('#edit-input-width-cm').val(),
    'height_cm': $('#edit-input-height-cm').val(),
    'length_in': $('#edit-input-length-in').val(),
    'width_in': $('#edit-input-width-in').val(),
    'height_in': $('#edit-input-height-in').val(),
    'cost': $('#edit-input-cost').val(),
    'weight_kg': $('#edit-input-weight-kg').val()
  };
  var hasEmpty = Object.values(data).some(x => (x === null || x === ''));
  if (hasEmpty === true) {
    alert('Missing value');
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/boxes/edit', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          closeModalEdit();
          location.reload();
        }
        else {
          alert('Error editing box\n'+this.responseText);
        }
      }
    }
    xhr.send($.param(data));
  }
}
function sendRemoveBox() {
  var boxId = $("#input-box-id").val();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/boxes/remove', true);
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

function updateShipping() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/boxes/shipping', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload();
      }
      else {
        alert('Error updating shipping\n'+this.responseText);
      }
    }
  }
  xhr.send();
}