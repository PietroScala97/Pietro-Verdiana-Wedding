// script.js

const form = document.getElementById('rsvp-form');
const status = document.getElementById('form-status');
const downloadBtn = document.getElementById('download-csv');

const STORAGE_KEY = 'wedding_rsvps_v1';

// leggi array esistente o crea nuovo
function readRSVPs(){
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
function writeRSVPs(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// genera CSV semplice
function toCSV(rows){
  const esc = v => `"${String(v).replace(/"/g,'""')}"`;
  const header = ['timestamp','name','email','attend','guests','message'];
  const lines = [header.join(',')];
  for(const r of rows){
    lines.push([r.timestamp, r.name, r.email, r.attend, r.guests, r.message].map(esc).join(','));
  }
  return lines.join('\n');
}

// download CSV
downloadBtn.addEventListener('click', ()=>{
  const rows = readRSVPs();
  if(rows.length === 0){
    alert('No RSVP yet.');
    return;
  }
  const csv = toCSV(rows);
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rsvps.csv';
  a.click();
  URL.revokeObjectURL(url);
});

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const data = {
    timestamp: new Date().toISOString(),
    name: fd.get('name') || '',
    email: fd.get('email') || '',
    attend: fd.get('attend') || '',
    guests: fd.get('guests') || 0,
    message: fd.get('message') || ''
  };

  // salva in localStorage
  const list = readRSVPs();
  list.push(data);
  writeRSVPs(list);

  // opzionale: invia a Formspree (commenta se non usi)
  // Se vuoi usare Formspree: crea un form su formspree.io e sostituisci "YOUR_FORMSPREE_ENDPOINT"
  try {
    // uncomment the block below if you set up Formspree and replaced the endpoint
    /*
    await fetch('https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT', {
      method:'POST',
      headers:{ 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    */
  } catch(err){
    console.warn('Formspree send failed', err);
  }

  // feedback all'utente
  status.textContent = 'Thanks — your RSVP has been recorded. You can download the list or reply again to change it.';
  form.reset();
});
// Intro fade-out animation
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');

  setTimeout(() => {
    intro.classList.add('fade-out');
  }, 2500); // tempo di attesa in millisecondi (2,5 secondi)
});
