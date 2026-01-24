// Register service worker for PWA installability & offline shell
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .catch(console.error);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var menu = document.querySelector('.menu');
  var overlay = document.getElementById('error-overlay');
  var btn = document.querySelector('.error-btn');
  if (menu && overlay && btn) {
    menu.addEventListener('click', function() {
      overlay.style.display = 'flex';
      overlay.focus && overlay.focus();
    });
    btn.addEventListener('click', function() {
      overlay.style.display = 'none';
    });
  }
});

// Bottom Sheet Menu
document.addEventListener('DOMContentLoaded', function() {
  var fabButton = document.querySelector('.fab');
  var bottomSheetOverlay = document.getElementById('bottom-sheet-overlay');
  var bottomSheet = document.getElementById('bottom-sheet');
  var errorOverlay = document.getElementById('error-overlay');
  var documentViewOverlay = document.getElementById('document-view-overlay');
  var documentViewSheet = document.getElementById('document-view-sheet');
  var documentViewHandle = document.querySelector('.document-view-handle');
  var bottomSheetItems = document.querySelectorAll('.bottom-sheet-item');
  
  if (fabButton && bottomSheetOverlay) {
    // Open bottom sheet
    fabButton.addEventListener('click', function(e) {
      e.stopPropagation();
      bottomSheetOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    // Close bottom sheet when clicking on overlay (but not on the sheet itself)
    bottomSheetOverlay.addEventListener('click', function(e) {
      if (e.target === bottomSheetOverlay) {
        closeBottomSheet();
      }
    });
    
    // Prevent closing when clicking inside the sheet
    bottomSheet.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    function closeBottomSheet() {
      bottomSheetOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // Handle menu item clicks
    bottomSheetItems.forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        var action = item.getAttribute('data-action');
        
        if (action === 'view-document') {
          // Open document view
          closeBottomSheet();
          setTimeout(function() {
            openDocumentView();
              // Scroll to top of document view
              documentViewSheet.scrollTop = 0;
          }, 300);
        } else if (action === 'error') {
          // Close menu and open error overlay
          closeBottomSheet();
          setTimeout(function() {
            if (errorOverlay) {
              errorOverlay.style.display = 'flex';
              errorOverlay.focus && errorOverlay.focus();
            }
          }, 300);
        }
      });
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && bottomSheetOverlay.classList.contains('active')) {
        closeBottomSheet();
      }
    });
  }
  
  // Document View Sheet
  function openDocumentView() {
    if (documentViewOverlay) {
      documentViewOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeDocumentView() {
    if (documentViewOverlay) {
      documentViewOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Close document view when clicking on overlay
  if (documentViewOverlay) {
    documentViewOverlay.addEventListener('click', function(e) {
      if (e.target === documentViewOverlay) {
        closeDocumentView();
      }
    });
    
    // Prevent closing when clicking inside the sheet
    if (documentViewSheet) {
      documentViewSheet.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
    
    // Close on handle click
    if (documentViewHandle) {
      documentViewHandle.addEventListener('click', function(e) {
        e.stopPropagation();
        closeDocumentView();
      });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && documentViewOverlay && documentViewOverlay.classList.contains('active')) {
        closeDocumentView();
      }
    });
  }
});