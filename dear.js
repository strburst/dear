var tableModel = {};

function error(message) {
  $('#errors').html(message + ' <input id="dismissError" type="button"'
      + 'value="Dismiss"></input>');
  $('#dismissError').click(function() {
    $('#errors').html('');
  });
}

function createTable() {
  var newTableName = $('#newTableName').val();
  if (localStorage[newTableName]) {
    error('Can\'t create new table "' + newTableName + '": already exists');
    return;
  }

  localStorage[newTableName] = '{}';

  updateTableList();
}

function updateTableList() {
  var optList = '<option></option>';
  for (key in localStorage) {
    optList += '<option value=' + key + '>' + key + '</option>';
  }

  $('#changeTable').html(optList);
}

function readTable() {
  var tableName = $('#changeTable').val();

  // Read tableModel from local storage
  tableModel = JSON.parse(localStorage[tableName]);
}

function writeTable() {
  var tableName = $('#changeTable').val();

  // Update tableModel with the data currently on the page
  $('#workspace input[type=text]').each(function() {
    var node = $(this);
    var name = node.attr('name');
    var value = node.val();

    tableModel[name] = value;
  });

  // Write tableModel to local storage
  localStorage[tableName] = JSON.stringify(tableModel);
}

// Write out an html representation of the given table to the DOM
function displayTable() {
  readTable();

  var accum = '';
  for (key in tableModel) {
    accum += '<p name="' + key + '"><input id="' + key
      + 'X" type="button" value="X"></input> ' + key
      + ': <input type="text" name="' + key + '" value="' + tableModel[key]
      + '"></input></p>';
  }

  accum += '<input id="writeTable" type="button" value="Write table"></input>';

  $('#workspace').html(accum);
  $('#writeTable').click(writeTable);

  for (key in tableModel) {
    $('#' + key + 'X').click(function() {
      var node = $(this);
      var key = node.parent().attr('name');

      delete tableModel[key];
      node.parent().remove();
      writeTable();
    });
  }
}

function createRecord() {
  var tableName = $('#changeTable').val();
  var recordName = $('#newRecordName').val();

  tableModel[recordName] = '';
  writeTable();
  displayTable();
}

function deleteTable() {
  var tableName = $('#changeTable').val();

  delete localStorage[tableName];
  $('#changeTable option[value=' + tableName + ']').remove();
}

$(function() {
  $('#createTable').click(createTable);
  $('#changeTable').change(displayTable);
  $('#createRecord').click(createRecord);
  $('#deleteTable').click(deleteTable);

  updateTableList();
});
