document.addEventListener('DOMContentLoaded', () => {
  // Lazy Loading de Imágenes
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '0px 0px 200px 0px' });
  images.forEach(img => imageObserver.observe(img));

  // Scroll Suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Animaciones al hacer Scroll
  const sections = document.querySelectorAll('.hero-section, .ejemplos-section, .servicios-section, .contacto-section');
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  sections.forEach(section => sectionObserver.observe(section));

  // Efecto Ripple en Botones
  const buttons = document.querySelectorAll('.boton-vermas, .solicitar-diseno');
  buttons.forEach(button => {
    button.addEventListener('click', e => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Vista Previa de Temas en Ejemplo Cards
  const cards = document.querySelectorAll('.ejemplo-card');
  const themes = ['minimalista', 'natural', 'elegante', 'vintage'];
  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      document.body.classList.add(themes[index]);
    });
    card.addEventListener('mouseleave', () => {
      document.body.classList.remove(...themes);
    });
  });

  // Validación del Formulario (para contacto.html)
  const form = document.querySelector('.form-container form');
  if (form) {
    const premadeButtons = form.querySelectorAll('.premade-btn');
    const tipoNegocioInput = form.querySelector('#tipo-negocio');

    premadeButtons.forEach(button => {
      button.addEventListener('click', () => {
        premadeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        tipoNegocioInput.value = button.textContent;
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        tipo_negocio: formData.get('tipo-negocio'),
        mensaje: formData.get('mensaje')
      };

      try {
        const response = await fetch('/server/sendmail.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          alert('¡Mensaje enviado con éxito!');
          form.reset();
          premadeButtons.forEach(btn => btn.classList.remove('selected'));
          tipoNegocioInput.value = '';
        } else {
          alert('Error al enviar el mensaje. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el mensaje. Inténtalo de nuevo.');
      }
    });
  }
});