// Write an error to the page
function error(message) {
  $('#errors').html(message + ' <input id="dismissError" type="button"'
      + 'value="Dismiss"></input>');
  $('#dismissError').click(function() {
    $('#errors').html('');
  });
}

function updateTableList() {
  var optList = '<option></option>';
  var tables = listTables();
  for (i = 0; i < tables.length; i++) {
    optList += '<option value=' + tables[i] + '>' + tables[i] + '</option>';
  }

  $('#changeTable').html(optList);
}

// Collect the data from the page into a single object
function collectTable() {
  var tableModel = {};

  $('#recordList input[type=text]').each(function() {
    var node = $(this);
    var name = node.attr('name');
    var value = node.val();

    tableModel[name] = value;
  });

  return tableModel;
}

// Write out an html representation of the given table to the DOM
function displayTable(tableModel) {
  var accum = '';
  for (key in tableModel) {
    accum += '<p name="' + key + '"><input id="' + key
      + 'X" type="button" value="X"></input> ' + key
      + ': <input type="text" name="' + key + '" value="' + tableModel[key]
      + '"></input></p>';
  }

  accum += '<input id="writeTable" type="button" value="Write table"></input>';

  $('#recordList').html(accum);
  $('#writeTable').click(function() {
    var tableName = $('#changeTable').val();
    var tableModel = collectTable();

    writeTable(tableName, tableModel);
  });

  for (key in tableModel) {
    $('#' + key + 'X').click(function() {
      var node = $(this);
      var key = node.parent().attr('name');

      deleteRecord(tableName, tableModel);
      node.parent().remove();
      displayTable(tableName);
    });
  }
}

function deleteEverything() {
  localStorage.clear();

  updateTableList();

  $('#recordList').empty();
}

$(function() {
  $('#createTable').click(function() {
    var newTableName = $('#newTableName').val();
    console.log(newTableName);
    createTable(newTableName);
    updateTableList();
  });

  $('#changeTable').change(function() {
    var tableName = $('#changeTable').val();
    var tableModel = readCopyTable(tableName);

    displayTable(tableModel);
  });

  $('#createRecord').click(function() {
    var tableName = $('#changeTable').val();
    var recordName = $('#newRecordName').val();

    createRecord(tableName, recordName, '');
    displayTable(readCopyTable(tableName));
  });

  $('#deleteTable').click(function() {
    var tableName = $('#changeTable').val();

    deleteTable(tableName);
    $('#changeTable option[value=' + tableName + ']').remove();
    $('#recordList').empty();
  });

  $('#clearLocalStorage').click(deleteEverything);

  updateTableList();
});
