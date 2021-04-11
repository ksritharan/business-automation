function openModalDelete(printer_id) {
  $("#modal-delete").addClass("active");
  $("#input-printer-id").val(printer_id);
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
function sendAddPrinterRequest() {
  var ipAddress = $("#input-ip").val();
  var name = $("#input-name").val();
  var ipREGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  var testResult = ipREGEX.test(ipAddress);
  if (testResult == false) {
    alert('Please enter a valid ip address in the form of XXX.XXX.XXX.XXX\ne.g. 192.168.2.102');
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/printers/add', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          $("#input-ip").val("");
          closeModalAdd();
          location.reload();
        }
        else {
          alert('Error adding printer\n'+this.responseText);
        }
      }
    }
    xhr.send('ip='+ipAddress+"&name="+name);
  }
}
function sendRemovePrinterRequest() {
  var printerId = $("#input-printer-id").val();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/printers/remove', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        closeModalDelete();
        location.reload();
      }
      else {
        alert('Error deleting printer\n'+this.responseText);
      }
    }
  }
  xhr.send('printer_id='+printerId);
}
function updatePrinterColor(printerId) {
  var newColor = $("#"+printerId+"-edit-input-color").val();
  sendUpdatePrinterColorRequest(printerId, newColor);
}
function sendUpdatePrinterColorRequest(printerId, color) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/printers/color', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload();
      }
      else {
        alert('Error edit printer color\n'+this.responseText);
      }
    }
  }
  xhr.send("printerId="+printerId+"&color="+color);

}
function updatePrinterWaterplate(printerId) {
  var waterplateOnly = $("#"+printerId+"-edit-input-waterplate option:selected").attr("data-val");
  sendUpdatePrinterWaterplateRequest(printerId, waterplateOnly);
}
function sendUpdatePrinterWaterplateRequest(printerId, waterplateOnly) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/printers/waterplate', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload();
      }
      else {
        alert('Error edit printer waterplate priority\n'+this.responseText);
      }
    }
  }
  xhr.send("printerId="+printerId+"&waterplateOnly="+waterplateOnly);

}

function updateSystemFiles() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/printers/system/update', true);
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        alert(this.responseText);
      }
      else {
        alert('Error updating system files\n'+this.responseText);
      }
    }
  }
  xhr.send();
  
  
}