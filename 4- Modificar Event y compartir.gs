// EDITS CALENDAR EVENTS
function ModificaEventComparte() {
var ss = SpreadsheetApp.openById(thisSsID).getActiveSheet();
var lr = ss.getLastRow();
var data = ss.getRange("A5:R" + lr).getValues();
columnaEscribir = 18   // Numero de Columan Array + 1 porque es spreadsheet

// Ventana preguntando si quieres correr el script
var ui = SpreadsheetApp.getUi();
var response = ui.alert('Quieres continuar con MODIFY EVENT SETTINGS?', 
ui.ButtonSet.YES_NO);
// Process the user's response.
 if (response == ui.Button.YES) {
   console.log('The user clicked "Yes."');

      // Filtra la data que tiene el Checkbox = True
      data = data.filter(function (r) {return r[16] == "Modificar" && r[17] != "Modificado"});
      //console.log(data);

      for (var i = 0;i<data.length;i++){
        var idEvento = data [i] [13];
        var owner = data[i] [10];
        var descripcionEvento = data[i][5];
        var invitadoUsuario = data[i][6];
        var invitadoGrupo = data[i][7];
        var filaEscribir = data[i][0];
       // console.log(idEvento)
        var calendarId = Calendar.Events.list(owner);

        var cal=CalendarApp.getCalendarById(owner);
        var guestsCanInviteOthers=false;
        var guestsCanSeeGuests=false;
        cal.getEventSeriesById(idEvento)
          .setGuestsCanInviteOthers(guestsCanInviteOthers)
          .setGuestsCanSeeGuests(guestsCanSeeGuests)
          .addGuest(invitadoGrupo)
          .setDescription(descripcionEvento)
        console.log(idEvento+' :Completado');

      // Print to Spreadsheet
        ss.getRange(filaEscribir, columnaEscribir).setValue("Modificado");
  }

 var response = ui.alert('Quieres GET MEET LINKS? (Elige SI, a menos que sea una prueba)', ui.ButtonSet.YES_NO);
    // Process the user's response.
    if (response == ui.Button.YES) {
        console.log('GETTING MEET LINKS');
      getAllEventsAndMeetLinks()
    }
console.log('No seleccionaste GET MEET LINKS');
}
else {console.log('Cancelaste correr el script');}
}


// function getAllLinks() {
//   var calendarId = 'meet.gclassroom.test@liceobritanico.com';
//   // var now = new Date();
//   var events = Calendar.Events.list(calendarId,)
//   console.log(events);
//  if (events.items && events.items.length > 0) {
//     for (var i = 0; i < events.items.length; i++) {
//       var event = events.items[i];
//       console.log('%s (%s)', event.iCalUID, event.hangoutLink);
//     }
//   } else {
//     console.log('No events found.');
//   }
//   // if (events.items && events.items.length > 0) {
//   //   for (var i = 0; i < events.items.length; i++) {
//   //     var event = events.items[i];
//   //     console.log('%s (%s)', event.summary, event.hangoutLink);
//   //   }
//   // } else {
//   //   console.log('No events found.');
//   // }
//   // iCalUID=nfa2sk576k8rbc4cdss36ekges@google.com
//   // conferenceData={entryPoints=[{uri=https://meet.google.com/oot-mxeb-whr, label=meet.google.com/oot-mxeb-whr, entryPointType=video}]
// }
