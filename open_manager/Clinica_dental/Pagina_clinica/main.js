/**
 * LUMINA DENTAL STUDIO - INTERACTION & BOOKING SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const modalOverlay = document.getElementById('appointmentModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalButtons = document.querySelectorAll('.open-modal-btn');
  const appointmentForm = document.getElementById('appointmentForm');
  const modalFormContainer = document.getElementById('modalFormContainer');
  const modalSuccessScreen = document.getElementById('modalSuccessScreen');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const submitBtn = document.getElementById('submitAppointmentBtn');

  // Success summary elements
  const successPatientName = document.getElementById('successPatientName');
  const successTreatment = document.getElementById('successTreatment');
  const successTime = document.getElementById('successTime');

  // Navigation
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  /* -------------------------------------------------------------------------
     1. MODAL OPEN / CLOSE LOGIC
     ------------------------------------------------------------------------- */
  function openModal(preselectedTreatment = '') {
    if (!modalOverlay) return;

    // Reset view states
    modalFormContainer.style.display = 'block';
    modalSuccessScreen.classList.remove('active');
    appointmentForm.reset();
    clearFormErrors();

    // If a specific treatment was requested, pre-select it
    if (preselectedTreatment) {
      const treatmentSelect = document.getElementById('treatmentType');
      if (treatmentSelect) {
        treatmentSelect.value = preselectedTreatment;
      }
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Focus first input
    const firstInput = document.getElementById('patientName');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 150);
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open modal trigger clicks
  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Check if button belongs to a specialty card
      const specialtyCard = btn.closest('.specialty-card');
      let treatmentVal = '';
      if (specialtyCard) {
        const titleText = specialtyCard.querySelector('.specialty-title')?.textContent || '';
        if (titleText.includes('Carillas') || titleText.includes('Diseño')) treatmentVal = 'diseno-sonrisa';
        else if (titleText.includes('Ortodoncia')) treatmentVal = 'ortodoncia';
        else if (titleText.includes('Implantología')) treatmentVal = 'implantes';
        else if (titleText.includes('Blanqueamiento')) treatmentVal = 'blanqueamiento';
      }

      openModal(treatmentVal);
    });
  });

  // Close modal clicks
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  // Close on clicking outside modal-card
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  /* -------------------------------------------------------------------------
     2. FORM VALIDATION & SUBMISSION
     ------------------------------------------------------------------------- */
  function validateField(inputElement, errorElement, condition) {
    if (!condition) {
      inputElement.classList.add('error');
      if (errorElement) errorElement.classList.add('visible');
      return false;
    } else {
      inputElement.classList.remove('error');
      if (errorElement) errorElement.classList.remove('visible');
      return true;
    }
  }

  function clearFormErrors() {
    const errorInputs = appointmentForm.querySelectorAll('.error');
    errorInputs.forEach(el => el.classList.remove('error'));
    const errorMessages = appointmentForm.querySelectorAll('.form-error');
    errorMessages.forEach(el => el.classList.remove('visible'));
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('patientName');
      const phoneInput = document.getElementById('patientPhone');
      const emailInput = document.getElementById('patientEmail');
      const treatmentSelect = document.getElementById('treatmentType');
      const timeSelect = document.getElementById('preferredTime');
      const privacyCheck = document.getElementById('privacyConsent');

      const nameError = document.getElementById('nameError');
      const phoneError = document.getElementById('phoneError');
      const emailError = document.getElementById('emailError');
      const treatmentError = document.getElementById('treatmentError');
      const privacyError = document.getElementById('privacyError');

      // Validation Rules
      const isNameValid = validateField(
        nameInput,
        nameError,
        nameInput.value.trim().length >= 3
      );

      // Accepts standard Spanish/international phone formats
      const phoneRegex = /^[+]?[(]?[0-9]{2,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,6}$/;
      const isPhoneValid = validateField(
        phoneInput,
        phoneError,
        phoneRegex.test(phoneInput.value.trim().replace(/\s+/g, ''))
      );

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = validateField(
        emailInput,
        emailError,
        emailRegex.test(emailInput.value.trim())
      );

      const isTreatmentValid = validateField(
        treatmentSelect,
        treatmentError,
        treatmentSelect.value !== ''
      );

      const isPrivacyValid = validateField(
        privacyCheck,
        privacyError,
        privacyCheck.checked
      );

      const isFormValid = isNameValid && isPhoneValid && isEmailValid && isTreatmentValid && isPrivacyValid;

      if (!isFormValid) {
        // Find first invalid input and focus it
        const firstInvalid = appointmentForm.querySelector('.error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate sending with loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="btn-icon" style="animation: spin 1s linear infinite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"/>
        </svg>
        <span>Procesando reserva...</span>
      `;

      setTimeout(() => {
        // Populate success screen details
        if (successPatientName) {
          successPatientName.textContent = nameInput.value.trim();
        }
        if (successTreatment) {
          successTreatment.textContent = treatmentSelect.options[treatmentSelect.selectedIndex].text;
        }
        if (successTime) {
          successTime.textContent = timeSelect.options[timeSelect.selectedIndex].text;
        }

        // Switch to success view
        modalFormContainer.style.display = 'none';
        modalSuccessScreen.classList.add('active');

        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }, 700);
    });

    // Real-time error removal on input
    ['input', 'change'].forEach(eventType => {
      appointmentForm.addEventListener(eventType, (e) => {
        if (e.target.classList.contains('error')) {
          e.target.classList.remove('error');
          const group = e.target.closest('.form-group');
          if (group) {
            const err = group.querySelector('.form-error');
            if (err) err.classList.remove('visible');
          }
        }
      });
    });
  }

  /* -------------------------------------------------------------------------
     3. MOBILE NAVIGATION MENU
     ------------------------------------------------------------------------- */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  /* -------------------------------------------------------------------------
     4. HEADER SCROLL SHADOW
     ------------------------------------------------------------------------- */
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 20px -2px rgba(15, 23, 42, 0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }
});

// Inline spin animation helper
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
