document.addEventListener('DOMContentLoaded', function() {
  (function () {
    "use strict";

    let forms = document.querySelectorAll('.php-email-form');

    forms.forEach(function(e) {
      e.addEventListener('submit', function(event) {
        event.preventDefault();

        let thisForm = this;
        let action = thisForm.getAttribute('action');
        
        if (!action) {
          displayError(thisForm, 'The form action property is not set!');
          return;
        }

        thisForm.querySelector('.loading').classList.add('d-block');
        thisForm.querySelector('.error-message').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.remove('d-block');

        let formData = new FormData(thisForm);

        php_email_form_submit(thisForm, action, formData);
      });
    });

    function php_email_form_submit(thisForm, action, formData) {
      fetch(action, {
        method: 'POST',
        body: formData,
        headers: {'X-Requested-With': 'XMLHttpRequest'}
      })
      .then(response => {
        if (response.ok) {
          return response.json(); // Changed from .text() to .json()
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        // Check if the response contains "ok": true instead of expecting just "OK"
        if (data && data.ok === true) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your message has been sent successfully!',
            confirmButtonColor: '#304add'
          });
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data.error || 'Form submission failed');
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
          confirmButtonColor: '#304add'
        });
        displayError(thisForm, error);
      });
    }

    function displayError(thisForm, error) {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.error-message').innerHTML = error.message || error;
      thisForm.querySelector('.error-message').classList.add('d-block');
    }

  })();
});
