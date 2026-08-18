(function () {
    const checkbox = document.getElementById('viewToggle');
    if (!checkbox){
        return;
    } 
  
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        window.location.href = 'simple/index.html';
      }
    });
  })();