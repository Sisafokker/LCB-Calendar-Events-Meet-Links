/*
ELIMINA DE UN 2D ARRAY Y SOLO DEJA VALORES UNICOS DE ALGUNAS COLUMNAS
VERIFICA UNA COINCIDENCIA EN CIERTAS COLUMNAS, NO EN TODAS
*/
function uniqueTwoDArrayParcial() {
  var hoja = "2-GetMeetLinks";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var editSheet = ss.getSheetByName(hoja);

// TODO EL ARRAY
  var allEventsFull = editSheet.getRange(2,4,editSheet.getLastRow(),7).getValues();
// ARRAY DE LO QUE QUIERO COMPARAR UNICAMENTE  
  var allEvents = editSheet.getRange(2,4,editSheet.getLastRow(),4).getValues();
  
  Logger.log(allEvents);
  Logger.log(allEvents.length)
    
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = allEvents.length; i < l; i++) {
        var stringified = JSON.stringify(allEvents[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(allEventsFull[i]); // EMPUJA LA FILA DEL ARRAY COMPLETO, NO EL PARCIAL
        itemsFound[stringified] = true;
    }
    Logger.log(uniques);
    Logger.log(uniques.length)
    Logger.log(uniques[0].length)

    limpiandoMeetLinks();
    editSheet.getRange(2, 4, uniques.length, uniques[0].length).setValues(uniques);
}

/*
// ELIMINA DE UN SIMPLE ARRAY Y SOLO DEJA VALORES UNICOS

// Array Original	[[c3oljhaj842blc5hhva0pd0fvg], [n466m019dgummtdt1m2v9u4o9o], [modgd1c2u7f2cuuoajnlk2vt9c], [c3oljhaj842blc5hhva0pd0fvg], [n466m019dgummtdt1m2v9u4o9o], [modgd1c2u7f2cuuoajnlk2vt9c], [], [], [], [], [], [], [], [], [], [], [], []]

// Array Resultado: [[c3oljhaj842blc5hhva0pd0fvg], [n466m019dgummtdt1m2v9u4o9o], [modgd1c2u7f2cuuoajnlk2vt9c]]
// */
// function uniqueOneDArray() {
//   var hoja = "2-GetMeetLinks";
//   var ss = SpreadsheetApp.getActiveSpreadsheet();
//   var editSheet = ss.getSheetByName(hoja);

//   var allEvents = editSheet.getRange(3,4,editSheet.getLastRow(),7).getValues();
//   var referenceIds = editSheet.getRange(3,6,editSheet.getLastRow(),1).getValues()
//   var referenceIdsFlat = editSheet.getRange(3,6,editSheet.getLastRow(),1).getValues().flat();
//   Logger.log(allEvents);
//   Logger.log(referenceIds);
//   Logger.log(referenceIds.length);
//   Logger.log(referenceIdsFlat);

// var a = [];
// a.push(referenceIds[0]);
// for (var n = 1; n < referenceIds.length; n++) {
//     if (a.join().indexOf(referenceIds[n].join()) == -1) {
//         a.push(referenceIds[n])
//     };
// }
// Logger.log("--------------------------");
// Logger.log(a.length);
// Logger.log(a);
// //ss.getSheetByName("test2").getRange(2, 1, a.length, a[0].length).setValues(a);
// }

// /*
// ELIMINA DE UN 2D ARRAY Y SOLO DEJA VALORES UNICOS
// VERIFICA UNA COINCIDENCIA EN TODAS LAS COLUMNAS DEL ARRAY
// */
// function uniqueTwoDArray() {
//   var hoja = "2-GetMeetLinks";
//   var ss = SpreadsheetApp.getActiveSpreadsheet();
//   var editSheet = ss.getSheetByName(hoja);

//   var allEvents = editSheet.getRange(2,4,editSheet.getLastRow(),4).getValues();
//   Logger.log(allEvents);
//   Logger.log(allEvents.length)
    
//     var uniques = [];
//     var itemsFound = {};
//     for(var i = 0, l = allEvents.length; i < l; i++) {
//         var stringified = JSON.stringify(allEvents[i]);
//         if(itemsFound[stringified]) { continue; }
//         uniques.push(allEvents[i]);
//         itemsFound[stringified] = true;
//     }
//     Logger.log(uniques);
//     Logger.log(uniques.length)
//     Logger.log(uniques[0].length)
// }

