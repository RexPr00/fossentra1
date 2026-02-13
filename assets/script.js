document.querySelectorAll('[data-burger]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const links = document.querySelector('[data-nav-links]');
    if (links) links.classList.toggle('show');
  });
});

document.querySelectorAll('[data-lang-switcher]').forEach((switcher) => {
  const btn = switcher.querySelector('[data-lang-btn]');
  btn?.addEventListener('click', () => switcher.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) switcher.classList.remove('open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    if (entry.target.matches('[data-counter]')) {
      const target = Number(entry.target.dataset.counter);
      const suffix = entry.target.dataset.suffix || '';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const tick = () => {
        current = Math.min(target, current + step);
        entry.target.textContent = current.toLocaleString() + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
    }

    if (entry.target.matches('[data-bar]')) {
      const val = entry.target.dataset.bar;
      entry.target.style.width = val + '%';
    }

    observer.unobserve(entry.target);
  });
}, { threshold: 0.25 });

document.querySelectorAll('.reveal, [data-counter], [data-bar]').forEach((el) => observer.observe(el));

document.querySelectorAll('form[data-validate]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach((input) => {
      const err = input.parentElement.querySelector('.error');
      if (!input.value.trim()) {
        ok = false;
        if (err) err.textContent = input.dataset.requiredMsg || 'Required field';
        return;
      }
      if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
        ok = false;
        if (err) err.textContent = input.dataset.emailMsg || 'Please enter a valid email';
        return;
      }
      if (input.type === 'tel' && input.value.trim().length < 6) {
        ok = false;
        if (err) err.textContent = input.dataset.phoneMsg || 'Please enter a valid phone number';
        return;
      }
      if (err) err.textContent = '';
    });

    const status = form.querySelector('[data-form-status]');
    if (status) {
      status.textContent = ok
        ? (form.dataset.successMsg || 'Thank you. Our allocation team will contact you shortly.')
        : '';
    }
    if (ok) form.reset();
  });
});
