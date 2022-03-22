
/* 
Invita al UN usuario para poder generar el Meet Link automaticamente (El Admin del Dominio debe configurar que todo evento
 lleven un Meet Link )

[ojo] El EVENT ID los escribe siempre, independientemente de en que fila
 esta el primer "SI" Estoy puede generar conflicto con fila O 
que es la fila que define si se crea o si ya fue creado
*/ 


// Source DEAL WITH TIMES IN SPREASHEETS TO JAVESCRIPT CAN READ THEM
// https://stackoverflow.com/questions/23508261/concatenate-date-and-time-in-google-spreadsheet
// Just A1 + B1 into C1... THAT FUCKING SIMPLE...


/*

function AddEventSeries() {

var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
var lr = ss.getLastRow();
var data = ss.getRange("a2:O" + lr).getValues(); ///// Si agrego columnas, agregar aca tambien el rango

// Busca la ultima fecha de la serie anual de eventos. Poner siempre ultimo viernes pre navidad. 
// Busca info en hoja DATA
var sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
var fechaFinSerie = sheetData.getRange('B2').getValue();

// Columan en la que se va a escribir el resultado con el EVENTID
var columnaEscribir = 13

var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
var lr = ss.getLastRow();
var data = ss.getRange("a2:O" + lr).getValues(); ///// Si agrego columnas, agregar aca tambien el rango

// Ventana preguntando si quieres correr el script
var ui = SpreadsheetApp.getUi();
var response = ui.alert('Quieres continuar con la creacion de estos eventos? Configuraste la Fecha de Inicio (Marzo) y Fecha de Fin (Diciembre)?', 
ui.ButtonSet.YES_NO);
 // Process the user's response.
 if (response == ui.Button.YES) {
   ui.alert("Series fecha fin: "+fechaFinSerie+"-", ui.ButtonSet.OK)
   Logger.log('The user clicked "Yes."');

      // Filtra la data que tiene el Checkbox = True
      // data = data.filter(function (r) {return r [14] == true});

      // Filtra la data que tiene la columna con "OK"
      data = data.filter(function (r) {return r [14] == "OK"});
     Logger.log(data);
     Logger.log("--Se van a crear:  #"+data.length+"  series de eventos!")      

      // For Loop
      Logger.log("Arranca el For Loop");
      for (var i = 0; i<data.length; i++){
      
            var weekDays = data[i][7];  // Dias de la semana que se repite
             Logger.log("var i = "+i);   // var i = 0
             // Logger.log(weekDays);     // MONDAY, WEDNESDAY
            var days = weekDays.split(', ').map(function(x) { return CalendarApp.Weekday[x]; });
             // Logger.log(days);  // [MONDAY, WEDNESDAY]

            var nombreEvento = data[i][0];
            var descripcionEvento = data[i] [4];
            var invitadoUsuario = data[i] [5];
            var invitadoGrupo = data[i] [6];
            var owner = data[i] [9];
            var date1 = data[i] [10]; // Fecha del 1er evento en la serie + hora de INICIO
            var date2 = data[i] [11]; // Fecha del 1er evento en la serie + hora de FIN      

            Logger.log (nombreEvento);  // TestLCB LUMI.1830a20.PRES (Central) [22]
            // Logger.log ("Date1: "+date1);
            // Logger.log ("Date2: "+date2);
            Logger.log ("OWNER: "+owner);  // OWNER: meet.gclassroom.central@liceobritanico.com
            
        try {
            Logger.log("START Inicio de creacion del evento")
              // Source: https://stackoverflow.com/questions/58934928/selecting-the-day-for-a-recurring-event-in-calendarapp-on-a-spreadsheet

            var cal = CalendarApp.getCalendarById(owner)
            var guestsCanInviteOthers = false;
            var guestsCanSeeGuests = false;
            var evento = cal.createEventSeries(nombreEvento, date1, date2, 
                                       CalendarApp.newRecurrence().addWeeklyRule()
                                       .onlyOnWeekdays(days)
                                       .until(new Date(fechaFinSerie)), {description: descripcionEvento, guests: invitadoGrupo}); // Con Descripcion y Con Invitado Grupo

            // .until(new Date(fechaFinSerie)), {guests: invitadoUsuario});   //////////// Lo que use en 2021

            //  .until(new Date(fechaFinSerie)), {guests: invitadoUsuario, guests: invitadoGrupo});   //////////// SIN DESCRIPCION
            // .until(new Date(fechaFinSerie)), {description: descripcionEvento, guests: invitadoUsuario});   //////////// CON DESCRIPCION
            // .until(new Date("May 23,2021")), {description: descripcionEvento, guests: invitadoUsuario});   //////////// Viejo: Defino fecha fin manualmente.
            //.onlyOnWeekdays([CalendarApp.Weekday.MONDAY, CalendarApp.Weekday.WEDNESDAY]) ///// Viejo: defino manualmente los dias que se repite.
            // ss.getRange(i+2, columnaEscribir).setValue(evento.getId());  // eventId completo, incluye el @google.com.
         
           // Logger.log("ID: "+evento.getOriginalCalendarId);

Logger.log("START Parte Nueva 2022")

            var eventoIDconGoogle = evento.getId();
            Logger.log("Event ID con @google: " +eventoIDconGoogle); 
            var idEvento = evento.getId().split("@")[0];
            Logger.log("Event ID: " +idEvento); 

                cal.getEventSeriesById(idEvento).setGuestsCanInviteOthers(guestsCanInviteOthers).setGuestsCanSeeGuests(guestsCanSeeGuests);
            
            Logger.log(nombreEvento +"  "+ idEvento+' :Completado');

Logger.log("END Parte Nueva 2022")


            //Logger.log("Event Series ID: "+evento.getId() );
            Logger.log("Se creo para i ="+i);


      // ACTIVAR DURANTE PRUEBAS  -  DESACTIVAR DURANTE IMPLEMENTACION MASIVA
      // ss.getRange(i+2, columnaEscribir).setValue(evento.getId().split("@")[0]);  // ACTIVO MIENTRAS HAGO PRUEBAS - Funciona, pero ya no quiero 

     Logger.log("FIN Intento creacion del evento")
        } 
        catch (e) {
          if (e = "TypeError: Cannot read property 'createEventSeries' of null") {
              Logger.log(e);
              ui.alert("ERROR: Solo se puede correr desde MEET.MASTER.TODAS@", ui.ButtonSet.OK)
                        }
          Logger.log("Hubo algun tipo de error");                        
                      }

  } 
  Logger.log("Fin del For Loop ");

var response = ui.alert('Quieres GET MEET LINKS? (Elige SI, a menos que sea una prueba)', ui.ButtonSet.YES_NO);
    // Process the user's response.
    if (response == ui.Button.YES) {
        Logger.log('GETTING MEET LINKS');
      getAllEventsAndMeetLinks()
    }

Logger.log('No seleccionaste GET MEET LINKS');

} else {
   Logger.log('Cancelaste correr el script');
 }
  
}



function formatoFecha (fecha){
  var nowTime = new Date(fecha);
  Logger.log(nowTime);
  // var timeFormateado = Utilities.formatDate(nowTime, 'America/Argentina/Buenos_Aires', 'MM/dd/yyyy\'T\'HH:mm:ss');
  // var timeFormateado = Utilities.formatDate(nowTime, 'America/Argentina/Buenos_Aires', 'MM/dd/yyyy HH:mm:ss');
  // var timeFormateado = Utilities.formatDate(nowTime, 'America/Argentina/Buenos_Aires', 'MMMM dd, yyyy HH:mm:ss');
  var timeFormateado = Utilities.formatDate(nowTime, 'America/Argentina/Buenos_Aires', 'MMMM dd, yyyy HH:mm:ss');
  //Logger.log("Convertido a: "+ timeFormateado);
  return timeFormateado
  
};

*/