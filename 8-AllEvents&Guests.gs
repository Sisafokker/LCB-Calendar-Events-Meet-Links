
const hojaAllEvents = "8-AllEvens&Guests"
var imprimirArray =[];
imprimirArray.push([ "Usuario", "EventName", "Event ID", "Description","StartTime", "EndTime", "Meet Link", 'Evento Recurrente', "Grupo Invitado"]);
//console.log(imprimirArray);

function getAllEventsAndMeetLinksAndGuests() {
  limpiandoMeetLinksAndGuests();
  var ss = SpreadsheetApp.openById(thisSsID).getSheetByName(hojaAllEvents);
  var sheetFechaData = SpreadsheetApp.openById(thisSsID).getSheetByName("DATA");
  const primerLunesSerie = sheetFechaData.getRange('B11').getValue();
  const primerDomingoSerie = sheetFechaData.getRange('B12').getValue();  
  const start = new Date(primerLunesSerie);
  const end = new Date(primerDomingoSerie);   

  var ss = SpreadsheetApp.openById(thisSsID).getActiveSheet();
  var lr = ss.getLastRow();
  var data = ss.getRange("a2:A" + lr).getValues();  
  // Filtra la data en A, solo las celdas no vacias.
  data = data.filter(function (r) {return r [0] != ""});
  // console.log("Data no vacia in ColA: (see below))");
  // console.log(data);
  
  console.log("--------- Empieza el for loop debajo ---------");
  // Loopeando por los diferentes CalendarID / USuarios en ColumnaA
  for (var k = 0; k<data.length; k++){  
        var calendarId = data[k];
        // console.log("Buscando en el Calendar del siguiente usuario:");
        // console.log(calendarId);  
        var cal = CalendarApp.getCalendarById(calendarId); 
    
     //GETS calendars... Da error si Events is blank...
     if (cal) {
        var events = cal.getEvents(start, end);
        console.log(events.length);
        var num = events.length; 
        var invitadosArray = [];
          for(var i=0; i<num; i++){
            console.log(events[i])
            var event = events[i]
            var startTime = event.getStartTime();
            var eventName = event.getTitle();
            var descrip = event.getDescription();
            var endTime = event.getEndTime();
            var eventIdGrande = event.getId();
            var detalles;
            var grupoInvitado;          
            var guestList = event.getGuestList(); 
        
              for(d=0; guestList !=null && d < guestList.length; d++) {
                detalles = event.isRecurringEvent();  
                console.log(detalles)
                grupoInvitado = guestList[d].getEmail()       
                console.log(grupoInvitado)
            }

          // Source = https://stackoverflow.com/a/61061095/5319317
          var eventId = event.getId().split("@")[0];
          console.log(eventId);
            try {
                var hangoutLink = Calendar.Events.get(calendarId, eventId).hangoutLink;
                console.log ("Meet link: " + hangoutLink); 
                if(!hangoutLink){ hangoutLink = "Evento sin Meet Link [2022 ok]";}
              } 
              catch(e){
                console.log(e);
                var hangoutLink = "Error - No Link?"
              }
          var array = [calendarId, eventName, eventId, descrip, startTime, endTime, hangoutLink, detalles, grupoInvitado]
          //console.log(array);
          imprimirArray.push(array);
          
        }
        console.log(imprimirArray);
        var ss2 = SpreadsheetApp.openById(thisSsID).getSheetByName(hojaAllEvents);
        ss2.getRange(2, 4, imprimirArray.length, imprimirArray[0].length).setValues(imprimirArray);
     }
      else { console.log("No encontro el Calendario: "+calendarId); }
   }  
  }
 
function limpiandoMeetLinksAndGuests() {
 const spreadsheet = SpreadsheetApp.openById(thisSsID).getSheetByName(hojaAllEvents);
 spreadsheet.getRange('D3:L').clearContent();
 spreadsheet.getRange('A1').activate();
};
