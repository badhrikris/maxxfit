/**
 * MAXXFIT FITNESS CENTRE — PREMIUM ENGINE
 * Pure Vanilla JavaScript implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPreloader();
  initCustomCursor();
  initNavigation();
  initHeroParallax();
  initScrollObserver();
  initFacilities();
  initBmiCalculator();
  initMembershipSelector();
  initPersonalTraining();
  initEnquiryForm();
  initSpinWorkout();
});

/* ==========================================================================
   1. PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.add('site-ready');
    }, 600);
  });

  // Fallback if load already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.add('site-ready');
    }, 600);
  }
}

/* ==========================================================================
   2. CUSTOM CURSOR (DESKTOP)
   ========================================================================== */
function initCustomCursor() {
  // Only enable on fine pointer / desktop
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(renderRing);
    }
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      requestAnimationFrame(renderRing);
    } else {
      isMoving = false;
    }
  }

  // Interactive element hover handlers
  const clickables = document.querySelectorAll('a, button, input, select, textarea, .clickable');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  const viewables = document.querySelectorAll('.cursor-viewable, .facility-card, .editorial-image-box');
  viewables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-view');
      ring.innerText = 'VIEW';
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-view');
      ring.innerText = '';
    });
  });
}

/* ==========================================================================
   3. NAVIGATION (STICKY SCROLL & MOBILE MENU)
   ========================================================================== */
function initNavigation() {
  const navHeader = document.querySelector('.nav-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu-panel');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky navbar transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu open / close
  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-full', 'invisible');
    mobileMenu.classList.add('translate-x-0', 'visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-0', 'visible');
    mobileMenu.classList.add('translate-x-full', 'invisible');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ESC key closes mobile menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

/* ==========================================================================
   4. HERO PARALLAX
   ========================================================================== */
function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024) return;

  const heroContainer = document.getElementById('hero-section');
  const parallaxImg = document.getElementById('hero-parallax-img');
  if (!heroContainer || !parallaxImg) return;

  let ticking = false;

  heroContainer.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const { width, height, left, top } = heroContainer.getBoundingClientRect();
        const mouseX = (e.clientX - left) / width - 0.5;
        const mouseY = (e.clientY - top) / height - 0.5;

        // Subtle movement
        const moveX = mouseX * 24;
        const moveY = mouseY * 20;

        parallaxImg.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });

  heroContainer.addEventListener('mouseleave', () => {
    parallaxImg.style.transform = 'scale(1) translate(0px, 0px)';
  });
}

/* ==========================================================================
   5. INTERSECTION OBSERVER SCROLL REVEAL
   ========================================================================== */
function initScrollObserver() {
  const elements = document.querySelectorAll('.reveal-item, .reveal-fade, .reveal-clip');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older environments
    elements.forEach(el => el.classList.add('is-revealed'));
  }
}

/* ==========================================================================
   6. INTERACTIVE FACILITIES CARDS
   ========================================================================== */
function initFacilities() {
  const cards = document.querySelectorAll('.facility-card');
  if (!cards.length) return;

  // On desktop, clicking sets the active card
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) {
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      }
    });

    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
    });
  });
}

/* ==========================================================================
   7. BMI CALCULATOR (REAL, WORKING, ROBUST)
   ========================================================================== */
function initBmiCalculator() {
  const heightInput = document.getElementById('bmi-height');
  const weightInput = document.getElementById('bmi-weight');
  const calcBtn = document.getElementById('btn-calc-bmi');
  const resetBtn = document.getElementById('btn-reset-bmi');
  const errorBox = document.getElementById('bmi-error');
  const resultCard = document.getElementById('bmi-result');
  const valueDisplay = document.getElementById('bmi-val');
  const categoryBadge = document.getElementById('bmi-cat');
  const descDisplay = document.getElementById('bmi-desc');
  const pin = document.getElementById('bmi-pin');

  if (!calcBtn || !heightInput || !weightInput) return;

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
    resultCard.classList.add('opacity-40');
  }

  function clearError() {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
    resultCard.classList.remove('opacity-40');
  }

  function calculate() {
    clearError();

    const rawHeight = heightInput.value.trim();
    const rawWeight = weightInput.value.trim();

    if (!rawHeight || !rawWeight) {
      showError('Please enter both your height (cm) and weight (kg).');
      return;
    }

    const heightCm = parseFloat(rawHeight);
    const weightKg = parseFloat(rawWeight);

    if (isNaN(heightCm) || isNaN(weightKg)) {
      showError('Invalid input. Please enter valid numeric values.');
      return;
    }

    if (heightCm <= 0 || weightKg <= 0) {
      showError('Height and weight must be greater than zero.');
      return;
    }

    if (heightCm < 80 || heightCm > 260) {
      showError('Please enter a realistic height between 80 cm and 260 cm.');
      return;
    }

    if (weightKg < 20 || weightKg > 350) {
      showError('Please enter a realistic weight between 20 kg and 350 kg.');
      return;
    }

    // Formula: BMI = weight (kg) / (height (m))^2
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    if (!isFinite(bmi) || isNaN(bmi)) {
      showError('Calculation error. Please verify your numbers.');
      return;
    }

    displayResult(bmi);
  }

  function displayResult(bmi) {
    resultCard.classList.remove('hidden');
    resultCard.classList.add('flex');

    // Animate number count up
    const targetBmi = parseFloat(bmi.toFixed(1));
    let current = 0;
    const step = targetBmi / 25;
    const counterInterval = setInterval(() => {
      current += step;
      if (current >= targetBmi) {
        valueDisplay.textContent = targetBmi.toFixed(1);
        clearInterval(counterInterval);
      } else {
        valueDisplay.textContent = current.toFixed(1);
      }
    }, 18);

    // Determine category
    let category = '';
    let catColor = '';
    let description = '';
    let pinPercentage = 50;

    if (targetBmi < 18.5) {
      category = 'UNDERWEIGHT';
      catColor = 'bg-sky-500 text-white';
      description = 'Your BMI indicates you are underweight. We recommend customized nutrition and lean muscle mass resistance training.';
      pinPercentage = Math.max(5, (targetBmi / 18.5) * 18.5);
    } else if (targetBmi >= 18.5 && targetBmi <= 24.9) {
      category = 'NORMAL WEIGHT';
      catColor = 'bg-emerald-600 text-white';
      description = 'Outstanding! You are in a healthy weight range. Keep up your routine with our strength and cardio equipment to maintain peak fitness.';
      pinPercentage = 18.5 + ((targetBmi - 18.5) / (24.9 - 18.5)) * 36.5;
    } else if (targetBmi >= 25 && targetBmi <= 29.9) {
      category = 'OVERWEIGHT';
      catColor = 'bg-amber-500 text-black';
      description = 'Your BMI indicates you are slightly above optimal weight. Combining targeted calorie burn with structured weight training will rapidly get you lean.';
      pinPercentage = 55 + ((targetBmi - 25) / (29.9 - 25)) * 23;
    } else {
      category = 'OBESE';
      catColor = 'bg-[#E50914] text-white';
      description = 'Your BMI is in the obese range. Our certified personal trainers at MaxxFit specialize in safe, sustainable body transformations with dedicated 1-on-1 focus.';
      pinPercentage = Math.min(95, 78 + ((targetBmi - 30) / 10) * 17);
    }

    categoryBadge.className = `px-3 py-1 font-display font-bold text-xs uppercase tracking-widest rounded-sm ${catColor}`;
    categoryBadge.textContent = category;
    descDisplay.textContent = description;

    // Position gauge pin
    if (pin) {
      pin.style.left = `${pinPercentage}%`;
    }
  }

  function reset() {
    heightInput.value = '';
    weightInput.value = '';
    clearError();
    resultCard.classList.add('hidden');
    resultCard.classList.remove('flex');
    if (pin) pin.style.left = '18.5%';
    heightInput.focus();
  }

  calcBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', reset);

  // Allow pressing Enter in inputs to calculate
  [heightInput, weightInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        calculate();
      }
    });
  });
}

/* ==========================================================================
   8. MEMBERSHIP SELECTOR & DYNAMIC PRICING
   ========================================================================== */
function initMembershipSelector() {
  const tabs = document.querySelectorAll('.plan-type-tab');
  const priceElements = document.querySelectorAll('[data-plan-duration]');
  const selectButtons = document.querySelectorAll('.btn-select-plan');
  const enquiryPlanSelect = document.getElementById('enquiry-plan');

  const prices = {
    strength: {
      '1m': '₹999',
      '3m': '₹2,499',
      '6m': '₹4,499',
      '12m': '₹6,999'
    },
    combo: {
      '1m': '₹1,299',
      '3m': '₹3,499',
      '6m': '₹5,999',
      '12m': '₹7,999'
    }
  };

  let activeMode = 'strength';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      if (mode === activeMode) return;
      activeMode = mode;

      tabs.forEach(t => {
        t.classList.remove('bg-[#E50914]', 'text-white');
        t.classList.add('text-neutral-400');
      });
      tab.classList.add('bg-[#E50914]', 'text-white');
      tab.classList.remove('text-neutral-400');

      // Update prices with smooth scale
      priceElements.forEach(priceEl => {
        const duration = priceEl.dataset.planDuration;
        const newPrice = prices[activeMode][duration];

        priceEl.style.transform = 'scale(0.85)';
        priceEl.style.opacity = '0.5';

        setTimeout(() => {
          priceEl.textContent = newPrice;
          priceEl.style.transform = 'scale(1)';
          priceEl.style.opacity = '1';
        }, 150);
      });
    });
  });

  // Clicking "SELECT →" on membership rows
  selectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const planName = btn.dataset.planName; // e.g. "1 Month", "Quarterly", etc.
      const rows = document.querySelectorAll('.membership-row');
      rows.forEach(r => r.classList.remove('is-selected'));

      const parentRow = btn.closest('.membership-row');
      if (parentRow) parentRow.classList.add('is-selected');

      // Auto-select in enquiry form
      if (enquiryPlanSelect && planName) {
        enquiryPlanSelect.value = planName;
      }

      // Smooth scroll to contact / enquiry section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });

        // Highlight form momentarily
        const formBox = document.getElementById('enquiry-form');
        if (formBox) {
          formBox.classList.add('ring-2', 'ring-[#E50914]');
          setTimeout(() => {
            formBox.classList.remove('ring-2', 'ring-[#E50914]');
          }, 1800);
        }
      }
    });
  });
}

/* ==========================================================================
   9. PERSONAL TRAINING SELECTOR
   ========================================================================== */
function initPersonalTraining() {
  const ptButtons = document.querySelectorAll('.btn-select-pt');
  const enquiryPlanSelect = document.getElementById('enquiry-plan');

  ptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (enquiryPlanSelect) {
        enquiryPlanSelect.value = 'Personal Training';
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });

        const formBox = document.getElementById('enquiry-form');
        if (formBox) {
          formBox.classList.add('ring-2', 'ring-[#E50914]');
          setTimeout(() => {
            formBox.classList.remove('ring-2', 'ring-[#E50914]');
          }, 1800);
        }
      }
    });
  });
}

/* ==========================================================================
   10. ENQUIRY FORM & WHATSAPP INTEGRATION
   ========================================================================== */
function initEnquiryForm() {
  const form = document.getElementById('enquiry-form');
  const nameInput = document.getElementById('enquiry-name');
  const phoneInput = document.getElementById('enquiry-phone');
  const planSelect = document.getElementById('enquiry-plan');
  const messageInput = document.getElementById('enquiry-message');
  const feedbackMsg = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const plan = planSelect.value;
    const msg = messageInput.value.trim();

    if (!name || name.length < 2) {
      showFormFeedback('Please enter your full name.', 'text-red-600');
      nameInput.focus();
      return;
    }

    if (!phone || phone.length < 8) {
      showFormFeedback('Please provide a valid phone number so we can reach you.', 'text-red-600');
      phoneInput.focus();
      return;
    }

    // Prepare WhatsApp Message Link
    const waText = encodeURIComponent(
      `Hi MaxxFit Fitness Centre, I am interested in joining the gym!\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Interested Plan: ${plan}\n` +
      (msg ? `Notes: ${msg}` : '')
    );
    const waUrl = `https://wa.me/918531050050?text=${waText}`;

    // Display confirmation and instant WhatsApp launcher button
    feedbackMsg.innerHTML = `
      <div class="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-sm">
        <p class="font-bold text-base mb-1">✓ Thank you, ${name}! Your enquiry has been received.</p>
        <p class="text-sm mb-3 text-emerald-800">Our fitness advisor will call you shortly at <strong>${phone}</strong>.</p>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-display text-sm uppercase tracking-wider font-bold rounded-sm transition">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.115-.521-1.815-.759-2.984-2.599-3.076-2.72-.089-.12-1.748-2.327-1.748-4.437 0-2.11 1.107-3.147 1.498-3.567.391-.42.853-.526 1.139-.526.284 0 .57.003.82.015.263.013.616-.1.964.736.357.859 1.218 2.972 1.325 3.188.107.217.179.47.036.756-.143.285-.214.463-.428.718-.214.254-.45.568-.643.763-.214.217-.438.452-.189.88.25.428 1.111 1.83 2.382 2.963 1.637 1.46 3.017 1.914 3.446 2.129.428.214.678.179.928-.107.25-.286 1.071-1.25 1.357-1.678.286-.429.571-.357.964-.214.393.143 2.499 1.179 2.928 1.393.429.214.714.321.821.5.107.179.107 1.036-.037 1.441z"/></svg>
          Connect on WhatsApp Instantly →
        </a>
      </div>
    `;
    feedbackMsg.classList.remove('hidden');

    form.reset();
  });

  function showFormFeedback(msg, colorClass) {
    feedbackMsg.innerHTML = `<p class="${colorClass} font-semibold text-sm">${msg}</p>`;
    feedbackMsg.classList.remove('hidden');
  }
}

/* ==========================================================================
   11. THEME MODE TOGGLE (DARK / LIGHT)
   ========================================================================== */
function initThemeToggle() {
  const desktopBtn = document.getElementById('theme-toggle-desktop');
  const mobileBtn = document.getElementById('theme-toggle-mobile');

  // Check storage or system preference
  let isDark = false;
  try {
    const savedTheme = localStorage.getItem('maxxfit-theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = savedTheme ? savedTheme === 'dark' : systemDark;
  } catch (e) {
    isDark = false;
  }

  applyTheme(isDark);

  function applyTheme(dark) {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateIcons(dark);
  }

  function updateIcons(dark) {
    // Sun icons (visible in dark mode)
    document.querySelectorAll('.theme-icon-sun').forEach(el => {
      if (dark) {
        el.classList.remove('hidden');
        el.classList.add('block');
      } else {
        el.classList.add('hidden');
        el.classList.remove('block');
      }
    });

    // Moon icons (visible in light mode)
    document.querySelectorAll('.theme-icon-moon').forEach(el => {
      if (dark) {
        el.classList.add('hidden');
        el.classList.remove('block');
      } else {
        el.classList.remove('hidden');
        el.classList.add('block');
      }
    });

    // Mobile text label
    const mobileLabel = document.querySelector('.theme-label-mobile');
    if (mobileLabel) {
      mobileLabel.textContent = dark ? 'LIGHT MODE' : 'DARK MODE';
    }
  }

  function toggleTheme() {
    const currentlyDark = document.documentElement.classList.contains('dark');
    const newDark = !currentlyDark;
    applyTheme(newDark);
    try {
      localStorage.setItem('maxxfit-theme', newDark ? 'dark' : 'light');
    } catch (e) {
      // Silently handle storage errors
    }
  }

  if (desktopBtn) {
    desktopBtn.addEventListener('click', toggleTheme);
  }
  if (mobileBtn) {
    mobileBtn.addEventListener('click', toggleTheme);
  }

  // Listen to OS scheme changes if user hasn't explicitly chosen
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('maxxfit-theme')) {
          applyTheme(e.matches);
        }
      } catch (err) {
        applyTheme(e.matches);
      }
    });
  }
}

/* ==========================================================================
   12. FLOATING "SPIN YOUR WORKOUT" ACTIVITY WIDGET
   ========================================================================== */
function initSpinWorkout() {
  const widgetBtn = document.getElementById('spin-widget-btn');
  const widgetPanel = document.getElementById('spin-widget-panel');
  const closeBtn = document.getElementById('spin-panel-close');
  const wheelSvg = document.getElementById('workout-wheel-svg');
  const wheelPointer = document.getElementById('wheel-pointer');
  const triggerBtn = document.getElementById('spin-trigger-btn');
  const resultBox = document.getElementById('spin-result-box');
  const resultCategory = document.getElementById('spin-result-category');
  const confettiCanvas = document.getElementById('spin-confetti-canvas');

  if (!widgetBtn || !widgetPanel || !wheelSvg || !triggerBtn) return;

  const categories = [
    'CHEST',
    'BACK',
    'SHOULDERS',
    'BICEPS',
    'TRICEPS',
    'LEGS',
    'ABS / CORE',
    'CARDIO'
  ];

  let currentAngle = 0;
  let lastPickedIndex = -1;
  let isSpinning = false;
  let isPanelOpen = false;

  // Panel Open / Close controls
  function openPanel() {
    isPanelOpen = true;
    widgetPanel.classList.remove('is-hidden');
    widgetPanel.classList.add('is-visible');
    widgetBtn.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    isPanelOpen = false;
    widgetPanel.classList.remove('is-visible');
    widgetPanel.classList.add('is-hidden');
    widgetBtn.setAttribute('aria-expanded', 'false');
  }

  function togglePanel() {
    if (isPanelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  widgetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
    });
  }

  // Close when clicking outside panel and button
  document.addEventListener('click', (e) => {
    if (!isPanelOpen) return;
    if (!widgetPanel.contains(e.target) && !widgetBtn.contains(e.target)) {
      closePanel();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPanelOpen) {
      closePanel();
    }
  });

  // Spin Wheel Mechanism
  function spin() {
    if (isSpinning) return;

    // Pick random category avoiding consecutive duplicates
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * categories.length);
    } while (newIndex === lastPickedIndex && categories.length > 1);

    lastPickedIndex = newIndex;
    isSpinning = true;

    // UI state during active spin
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'SPINNING...';
    if (resultBox) {
      resultBox.classList.add('hidden');
    }
    if (wheelPointer) {
      wheelPointer.classList.add('is-ticking');
    }

    // Spin physics calculation:
    // Sector i at 12 o'clock needle pointer (top = 0 deg)
    // Sector i is at angle (i * 45) deg clockwise from top in initial state
    // To bring Sector i to top, the wheel rotation mod 360 must be (360 - (i * 45) % 360) % 360
    const currentMod = currentAngle % 360;
    const targetMod = (360 - (newIndex * 45) % 360) % 360;
    let delta = targetMod - currentMod;
    if (delta <= 0) {
      delta += 360;
    }

    // 5 to 7 full revolutions for realistic spin momentum
    const fullSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    currentAngle += fullSpins + delta;

    // Apply smooth deceleration curve (4.5s cubic-bezier)
    wheelSvg.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)';
    wheelSvg.style.transform = `rotate(${currentAngle}deg)`;

    // Handle spin completion
    setTimeout(() => {
      isSpinning = false;
      if (wheelPointer) {
        wheelPointer.classList.remove('is-ticking');
      }

      // Display result cleanly (ONLY Today's Pick and Category Name)
      if (resultCategory) {
        resultCategory.textContent = categories[newIndex];
      }
      if (resultBox) {
        resultBox.classList.remove('hidden');
      }

      // Update button to "SPIN AGAIN" and re-enable
      triggerBtn.disabled = false;
      triggerBtn.textContent = 'SPIN AGAIN';

      // Elegant Particle Celebration Effect
      if (confettiCanvas) {
        triggerConfetti(confettiCanvas);
      }
    }, 4500);
  }

  triggerBtn.addEventListener('click', spin);

  // Short, elegant particle celebration effect on canvas
  function triggerConfetti(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = widgetPanel.clientWidth || 340;
    canvas.height = widgetPanel.clientHeight || 420;

    const colors = ['#E50914', '#FFFFFF', '#FFD700', '#B91C1C', '#FFA500'];
    const particles = [];
    const particleCount = 36;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.72,
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 6 + 3),
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    let animationId;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.vx *= 0.98; // air resistance
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          activeParticles++;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    }

    render();
  }
}

