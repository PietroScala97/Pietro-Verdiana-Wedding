// script.js

const form = document.getElementById('rsvp-form');
const status = document.getElementById('form-status');

// ---- GESTIONE INVIO AL GOOGLE FORM ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const formData = new FormData();

  // 🔧 Sostituisci gli entry.xxx con i tuoi ID reali (vedi spiegazione sotto)
  formData.append('entry.103843279', fd.get('name'));            // Nome e cognome
  formData.append('entry.570514293', fd.get('email'));           // Email o telefono
  formData.append('entry.2013542650', fd.get('attend'));         // Conferma partecipazione
  formData.append('entry.1304489183', fd.get('guests'));         // N° Adulti
  formData.append('entry.1631162747', fd.get('menu_bambini'));   // N° Bambini
  formData.append('entry.785936617', fd.get('neonati'));         // N° Neonati
  formData.append('entry.1037141172', fd.get('message'));        // Allergie o note

  try {
    await fetch('https://docs.google.com/forms/d/e/1FAIpQLScjtbUtBzXUBUgkxZa7yL8oAvhtnhnfdNrZ4Z9pkPIFUIZ2Mg/formResponse', {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    status.textContent = 'Grazie — la tua risposta è stata registrata correttamente.';
    status.style.color = 'green';
    form.reset();

  } catch (err) {
    console.error('Errore durante l’invio del modulo:', err);
    status.textContent = 'Si è verificato un errore durante l’invio. Riprova più tardi.';
    status.style.color = 'red';
  }
});

// ---- ANIMAZIONE INTRO ----
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');
  if (intro) {
    setTimeout(() => {
      intro.classList.add('fade-out');
    }, 2500);
  }
});

// ---- ANIMAZIONE TITOLI E ACCORDION ----
document.querySelectorAll('h2').forEach(title => {
  title.addEventListener('click', () => {
    title.classList.toggle('active');
    const content = title.nextElementSibling;
    if (content && content.classList.contains('accordion-content')) {
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.classList.remove('open');
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add('open');
      }
    }
  });
});

const titles = document.querySelectorAll('h2');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    } else {
      entry.target.classList.remove('active');
    }
  });
}, { threshold: 0.5 });

titles.forEach(title => observer.observe(title));





// Mostra didascalia al click sulla foto
const galleryImages = document.querySelectorAll('.gallery-grid img');
const captionBox = document.getElementById('photo-caption');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    const caption = img.getAttribute('data-caption') || '';
    captionBox.textContent = caption;
  });
});



// Scroll smooth per sidebar
document.querySelectorAll('#sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
