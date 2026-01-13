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



// --- CONFIG CLOUDINARY ---
const CLOUD_NAME = "dhomdjmwc";           // Il tuo Cloud Name
const UPLOAD_PRESET = "Wedding_Photo_P_V"; // Il preset creato su Cloudinary
const FOLDER_NAME = "Wedding_Photo_P_V";   // Cartella dove salvare le foto

// --- FUNZIONE PER RIDIMENSIONARE LE FOTO PRIMA DELL'UPLOAD ---
function resizeImage(file, maxWidth = 1920, maxHeight = 1920) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(blob => {
        resolve(new File([blob], file.name, { type: "image/jpeg" }));
      }, "image/jpeg", 0.85); // qualità 85%
    };

    reader.readAsDataURL(file);
  });
}

// --- NUOVA FUNZIONE UPLOAD FOTO ---
async function uploadPhotos() {
  const files = document.getElementById("photoInput").files;
  const status = document.getElementById("upload-status");

  if (!files.length) {
    status.innerText = "Seleziona almeno una foto.";
    return;
  }

  status.innerText = "Caricamento in corso...";

  for (let file of files) {
    // Ridimensiona e comprime la foto
    const resizedFile = await resizeImage(file);

    const formData = new FormData();
    formData.append("file", resizedFile);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", FOLDER_NAME); // Cartella Cloudinary

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      const img = document.createElement("img");
      img.src = data.secure_url;
      img.style.width = "150px";
      img.style.margin = "5px";
      document.getElementById("guest-gallery").appendChild(img);

      status.innerText = "Upload completato 🎉";
    } catch (err) {
      console.error(err);
      status.innerText = "Errore durante l'upload";
    }
  }
}


// --- CARICA FOTO GIÀ PRESENTI SU CLOUDINARY ALL'AVVIO ---
window.addEventListener("load", () => {
  fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${FOLDER_NAME}.json`)
    .then(res => res.json())
    .then(data => {
      data.resources.forEach(img => {
        const image = document.createElement("img");
        image.src = img.secure_url;
        image.style.width = "150px";
        image.style.margin = "5px";
        document.getElementById("guest-gallery").appendChild(image);
      });
    })
    .catch(() => {
      console.log("Nessuna immagine trovata o errore fetch Cloudinary");
    });
});

