// BrainFirst receiver. Paste into script.google.com from your PRIVATE Google Sheet (Extensions > Apps Script).
// Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
// Copy the web app URL into submitEndpoint in bf-bundle-x7k29q.html.
// Run testReceiver() once from the editor to grant Sheet and email permission.

var NOTIFY_EMAIL = 'brainfirstnigeria@gmail.com';
var SHEET_NAME = 'Responses';
var HEADERS = ['Received', 'Product', 'Name', 'Email', 'Research consent', 'READ FIRST (distress words)',
               'Total', 'Top two areas', 'Note or band', 'Area scores', 'Extra', 'Answers (JSON)', 'Report draft'];

// Stops names or free text starting with = + - @ from running as formulas in the Sheet.
function safe(v) {
  var s = (v === null || v === undefined) ? '' : String(v);
  if (s.length > 49000) s = s.substring(0, 49000) + ' [truncated]';
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  var d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput('bad request');
  }
  d.summary = d.summary || {};
  var topTwo = Object.prototype.toString.call(d.summary.topTwo) === '[object Array]' ? d.summary.topTwo.join(' + ') : '';

  var lock = LockService.getScriptLock();
  var saved = false;
  try {
    lock.waitLock(20000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
    sh.appendRow([
      new Date(), safe(d.product), safe(d.name), safe(d.email),
      d.researchConsent ? 'Yes' : 'No',
      d.reviewFirst ? 'YES' : '',
      d.summary.total, safe(topTwo), safe(d.summary.noteLabel),
      safe(d.summary.areaLine), safe(d.summary.extra),
      safe(JSON.stringify(d.answers || {})), safe(d.reportText)
    ]);
    saved = true;
  } catch (err) {
    console.error('Sheet write failed: ' + err);
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }

  // Email goes out even if the Sheet write failed, so no submission is lost.
  try {
    var title = d.productTitle || d.product || 'BrainFirst profile';
    var subject = (d.reviewFirst ? '[READ FIRST] ' : '') + 'New BrainFirst submission: ' + title + ' - ' + (d.name || 'no name');
    var body =
      (d.reviewFirst ? 'READ FIRST: distress words were found in the free-text answers.\n\n' : '') +
      'Product: ' + title + '\n' +
      'Name: ' + (d.name || '') + '\n' +
      'Email: ' + (d.email || '') + '\n' +
      'Research consent: ' + (d.researchConsent ? 'Yes' : 'No') + '\n' +
      'Submitted: ' + (d.submittedAt || new Date().toISOString()) + '\n' +
      'Saved to Sheet: ' + (saved ? 'Yes' : 'NO, check the Apps Script logs') + '\n\n' +
      'Total: ' + (d.summary.total === undefined ? '' : d.summary.total) + '\n' +
      'Top two areas: ' + topTwo + '\n' +
      'Note or band: ' + (d.summary.noteLabel || '') + '\n' +
      'Area scores: ' + (d.summary.areaLine || '') + '\n' +
      'Extra: ' + (d.summary.extra || '') + '\n\n' +
      '----- REPORT DRAFT -----\n' + (d.reportText || '') + '\n\n' +
      '----- ANSWERS (JSON) -----\n' + JSON.stringify(d.answers || {}, null, 2);
    var opts = { name: 'BrainFirst Submissions' };
    if (d.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) opts.replyTo = d.email;
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body, opts);
  } catch (err) {
    console.error('Email failed: ' + err);
  }

  return ContentService.createTextOutput(saved ? 'ok' : 'error');
}

// Opening the web app URL in a browser should show this, which confirms the deployment is live.
function doGet() {
  return ContentService.createTextOutput('BrainFirst receiver is live');
}

// Run this from the editor (Run > testReceiver). It writes one test row and sends one test email.
function testReceiver() {
  var fake = {
    postData: { contents: JSON.stringify({
      submittedAt: new Date().toISOString(), product: 'aefp', productTitle: 'TEST: Attention and Executive Function Profile',
      name: 'Test Person', email: NOTIFY_EMAIL, researchConsent: true, reviewFirst: false,
      summary: { total: 42, topTwo: ['Focus', 'Time'], noteLabel: 'Note A', areaLine: 'Focus 12 (Often); Time 10 (Sometimes)', extra: 'test' },
      answers: { A1: 3, A2: 4 }, reportText: 'This is a test report draft.'
    }) }
  };
  Logger.log(doPost(fake).getContent());
}
