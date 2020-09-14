var updater;

$(document).ready( function() {
  $( ".sortable" ).sortable({
    connectWith: ".connectedSortable",
    start: function(event, ui) {
      var startPos = ui.item.index();
      ui.item.data('startPos', startPos);
      ui.item.data('from', $(this).find('input[name=printer_id]').val());
    },
    update: function(event, ui) {
      var item = ui.item[0];
      var startPos = parseInt(ui.item.data('startPos'));
      var from = ui.item.data('from');
      var receiver = $(ui.item).parent();
      var to = $(receiver).find('input[name=printer_id]').val();
      if (from == to) {
        updateDatabaseRequest(item, receiver, receiver, ui.item.index()-1, startPos-1); 
      }
    },
    receive: function(event, ui) {
      var item = ui.item[0];
      var sender = ui.sender[0];
      var receiver = $(this)[0];
      var startPos = parseInt(ui.item.data('startPos'));
      updateDatabaseRequest(item, sender, receiver, ui.item.index()-1, startPos-1);
    }
  }).disableSelection();
  $(".sortable li").click(function () {
    var value = $(this).attr("data-tooltip");
    $("#receipt-search").val(value);
    removeHighlights();
    highlightReceipts(value);
  });
  $(".receipt").click(function () {
    var value = $(this).find("i").text().trim();
    $("#receipt-search").val(value);
    removeHighlights();
    highlightReceipts(value);
  });
  removeAllFromAutocomplete();
  $("#receipt-search").keyup(function () {
    var value = $(this).val();
    search(value);
  });
  $("#receipt-search").focusin(function () {
    var value = $(this).val();
    search(value);
  });
  $("#receipt-search").focusout(removeAllFromAutocomplete);
  updater = setInterval(updateAllPrinterStatuses, 500);
} );

function search(value) {
  var receipts = eval($("#receipts").val());
  var filtered = receipts.filter(r => String(r).startsWith(value));
  removeAllFromAutocomplete();
  removeHighlights();
  filtered.forEach(e => addToAutocomplete(e));
  $("#autocomplete-list li").mousedown(function() {
    var receiptId = $(this).text().trim();
    $("#receipt-search").val(receiptId);
    highlightReceipts(receiptId);
  });
}

function removeHighlights() {
  $("li").removeClass("sku-highlight");
  $("i").removeClass("sku-highlight");
}

function highlightReceipts(receiptId) {
  $("li[data-tooltip="+receiptId+"]").addClass("sku-highlight");
  $("i[data-tooltip="+receiptId+"]").addClass("sku-highlight");
  $("#receipt-"+receiptId).parent().find("i").addClass("sku-highlight");
}

function addToAutocomplete(receiptId) {
  var item = '' +
  '  <li class="menu-item">' +
  '    <a class="noselect c-hand">' +
  '      <div class="tile tile-centered">' +
  '        <div class="tile-content">' +
            receiptId +
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

function updateDatabaseRequest(item, sender, receiver, priority, startPos) {
  var itemId = $(item).find('input[name=id]').val();
  var fromPrinterId = $(sender).find('input[name=printer_id]').val();
  var toPrinterId = $(receiver).find('input[name=printer_id]').val();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/queue/update', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        //update counts
        if (fromPrinterId != 'None') {
          var printer = $("#printer-"+fromPrinterId)[0];
          var oldValue = parseInt($(printer).attr('data-badge'));
          $(printer).attr('data-badge', oldValue-1);
        }
        if (toPrinterId != 'None') {
          var printer = $("#printer-"+toPrinterId)[0];
          var oldValue = parseInt($(printer).attr('data-badge'));
          $(printer).attr('data-badge', oldValue+1);
        }
      }
      else {
        //revert
        var next = $(sender).find("li:eq("+startPos+")");
        if (next.length == 0) {
          sender.appendChild(item);
        }
        else {
          $(sender).find("li:eq("+startPos+")").before(item);
        }
      }
    }
  }
  xhr.send('itemId='+itemId+"&fromPrinterId="+fromPrinterId+"&toPrinterId="+toPrinterId+"&priority="+priority+"&oldPriority="+startPos);
}

function updatePrinterStatusHelper(printerId, info) {
  var avatarPresence = $("#printer-"+printerId+" i");
  $(avatarPresence).removeClass("online");
  $(avatarPresence).removeClass("away");
  $(avatarPresence).removeClass("busy");
  $(avatarPresence).addClass(info["css_status"]);
  
  var printBtn = $("#print-btn-"+printerId);
  var progressBar = $("#progress-bar-"+printerId);
  
  $(printBtn).removeClass("btn-success");
  $(printBtn).removeClass("print-btn");
  $(printBtn).removeClass("btn-warning");
  $(printBtn).removeClass("btn-error");
  $(printBtn).removeClass("disabled");
  
  if (info["css_status"] == "online") {
    $(printBtn).addClass("btn-success");
    $(printBtn).addClass("print-btn");
    $(printBtn).text("Print Next");
    $(progressBar).hide();
  }
  else if (info["css_status"] == "away") {
    $(printBtn).addClass("disabled");
    $(printBtn).addClass("btn-warning");
    $(printBtn).text("Printer Busy");
    $(progressBar).find(".progress").val(info["progress"]);
    var currentSku = $(progressBar).find(".current-sku");
    $(currentSku).text(info["current_sku"]);
    $(currentSku).attr("data-tooltip", info["current_receipt"]);
    $(progressBar).find(".percent").text(info["progress"]+"%");
    $(progressBar).show();
  }
  else if (info["css_status"] == "busy") {
    $(printBtn).addClass("disabled");
    $(printBtn).addClass("btn-error");
    $(printBtn).text("Printer Not Available");
    $(progressBar).hide();
  }
}

function printNext(printerId) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/printer/'+printerId+'/print', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        $(".sortable input[name=printer_id][value="+printerId+"]").parent().find("li:eq(0)").remove();
        var newVal = parseInt($("#printer-"+printerId).attr("data-badge")) - 1;
        $("#printer-"+printerId).attr("data-badge", newVal);
        updatePrinterStatus(printerId);
      }
      else {
        alert('Error Printing\n'+this.responseText);
      }
    }
  }
  xhr.send();
}

function updateAllPrinterStatuses() {
  $(".sortable input[name=printer_id]").each(function () {
    var printerId = $(this).val();
    if (printerId != 'None') {
      updatePrinterStatus(printerId);
    }
  });
}

function updateReceipt(receiptId) {
  var newVal = parseInt($("#receipt-"+receiptId).attr("data-badge")) - 1;
  if (newVal > 0) {
    $("#receipt-"+receiptId).attr("data-badge", newVal);
  }
  else {
    var item = $("#receipt-"+receiptId).parent();
    $(item).remove();
    var newItem = '' +
    '  <div class="completed-item">' +
    '      <i class="noselect" style="font-family: Roboto">' + receiptId + '</i>' +
    '  </div>'
    '';
    $(newItem).appendTo("#completed-item-list");
    
  }
}

function addToUnassigned(receiptId, sku, queue_item_id) {
  var item = '' +
  '<li class="noselect tooltip ui-sortable-handle" data-tooltip="'+receiptId+'">' +
  sku +
  '  <input type="hidden" name="id" value="'+queue_item_id+'">' +
  '</li>' +
  '';
  $(item).appendTo("#unassigned-item-list");
  $(".sortable li").click(function () {
    var value = $(this).attr("data-tooltip");
    $("#receipt-search").val(value);
    removeHighlights();
    highlightReceipts(value);
  });
}

function updatePrinterStatus(printerId) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/printer/'+printerId+'/status', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        var responseJSON = JSON.parse(this.response);
        if (responseJSON['ui_change'] == '1') {
          location.reload();
        }
        else {
          updatePrinterStatusHelper(printerId, responseJSON);
        }
      }
    }
  }
  xhr.send();
}

function startLoad() {
  $("#load-btn").hide();
  $(".status-loader").show();
  updater = setInterval(updateAllPrinterStatuses, 500);
}

function stopLoad() {
  $("#load-btn").show();
  $(".status-loader").hide();
  clearInterval(updater);
}