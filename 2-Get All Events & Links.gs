//FINDS ALL EVENTS Y MEET LINKS ASSOCIATED

var imprimirArray1 =[];
imprimirArray1.push([ "Usuario", "EventName", "Event ID", "Description","StartTime", "EndTime", "Meet Link"]);
//console.log(imprimirArray1);

function getAllEventsAndMeetLinks() {
  var tiempoInicio = startingFX();

  var ss = SpreadsheetApp.openById(thisSsID).getSheetByName(hojaLinksMeet);
  var sheetFechaData = SpreadsheetApp.openById(thisSsID).getSheetByName("DATA");
  var primerLunesSerie = sheetFechaData.getRange('B3').getValue();
  var primerDomingoSerie = sheetFechaData.getRange('B4').getValue();

  var start = new Date(primerLunesSerie);
  var end = new Date(primerDomingoSerie);   

  var data = ss.getRange("A3:A20").getValues();  
  data = data.filter(function (r) {return r [0] != ""});
  console.log("Calendarios a analizar:",data);
  
  console.log("--------- Empieza el for loop debajo ---------");
  // Loopeando por los diferentes CalendarID / Usuarios en ColumnaA
  for (var k = 0; k<data.length; k++){
    console.log("START NEW CAL")
   // console.log({imprimirArray1});  
        var calendarId = data[k];
        console.log("Calendario a analizar:",calendarId);
        var cal = CalendarApp.getCalendarById(calendarId); 
    
      //GETS calendars... Da error si Events is blank...
     if (cal) {
        var events = cal.getEvents(start, end);
        console.log("Cantidad de eventos: %s [%s]",events.length,calendarId);
        var num = events.length;
       
        for(var i=0; i<num; i++){
          //console.log(events[i])
          var event = events[i]
          var startTime = event.getStartTime();
          var eventName = event.getTitle();
          var descrip = event.getDescription();
          var endTime = event.getEndTime();
          var eventIdGrande = event.getId();
          var hangoutLink;

          // Source = https://stackoverflow.com/a/61061095/5319317
          var eventId = event.getId().split("@")[0];
          //console.log(eventId);
            
            // Depricated 2022 - No need to search for hangoutLink / Meet Link anymore
            // try {
            //     hangoutLink = Calendar.Events.get(calendarId, eventId).hangoutLink;
            //  //   console.log ("Meet link: " + hangoutLink); 
            //   } 
            //   catch(e){
            //     console.log("No MeetLink?",e);
            //     hangoutLink = "Error - No Link?"
            //   }

          var array = [calendarId, eventName, eventId, descrip, startTime, endTime, hangoutLink]
       //   console.log(array);
          imprimirArray1.push(array);
          
        }
        //console.log(imprimirArray1);
        // var sta = SpreadsheetApp.openById(thisSsID).getSheetByName("DATA");
        // console.log("PRINTING")
        // var ss2 = SpreadsheetApp.openById(thisSsID).getSheetByName(hojaLinksMeet);
        // ss2.getRange(2, 4, imprimirArray1.length, imprimirArray1[0].length).setValues(imprimirArray1);
     }
      else { console.error("No encontro el Calendario: "+calendarId); }
    }
  

  console.log("PRINTING")
  console.log({imprimirArray1});  
  if (imprimirArray1 && imprimirArray1.length > 1) {
    limpiandoMeetLinks(); // Cleaning sheet
    ss.getRange(2, 4, imprimirArray1.length, imprimirArray1[0].length).setValues(imprimirArray1);
  }
  
  // Accionamos la funcion para eliminar duplicados de EventIDs
  console.log("REMOVING DUPLICATES Fx")
  let arraySinDuplicados =  uniqueTwoDArrayParcial();
  
  // Copiamos Event Name y Event ID a la BaseDatosPpal
  copyToBaseDatosPPal(arraySinDuplicados);
  
  SpreadsheetApp.flush()
  var duracion = totalDuration(tiempoInicio);

  }


function limpiandoMeetLinks() {
 const spreadsheet = SpreadsheetApp.openById(thisSsID).getSheetByName(hojaLinksMeet);
 spreadsheet.getRange('D3:J').clearContent();
 spreadsheet.getRange('A1').activate();
};


function copyToBaseDatosPPal(arr){
  arr.shift();
  let arrForDB = [];
  arr.forEach(item => {
    let name = item[1];
    let eventId = item[2];
    arrForDB.push([name, "", eventId])
  })

  if (arrForDB && arrForDB.length > 1) {
    sheetBaseDatos.getRange(4,1, arrForDB.length, arrForDB[0].length).setValues(arrForDB);
    sheetBaseDatos.getRange("A1").setValue("LastRun: "+localTime());
    console.log("👍 Actualizo Base de Datos PPal")
  } else{
    console.error("🚩🚩 NO Actualizo Base de Datos PPal 🚩🚩 ")
  }
}
