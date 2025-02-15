
function AddEventSeries_TIME() {
  var nombreFx = "AddEventSeries_TIME";
  console.warn({ modo });
  deletingDisabledTriggers(); 
  
  var tiempoInicio = startingFX();
  const mihojaEventos = "1-Crear Eventos en Series";
  let primeraFila = 6;
  let colCrear = 14;
  let colResultado = 15;
  let col2Print = 16;
  let arrayResultado = [];
  let cellForStatus = "A2"
  let statusProceso = "🏃‍♀️ Running... " + localTime();
  let triggerSet = false;
  
  let cantidadAProcesar = 135; //👍 150 Verified 👍 // 👈👈👈👈👈 Cuantas acciones queres procesar? No deben superar los 6 Minutos 👈👈👈👈👈
  if (modo != "full") {
    cantidadAProcesar = 5; // Modo NO Full procesamos pocos para probar.
  }

  // RANGO DE FECHA PARA LAS SERIES - SACADAS DE DATA
  //var sheetData = SpreadsheetApp.openById(thisSsID).getSheetByName("DATA");
  var fechaFinSerie = sheetData.getRange('B2').getValue();
  var fechaInicio = sheetData.getRange('B3').getValue();

  // PROCESA LA INFO PARA CREACION DE EVENTOS
  var ss = SpreadsheetApp.openById(thisSsID).getSheetByName(mihojaEventos);
  ss.getRange(cellForStatus).setValue(statusProceso);
  SpreadsheetApp.flush();
  
  var lr = ss.getLastRow();
  var data = ss.getRange("A6:P").getValues();

  // # DE EVENTOS YA CREADOS
  var dataProcesada = data.filter(r => r[0] != "" && r[colCrear] == "OK" && r[colResultado] != "" );
  var filasCompletas = dataProcesada.length;
  console.warn("# filasCompletas (ColP NO Vacias): ", filasCompletas);

  // # DE EVENTOS PENDIENTES
  var dataPendiente = data.filter(r => r[0] != "" && r[colCrear] == "OK" && r[colResultado] == "" );
  var filasPorProcesar = dataPendiente.length;
  console.warn("# filasPorProcesar (ColP Vacias): "+filasPorProcesar);
  console.log(dataPendiente[0])
  
  // Filter data
  data = data.filter(function (r) { return r[colCrear] == "OK" && r[colResultado] == "" });
  if (data && data.length ) {
  console.warn("--Se van a crear:  #", data.length, "series de eventos!");
  console.log("==================================================================");
  } else {
    console.error("❌ No hay filas para procesar");
    return;
  }

  // Defino Columna y Fila en la que se va a escribir el resultado
  var row2Print = filasCompletas + primeraFila;  // ultima fila de la columan O que tiene informacion
  console.warn("Se imprimiran los resultados en la fila: "+ row2Print);

  // For Loop
  console.log("Arranca el For Loop");
  for (var i = 0; i < filasPorProcesar; i++) {
    var filasProcesadas = i + 1
    console.log('filasProcesadas: ',filasProcesadas)

    var weekDays = data[i][7];  // Dias de la semana que se repite
    // console.log("var i = " + i);   // var i = 0
    // console.log(weekDays);     // MONDAY, WEDNESDAY
    var days = weekDays.split(', ').map(function (x) { return CalendarApp.Weekday[x]; });
    // console.log(days);  // [MONDAY, WEDNESDAY]

    var nombreEvento = data[i][0];
    var descripcionEvento = data[i][4];
    var invitadoUsuario = data[i][5];
    var invitadoGrupo = data[i][6];
    var owner = data[i][9];
    var date1 = data[i][10]; // Fecha del 1er evento en la serie + hora de INICIO
    var date2 = data[i][11]; // Fecha del 1er evento en la serie + hora de FIN      

    // console.log(nombreEvento + " con Owner " + owner);

    try {
      // console.log("START Inicio de creacion del evento")
      // Source: https://stackoverflow.com/questions/58934928/selecting-the-day-for-a-recurring-event-in-calendarapp-on-a-spreadsheet

      if (filasProcesadas <= cantidadAProcesar) {
        //console.log("No se llego al limite => Avanzamos...")
        var cal = CalendarApp.getCalendarById(owner)
        var guestsCanInviteOthers = false;
        var guestsCanSeeGuests = false;
        let evento;
        
        // SE CREA EL EVENTO, EN BASE AL MODO EN EL QUE ESTEMOS.
        if (modo == "sinGrupo") {
          evento = cal.createEventSeries(nombreEvento, date1, date2,
          CalendarApp.newRecurrence().addWeeklyRule()
            .onlyOnWeekdays(days)
            .until(new Date(fechaFinSerie)), { description: descripcionEvento});
        } else {
          if (modo == "grupoPrueba") {invitadoGrupo = "gr.NoBorrar.test@liceobritanico.com";}
          evento = cal.createEventSeries(nombreEvento, date1, date2,
          CalendarApp.newRecurrence().addWeeklyRule()
            .onlyOnWeekdays(days)
            .until(new Date(fechaFinSerie)), { description: descripcionEvento, guests: invitadoGrupo, sendInvites: false });
        }
        var eventoIDconGoogle = evento.getId();
        var idEvento = evento.getId().split("@")[0];
        //console.log("Event ID con @google: " + eventoIDconGoogle);
        //console.log("Event ID: " + idEvento);

        // CONFIGURACION DE LOS PERMISOS DEL EVENTOS.
        cal.getEventSeriesById(idEvento).setGuestsCanInviteOthers(guestsCanInviteOthers).setGuestsCanSeeGuests(guestsCanSeeGuests);

        console.log(`${owner} | ${nombreEvento} | ${idEvento} | 👍`);
        //console.log("Se creo para i =" + i);
        arrayResultado.push([`👍-${nombreEvento}`]);

      } // fin del IF    
      else {
        console.log("Se llego al limite de %s eventos creados => Finalizamos y creamos Temp Trigger", cantidadAProcesar)
        setUpTemporaryTrigger(nombreFx);
        triggerSet = true;
        break
      }

      //console.log("FIN Intento creacion del evento")
    } catch (e) {
      if (e.toString().includes("Cannot read property 'createEventSeries' of null")) {
        console.log("Error: sin propiedades "+e);
        //  ui.alert("ERROR: Solo se puede correr desde MEET.MASTER.TODAS@", ui.ButtonSet.OK)
      }
      console.error("Hubo error ",e);
      arrayResultado.push(["Error"])
    }
  }

  var duracion = totalDuration(tiempoInicio)

  if (triggerSet) {
    statusProceso = "⌚ Trigger Set on " + localTime();
  } else {
    statusProceso = "👍 Ended: " + localTime();
  }
  ss.getRange(cellForStatus).setValue(statusProceso + " ⌛" + totalDuration(tiempoInicio));

  if (arrayResultado && arrayResultado.length){
    ss.getRange(row2Print, col2Print, arrayResultado.length, 1).setValues(arrayResultado)
  } else {
    console.error("No Data to be printed")
  }

}












//////////////////////////////////////////////////////////////////////////////////////////////
// CREATES CALENDAR EVENTS. VIEJA, sin TIMER.
//////////////////////////////////////////////////////////////////////////////////////////////

function AddEventSeries_() {
  console.warn({ modo });
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lr = ss.getLastRow();
  var data = ss.getRange("a2:O" + lr).getValues();

  // Busca la ultima fecha de la serie anual de eventos. 🟥 Poner siempre ultimo viernes pre navidad. 
  //const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
  const fechaFinSerie = sheetData.getRange('B2').getValue();

  // Columan en la que se va a escribir el resultado con el EVENTID
  const columnaEscribir = 13

  // Ventana preguntando si quieres correr el script
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(`Quieres continuar con la creacion de estos eventos? 
        Configuraste la Fecha de Inicio (Marzo) 
        y Fecha de Fin (Diciembre)?`, ui.ButtonSet.YES_NO);
  // Process the user's response.
  if (response == ui.Button.YES) {
    ui.alert("Series fecha fin: " + fechaFinSerie + "-", ui.ButtonSet.OK)
    console.log('The user clicked "Yes."');

    // Filtra la data que tiene la columna con "OK"
    data = data.filter(function (r) { return r[14] == "OK" });
    console.log(data);
    console.log("Se van a crear:  #", data.length, " series de eventos!")

    // Loop Starts
    console.log("Arranca el For Loop");
    for (var i = 0; i < data.length; i++) {
      var weekDays = data[i][7];  // Dias de la semana que se repite
      // console.log("var i = "+i);   // var i = 0
      // console.log(weekDays);     // MONDAY, WEDNESDAY
      var days = weekDays.split(', ').map(function (x) { return CalendarApp.Weekday[x]; });
      // console.log(days);  // [MONDAY, WEDNESDAY]

      var nombreEvento = data[i][0];
      var descripcionEvento = data[i][4];
      var invitadoUsuario = data[i][5];
      var invitadoGrupo = data[i][6];
      var owner = data[i][9];
      var date1 = data[i][10]; // Fecha del 1er evento en la serie + hora de INICIO
      var date2 = data[i][11]; // Fecha del 1er evento en la serie + hora de FIN      

      console.log(nombreEvento);  // Ejemplo: TestLCB LUMI.1830a20.PRES (Central) [22]
      // console.log ("Date1: "+date1);
      // console.log ("Date2: "+date2);
      console.log("OWNER: " + owner);  // OWNER: meet.gclassroom.central@liceobritanico.com

      try {
        console.log("START Inicio de creacion del evento")
        // Source: https://stackoverflow.com/questions/58934928/selecting-the-day-for-a-recurring-event-in-calendarapp-on-a-spreadsheet

        var cal = CalendarApp.getCalendarById(owner)
        var guestsCanInviteOthers = false;
        var guestsCanSeeGuests = false;
        let evento;
        if (modo == "sinGrupo") {
          evento = cal.createEventSeries(nombreEvento, date1, date2,
            CalendarApp.newRecurrence().addWeeklyRule()
              .onlyOnWeekdays(days)
              .until(new Date(fechaFinSerie)), { description: descripcionEvento });
        } else {
          evento = cal.createEventSeries(nombreEvento, date1, date2,
            CalendarApp.newRecurrence().addWeeklyRule()
              .onlyOnWeekdays(days)
              .until(new Date(fechaFinSerie)), { description: descripcionEvento, guests: invitadoGrupo, sendInvites: false });
        }
        // Con Descripcion y Con Invitado Grupo y SIN notificaciones.

        // .until(new Date(fechaFinSerie)), {guests: invitadoUsuario});   //////////// Lo que use en 2021
        // .until(new Date(fechaFinSerie)), {guests: invitadoUsuario, guests: invitadoGrupo});   //////////// SIN DESCRIPCION
        // .until(new Date(fechaFinSerie)), {description: descripcionEvento, guests: invitadoUsuario});   //////////// CON DESCRIPCION
        // .until(new Date("May 23,2021")), {description: descripcionEvento, guests: invitadoUsuario});   //////////// Viejo: Defino fecha fin manualmente.
        //.onlyOnWeekdays([CalendarApp.Weekday.MONDAY, CalendarApp.Weekday.WEDNESDAY]) ///// Viejo: defino manualmente los dias que se repite.
        // ss.getRange(i+2, columnaEscribir).setValue(evento.getId());  // eventId completo, incluye el @google.com.   
        // console.log("ID: "+evento.getOriginalCalendarId);

        console.log("START 2022 Edit")
        var eventoIDconGoogle = evento.getId();
        console.log("Event ID con @google: " + eventoIDconGoogle);
        var idEvento = evento.getId().split("@")[0];
        console.log("Event ID: " + idEvento);
        cal.getEventSeriesById(idEvento).setGuestsCanInviteOthers(guestsCanInviteOthers).setGuestsCanSeeGuests(guestsCanSeeGuests);
        console.log(nombreEvento + "  " + idEvento + ' :Completado');

        console.log("END 2022 Edit")
        // console.log("Event Series ID: "+evento.getId() );
        // console.log("Se creo para i ="+i);


        // ACTIVAR DURANTE PRUEBAS  -  DESACTIVAR DURANTE IMPLEMENTACION MASIVA
        // ss.getRange(i+2, columnaEscribir).setValue(evento.getId().split("@")[0]);  // ACTIVO MIENTRAS HAGO PRUEBAS 

        console.log("FIN Intento creacion del evento")
      }
      catch (e) {
        if (e == "TypeError: Cannot read property 'createEventSeries' of null") {
          console.log(e);
          // ui.alert("ERROR: Solo se puede correr desde MEET.MASTER.TODAS@", ui.ButtonSet.OK)
        }
        console.log("Hubo algun tipo de error");
      }
    }
    console.log("End of Loop");

    var response = ui.alert('Quieres GET MEET LINKS? (Elige SI, a menos que sea una prueba)', ui.ButtonSet.YES_NO);
    // Process the user's response.
    if (response == ui.Button.YES) {
      console.log('GETTING MEET LINKS');
      getAllEventsAndMeetLinks()
    }
    console.log('No seleccionaste GET MEET LINKS');
  } else { console.log('Cancelaste correr el script'); }
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////