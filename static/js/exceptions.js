function sendEditExceptionLevel(exceptionId, input) {
  var level = $(input).find("option:selected").attr("data-val");
  var data = {
    'id': exceptionId,
    'level': level
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/exceptions/level/edit', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        $(input).addClass("is-success");
        setTimeout(function() {
          $(input).removeClass("is-success");
        }, 300);
      }
      else {
        alert('Failed editing\n'+this.responseText);
        location.reload();
      }
    }
  }
  xhr.send($.param(data));
}
function sendEditExceptionStatus(exceptionId, input) {
  var s = $(input).is(":checked") ? 0 : 1;
  var data = {
    'id': exceptionId,
    'status': s
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/exceptions/status/edit', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
      }
      else {
        alert('Failed editing\n'+this.responseText);
        location.reload();
      }
    }
  }
  xhr.send($.param(data));
}