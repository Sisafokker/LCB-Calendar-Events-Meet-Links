// //////////////////////////////////////////////////////////////////////////////////////////////////////////
// GitHubRepo = "LCB-Calendar-Events-Meet-Links"
// GitHubLink = "https://github.com/Sisafokker/LCB-Calendar-Events-Meet-Links";
// //////////////////////////////////////////////////////////////////////////////////////////////////////////


const hojaLinksMeet = "2-GetMeetLinks"

///////////////////// 🚩 DEFINIR MODO  🚩/////////////////////////////////////////
let thisSsID = "1wdQGJJjsDolwM82RocnkIThCT2iijT7YCP4333X9MRQ";
let sheetData = SpreadsheetApp.openById(thisSsID).getSheetByName("DATA");
let sheetBaseDatos = SpreadsheetApp.openById('1nbDyhWupneWGoSivfRcZQ3W91il41iSauGZ9VkhCJoY').getSheetByName("IMP_MeetLinks");
const modo = sheetData.getRange('B5').getValue();
/* Relacionado con la variable MODO
  🔴 "sinGrupo" : Testeo. Crea el evento pero no invita a los grupos
  🟡 "grupoPrueba": Testeo. Invita al grupo: gr.NoBorrar.test@liceobritanico.com
  🟢 "full": Para hacer la implementacion REAL.
*/
///////////////////// DEFINIR MODO /////////////////////////////////////////