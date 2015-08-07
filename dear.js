var tablePrefix = '__dear_';

function createTable(tableName) {
  if (!localStorage[tableName]) {
    localStorage[tablePrefix + tableName] = '{}';
  }

  return Object.create(null);
}

function readCopyTable(tableName) {
  return JSON.parse(localStorage[tablePrefix + tableName]);
}

function readAutoTable(tableName) {
  var model = JSON.parse(localStorage[tablePrefix + tableName]);

  var result = Object.create(null);;

  function registerGetterSetter(obj, key, value) {
    // Define a copy to refer to
    Object.defineProperty(obj, tablePrefix + key, {
      enumerable: false,
      value: value,
      writable: true
    });

    // Define the getter/setter the user uses
    Object.defineProperty(obj, key, {
      enumerable: true,
      get: function() {
        return this[tablePrefix + key];
      },
      set: function(x) {
        this[tablePrefix + key] = x;
        writeTable(tableName, this);
      }
    });
  }

  for (var key in model) {
    registerGetterSetter(result, key, model[key]);
  }

  return result;
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
