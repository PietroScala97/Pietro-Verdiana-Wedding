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

  // nuovo header ⬇️
  const header = [
    'timestamp',
    'name',
    'email',
    'attend',
    'guests',
    'menu_bambini',
    'neonati',
    'message'
  ];

  const lines = [header.join(',')];

  for(const r of rows){
    lines.push([
      r.timestamp,
      r.name,
      r.email,
      r.attend,
      r.guests,
      r.menu_bambini,
      r.neonati,
      r.message
    ].map(esc).join(','));
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

    // ⬇️ corretti e aggiunti
    guests: fd.get('guests') || 0,
    menu_bambini: fd.get('menu_bambini') || 0,
    neonati: fd.get('neonati') || 0,

    message: fd.get('message') || ''
  };

  // salva in localStorage
  const list = readRSVPs();
  list.push(data);
  writeRSVPs(list);

  // opzionale: invia a Formspree (commenta se non usi)
  try {
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
  status.textContent = 'Grazie — la tua risposta è stata registrata. Puoi scaricarla o aggiornarla inviando una nuova conferma.';
  form.reset();
});

// Intro fade-out animation
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');

  setTimeout(() => {
    intro.classList.add('fade-out');
  }, 2500);
});


document.querySelectorAll('h2').forEach(title => {
  title.addEventListener('click', () => {
    // Toggle classe active sul titolo
    title.classList.toggle('active');

    // Trova il contenuto subito dopo il titolo
    const content = title.nextElementSibling;
    if (content.classList.contains('accordion-content')) {
      if (content.style.maxHeight) {
        // Chiudi
        content.style.maxHeight = null;
        content.classList.remove('open');
      } else {
        // Apri
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add('open');
      }
    }
  });
});



const titles = document.querySelectorAll('h2');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('active');   // titolo attivo
    } else {
      entry.target.classList.remove('active'); // titolo fuori schermo
    }
  });
}, { threshold: 0.5 }); // 20% visibile nello schermo

titles.forEach(title => observer.observe(title));


form.addEventListener('submit', async (e)=> {
  e.preventDefault();
  const fd = new FormData(form);

  const formData = new FormData();
  formData.append('entry.103843279', fd.get('name'));
  formData.append('entry.570514293', fd.get('email'));
  formData.append('entry.2013542650', fd.get('attend'));
  formData.append('entry.1304489183', fd.get('guests'));
  formData.append('entry.1631162747', fd.get('menu_bambini'));
  formData.append('entry.785936617', fd.get('neonati'));
  formData.append('entry.1037141172', fd.get('message'));

  await fetch('https://docs.google.com/forms/d/e/1FAIpQLScjtbUtBzXUBUgkxZa7yL8oAvhtnhnfdNrZ4Z9pkPIFUIZ2Mg/formResponse', {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  });

  status.textContent = 'Grazie — la tua risposta è stata registrata correttamente.';
  status.style.color = 'green';
  form.reset();
});