// Solo correr el activador una vez, EVER!
// Despues en el menu de "Activadores" lo puedo ver y dar de baja o editar incluso.

// Source: https://www.youtube.com/watch?v=5BYhGGPQlyA
function setUpMainTriggerGetEvents(){
 ScriptApp.newTrigger("getAllEventsAndMeetLinks")
 .timeBased()
 .atHour(7)
 .nearMinute(0)
 .everyDays(1)
 .inTimezone('Europe/Madrid')
 .create();  

ScriptApp.newTrigger("getAllEventsAndMeetLinks")
 .timeBased()
 .atHour(17)
 .nearMinute(0)
 .everyDays(1)
 .inTimezone('Europe/Madrid')
 .create();  
}

function setUpTemporaryTrigger(runFx){
  console.log("Creando Temp Trigger");
  var cantMinEspera = 1;
  var espera = cantMinEspera * 60 * 1000; 
  console.log(espera);
  ScriptApp.newTrigger(runFx)
  .timeBased()
  .after(espera)
  .create()
}

// Elimina triggers que ya se hayan usado.
function deletingDisabledTriggers(){
  let allTriggers = ScriptApp.getProjectTriggers();
 // console.log(allTriggers.length)
 // console.log(allTriggers)
  allTriggers.forEach ((item) => {
    let trigger = item
    let triggerName = trigger.getHandlerFunction()
    let triggerDisabled = trigger.isDisabled()
    if (triggerDisabled == true) {
    console.log(">>>> DELETING Disabled Trigger: %s ",triggerName)
    ScriptApp.deleteTrigger(trigger)
   } else {
     console.log("REMAINS: %s Trigger. Still Active.",triggerName, triggerDisabled)
   }
  })
}


function formatoFecha (fecha){
  var nowTime = new Date(fecha);
  console.log(nowTime);
  var timeFormateado = Utilities.formatDate(nowTime, 'America/Argentina/Buenos_Aires', 'MMMM dd, yyyy HH:mm:ss');
  //console.log("Convertido a: ",timeFormateado);
  return timeFormateado
};


function startingFX() {
  var comienzo = new Date();
  var startTime = Utilities.formatDate(comienzo, "GMT+1", 'dd-MM-yyyy HH:mm:ss.SSS')
  // Logger.log(comienzo);
  // Logger.log(startTime);
  console.log("Runs startingFX(): ", startTime);
  return comienzo
}

function finishingFX() {
  var fin = new Date();
  var endTime = Utilities.formatDate(fin, "GMT+1", 'dd-MM-yyyy HH:mm:ss.SSS')
  // Logger.log(fin);
  // Logger.log(endTime);
  console.log("Runs finishingFX(): ", endTime);
  return fin
}

function totalDuration(tiempoInicio) {
  var tiempoFin = finishingFX();
  var diferencia = (tiempoFin - tiempoInicio);
  // Convierte a formato lejible
  var duracion = msToTime(diferencia);
  console.log("⌚ Duracion: ", duracion);
  return duracion
}


// Convierte milesimas de segundo en formato lejible
function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days"
}

function localTime() {
  let diaInicio = new Date
  let zonaESP = "GMT+1";
  let paisESP = "ESP"
  let fechayHora = Utilities.formatDate(diaInicio, zonaESP, 'dd-MM-yy HH:mm:ss') +" ("+paisESP+")"
  return fechayHora;
}
