/**
 * Jeni Alverca Marhenawati - Web Personal
 * script.js - Interactividad, Navegación, Modo Oscuro y Utilidades
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. SELECTORES PRINCIPALES
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const contactForm = document.getElementById('contactForm');
  const copyEmailQuick = document.getElementById('copyEmailQuick');
  const copyEmailContact = document.getElementById('copyEmailContact');

  // ==========================================
  // 2. MODO OSCURO / CLARO (PERSISTENTE)
  // ==========================================
  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  // Aplicar tema inicial
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Alternar tema al pulsar botón
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        showToast('Tema claro activado');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        showToast('Tema oscuro activado');
      }
    });
  }

  // ==========================================
  // 3. MENÚ DE NAVEGACIÓN MÓVIL
  // ==========================================
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar menú al hacer clic en un enlace de navegación
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Cerrar menú si se hace clic fuera del mismo
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // 4. SOMBRA Y CAMBIO DE ALTURA EN NAVBAR AL HACER SCROLL
  // ==========================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================
  // 5. RESALTADO DEL ENLACE ACTIVO (SCROLLSPY)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // ==========================================
  // 6. FUNCIÓN TOAST DE NOTIFICACIÓN
  // ==========================================
  let toastTimeout;
  function showToast(message) {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ==========================================
  // 7. COPIAR CORREO AL PORTAPAPELES
  // ==========================================
  function setupCopyButton(button) {
    if (!button) return;
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = button.getAttribute('data-email') || 'elisa.alverca@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('¡Correo ' + email + ' copiado al portapapeles!');
      } catch (err) {
        // Fallback para navegadores antiguos
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('¡Correo ' + email + ' copiado al portapapeles!');
      }
    });
  }

  setupCopyButton(copyEmailQuick);
  setupCopyButton(copyEmailContact);

  // ==========================================
  // 8. FORMULARIO DE CONTACTO RÁPIDO
  // ==========================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Por favor, rellena todos los campos obligatorios.');
        return;
      }

      // Preparar enlace mailto estructurado
      const destinationEmail = 'elisa.alverca@gmail.com';
      const emailSubject = encodeURIComponent(`[Web Contacto] ${subject} - ${name}`);
      const emailBody = encodeURIComponent(
        `Hola Jeni,\n\nMi nombre es: ${name}\nCorreo de contacto: ${email}\nInterés: ${subject}\n\nMensaje:\n${message}\n\n---\nEnviado desde tu sitio web personal`
      );

      const mailtoUrl = `mailto:${destinationEmail}?subject=${emailSubject}&body=${emailBody}`;

      showToast('Abriendo tu gestor de correo...');
      
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
    });
  }

  // ==========================================
  // 9. BOTÓN VOLVER ARRIBA
  // ==========================================
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
