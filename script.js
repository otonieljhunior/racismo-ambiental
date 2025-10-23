// Frontend interactions: form save to localStorage, render list, small helpers
(function(){
  // helper: get saved reports
  function getReports(){ return JSON.parse(localStorage.getItem('leitos_reports') || '[]'); }
  function saveReports(arr){ localStorage.setItem('leitos_reports', JSON.stringify(arr)); }

  // render existing reports on index page
  function renderReports(){
    const container = document.getElementById('relatosList');
    if(!container) return;
    container.innerHTML = '';
    const reports = getReports().slice().reverse();
    if(reports.length===0){
      container.innerHTML = '<p class="muted">Nenhum relato enviado ainda.</p>';
      return;
    }
    reports.forEach(r=>{
      const el = document.createElement('div');
      el.className = 'relato';
      el.innerHTML = '<strong>'+(r.nome||'Anônimo')+'</strong> — <em>'+r.bairro+'</em><p>'+ (r.texto.length>300? r.texto.substring(0,300)+'...' : r.texto) +'</p><small>'+r.tipo+' • '+r.date+'</small>';
      container.appendChild(el);
    });
  }

  // form submit
  const form = document.getElementById('relatoForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const bairro = document.getElementById('bairro').value.trim() || 'Não informado';
      const tipo = document.getElementById('tipo').value;
      const texto = document.getElementById('texto').value.trim();
      if(!texto){ alert('Por favor descreva seu relato.'); return; }
      const reports = getReports();
      const entry = { nome, bairro, tipo, texto, date: (new Date()).toLocaleString() };
      reports.push(entry);
      saveReports(reports);
      renderReports();
      form.reset();
      alert('Relato salvo localmente. Em breve integraremos com backend.');
    });
    document.getElementById('limpar').addEventListener('click', function(){ form.reset(); });
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderReports();
  });

  // Expose for other pages if needed
  window.Leitos = { getReports, saveReports };
})();
