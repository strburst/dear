var tablePrefix = '__dear_';

function createTable(tableName) {
  if (!localStorage[tableName]) {
    localStorage[tablePrefix + tableName] = '{}';
  }
}

function readTable(tableName) {
  // Read tableModel from local storage
  return JSON.parse(localStorage[tablePrefix + tableName]);
}

function writeTable(tableName, tableModel) {
  // Write tableModel to local storage
  localStorage[tablePrefix + tableName] = JSON.stringify(tableModel);
}

function createRecord(tableName, recordName, value) {
  var tableModel = readTable(tableName);
  if (!tableModel[recordName]) {
    tableModel[recordName] = value;
  }

  writeTable(tableName, tableModel);
}

function writeRecord(tableName, recordName, value) {
  var tableModel = readTable(tableName);
  tableModel[recordName] = value;
  writeTable(tableName, tableModel);
}

function deleteRecord(tableName, recordName) {
  var tableModel = readTable(tableName);
  delete tableModel[recordName];
  writeTable(tableName, tableModel);
}

function deleteTable(tableName) {
  delete localStorage[tablePrefix + tableName];
}

function listTables() {
  return Object.keys(localStorage).filter(function(str) {
    return str.slice(0, tablePrefix.length) == tablePrefix;
  }).map(function(str) {
    return str.slice(tablePrefix.length);
  });
}
