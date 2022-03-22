// DELETES SPECIFIC CALENDAR EVENTS
const hojaBorrarEventos = '5-BorraEventos'

function borrarListadeEventos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lr = ss.getLastRow();
  var data = ss.getRange("A2:D" + lr).getValues();

  // Ventana preguntando si quieres correr el script
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('CUIDADO: BORRAR TODOS ESTOS EVENTOS ("SI" en colD?)', 
  ui.ButtonSet.YES_NO);
  // Process the user's response.
  if (response == ui.Button.YES) {
    Logger.log('The user clicked "Yes."');

        // Filtra la data que tiene el Checkbox = True
        data = data.filter(function (r) {return r [3] == "SI"});
        Logger.log(data);

        for (var i = 0;i<data.length;i++){
          
          try {
          var idEvento = data [i][2];
          var nombre = data[i][1];
          var owner = data[i][0];;
          Logger.log(idEvento);
          Logger.log(nombre);
          Logger.log(owner);

          var cal = CalendarApp.getCalendarById(owner);
          var event = cal.getEventSeriesById(idEvento);
          event.deleteEventSeries().sendInvites(true); 
          Logger.log(nombre+' :Eliminado');
          
          } catch (e) {
            Logger.log(e);
          }
          // Vuelve a actualizar lista de Eventos.
          
          
    }
      var response = ui.alert('Quieres GET MEET LINKS? (Elige SI, a menos que sea una prueba)', ui.ButtonSet.YES_NO);
        // Process the user's response.
        if (response == ui.Button.YES) {
            Logger.log('GETTING MEET LINKS');
          getAllEventsAndMeetLinks()
        }

    Logger.log('No seleccionaste GET MEET LINKS');
    limpiandoHojaBorrar();         // Desactivo mientras hago pruebas

  } else {
    Logger.log('NO BORRASTE NADA. Cancelaste correr el script');
  }
}


function borraManual(){
  var owner = 'meet.master.todas@liceobritanico.com';
  var idEvento = 'u2kgmnso01f7kropie4u0q7h8k'
  cal = CalendarApp.getCalendarById(owner);
          var event = cal.getEventSeriesById(idEvento);
          event.deleteEventSeries(); 
          Logger.log(idEvento+' :Eliminado');
          return;
}

function limpiandoHojaBorrar() {
 const spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(hojaBorrarEventos);
 spreadsheet.getRange('D3:D').clearContent();
 spreadsheet.getRange('A1').activate();
};

