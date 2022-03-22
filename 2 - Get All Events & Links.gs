/*
FINDS ALL EVENTS Y MEET LINKS ASSOCIATED
*/

const hojaLinksMeet = "2-GetMeetLinks"
var imprimirArray1 =[];
imprimirArray1.push([ "Usuario", "EventName", "Event ID", "Description","StartTime", "EndTime", "Meet Link"]);
//console.log(imprimirArray1);

function getAllEventsAndMeetLinks() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(hojaLinksMeet);
  var sheetFechaData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
  var primerLunesSerie = sheetFechaData.getRange('B11').getValue();
  var primerDomingoSerie = sheetFechaData.getRange('B12').getValue();
  
  // Cleaning sheet
  limpiandoMeetLinks();

  // var start = new Date('December 7, 2020'); // Manual Start date
  // var end = new Date('December 13, 2020'); // Manual End date
  var start = new Date(primerLunesSerie);
  var end = new Date(primerDomingoSerie);   
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lr = ss.getLastRow();
  var data = ss.getRange("a2:A" + lr).getValues();  
  data = data.filter(function (r) {return r [0] != ""});
  //console.log("Data no vacia in ColA: (see below))");
  //console.log(data);
  
  console.log("--------- Empieza el for loop debajo ---------");
  // Loopeando por los diferentes CalendarID / Usuarios en ColumnaA
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
       
        for(var i=0; i<num; i++){
          console.log(events[i])
          var event = events[i]
          var startTime = event.getStartTime();
          var eventName = event.getTitle();
          var descrip = event.getDescription();
          var endTime = event.getEndTime();
          var eventIdGrande = event.getId();

          // Source = https://stackoverflow.com/a/61061095/5319317
          var eventId = event.getId().split("@")[0];
          console.log(eventId);
            try {
                var hangoutLink = Calendar.Events.get(calendarId, eventId).hangoutLink;
                console.log ("Meet link: " + hangoutLink); 
              } 
              catch(e){
                console.log(e);
                var hangoutLink = "Error - No Link?"
              }
          var array = [calendarId, eventName, eventId, descrip, startTime, endTime, hangoutLink]
       //   console.log(array);
          imprimirArray1.push(array);
          
        }
        //console.log(imprimirArray1);
        // var sta = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
        var ss2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(hojaLinksMeet);
        ss2.getRange(2, 4, imprimirArray1.length, imprimirArray1[0].length).setValues(imprimirArray1);
     }
      else { console.log("No encontro el Calendario: "+calendarId); }
    }  

  // Accionamos la funcion para eliminar duplicados de EventIDs
   uniqueTwoDArrayParcial();
  }


function limpiandoMeetLinks() {
 const spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(hojaLinksMeet);
 spreadsheet.getRange('D3:J').clearContent();
 spreadsheet.getRange('A1').activate();
};


