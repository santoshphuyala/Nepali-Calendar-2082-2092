// Utility Functions
const Utils = (() => {
  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  }

  function showSpinner() {
    document.getElementById('spinner').classList.add('active');
  }

  function hideSpinner() {
    document.getElementById('spinner').classList.remove('active');
  }

  function openModal(title, content) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    modal.classList.add('active');
  }

  function closeModal() {
    document.getElementById('modal').classList.remove('active');
  }

  function confirm(message, callback) {
    if (window.confirm(message)) {
      callback();
    }
  }

  function formatCurrency(amount) {
    return `रु. ${amount.toLocaleString('ne-NP')}`;
  }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      const values = lines[i].split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      data.push(obj);
    }
    
    return data;
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return {
    showToast,
    showSpinner,
    hideSpinner,
    openModal,
    closeModal,
    confirm,
    formatCurrency,
    downloadJSON,
    parseCSV,
    debounce
  };
})();