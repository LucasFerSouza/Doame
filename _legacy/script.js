document.addEventListener('DOMContentLoaded', () => {
  const nextButtons = document.querySelectorAll('.next-btn');

  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStep = button.parentElement;
      const input = currentStep.querySelector('input, textarea');

      // Só valida se o campo tiver o atributo "required"
      if (input && input.hasAttribute('required') && input.value.trim() === '') {
        input.focus();
        input.style.border = '2px solid red';
        return;
      }

      input.style.border = '';

      const nextStepId = button.dataset.next;
      const nextStep = document.getElementById(`step${nextStepId}`);

      currentStep.classList.remove('active');
      nextStep.classList.add('active');
    });
  });
});

function animarImagemECerrar() {
  const img = document.getElementById('imagem');
  let escala = 1;

  const animacao = setInterval(() => {
    escala += 0.05; // aumenta a escala aos poucos
    img.style.transform = `scale(${escala})`;
  }, 100); // atualiza a cada 100ms

  setTimeout(() => {
    clearInterval(animacao); // para de escalar
    window.close();          // tenta fechar a aba
  }, 10000); // 10 segundos
}