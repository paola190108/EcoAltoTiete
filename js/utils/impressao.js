// Utilitário: impressão / salvar como PDF
function printHTML(html){
  const pr = document.getElementById('print-root');
  pr.innerHTML = `<div style="font-family:Inter,Arial,sans-serif;max-width:720px;margin:0 auto;color:#1f2a24">${html}</div>`;
  document.body.classList.add('printing');
  const done = () => { document.body.classList.remove('printing'); pr.innerHTML=''; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(()=>{ window.print(); setTimeout(done, 500); }, 60);
}
