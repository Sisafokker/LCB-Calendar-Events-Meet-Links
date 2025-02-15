function removerInvitados() {
var ss = SpreadsheetApp.openById(thisSsID).getActiveSheet();
var lr = ss.getLastRow();
var data = ss.getRange("A5:R" + lr).getValues();
columnaEscribir = 18   // Numero de Columan Array + 1 porque es spreadsheet

// Ventana preguntando si quieres correr el script
var ui = SpreadsheetApp.getUi();
var response = ui.alert('Quieres continuar con SOLO REMOVER INVITADOS?', 
ui.ButtonSet.YES_NO);
// Process the user's response.
 if (response == ui.Button.YES) {
   Logger.log('The user clicked "Yes."');

      // Filtra la data que tiene el Checkbox = True
      data = data.filter(function (r) {return r[16] == "Remover" && r[17] != "Removido"});
      Logger.log(data);

  
      for (var i = 0;i<data.length;i++){
  
       try {
        var idEvento = data [i] [13];
        var owner = data[i] [10];
        var invitadoUsuario = data[i][6];
        var invitadoGrupo = data[i][7];
        var filaEscribir = data[i][0];
        Logger.log(idEvento)
        var calendarId = Calendar.Events.list(owner);

        var cal=CalendarApp.getCalendarById(owner);
        var guestsCanInviteOthers=false;
        var guestsCanSeeGuests=false;
        cal.getEventSeriesById(idEvento)
          .setGuestsCanInviteOthers(guestsCanInviteOthers)
          .setGuestsCanSeeGuests(guestsCanSeeGuests)
          .removeGuest(invitadoGrupo)
          .removeGuest(invitadoUsuario)
      Logger.log(idEvento+' :Completado');

        ss.getRange(filaEscribir, columnaEscribir).setValue("Removido");
       } catch (e){
        Logger.log(e); 
        ss.getRange(filaEscribir, columnaEscribir).setValue("Error: "+e);
       }
  }

 var response = ui.alert('Quieres GET MEET LINKS? (Elige SI, a menos que sea una prueba)', ui.ButtonSet.YES_NO);
    // Process the user's response.
    if (response == ui.Button.YES) {
        Logger.log('GETTING MEET LINKS');
      getAllEventsAndMeetLinks()
    }

Logger.log('No seleccionaste GET MEET LINKS');
}
else {
   Logger.log('Cancelaste correr el script');
 }
  
}