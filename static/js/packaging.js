function openModalDelete(packageId) {
  $("#modal-delete").addClass("active");
  $("#input-package-id").val(packageId);
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
function openModalEdit(packageId) {
  $("#modal-edit").addClass("active");
  $("#stored-data-"+packageId+" input").each( function() {
    var key = $(this).attr("key");
    $("#edit-"+key).val($(this).val());
  });
  
}
function closeModalEdit() {
  $("#modal-edit").removeClass("active");
}

function sendAdd() {
  var data = {};
  var box_id = $("#add-input-box-type").children("option:selected").attr("data-val");
  data['box_id'] = box_id;
  
  $("#modal-add .form-val").each( function() {
    var key = $(this).attr("key");
    var val = $(this).val();
    data[key] = val;
  });
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/packaging/add', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        closeModalAdd();
        location.reload();
      }
      else {
        alert('Error adding package\n'+this.responseText);
      }
    }
  }
  xhr.send($.param(data));
}

function sendEdit() {
  var data = {};
  var boxId = $("#edit-input-box-type").children("option:selected").attr("data-val");
  data['box_id'] = boxId;
  var packageId = $("#edit-input-package-id").val();
  data['package_id'] = packageId;
  
  $("#modal-edit .form-val").each( function() {
    var key = $(this).attr("key");
    var val = $(this).val();
    data[key] = val;
  });
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/packaging/edit', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        closeModalEdit();
        location.reload();
      }
      else {
        alert('Error editing package\n'+this.responseText);
      }
    }
  }
  xhr.send($.param(data));
}
function sendRemove() {
  var packageId = $("#input-package-id").val();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/packaging/remove', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        closeModalDelete();
        location.reload();
      }
      else {
        alert('Error deleting packaging\n'+this.responseText);
      }
    }
  }
  xhr.send('id='+packageId);
}