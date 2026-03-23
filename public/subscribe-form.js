(function () {
  var storageKey = 'dayfiles_subscriber_client_id_v1';

  function getClientId() {
    try {
      var existing = window.localStorage.getItem(storageKey);
      if (existing) {
        return existing;
      }
      var created = 'df-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      window.localStorage.setItem(storageKey, created);
      return created;
    } catch (error) {
      return '';
    }
  }

  function setStatus(node, message, tone) {
    if (!node) return;
    node.textContent = message || '';
    node.classList.remove('is-success', 'is-error');
    if (tone) {
      node.classList.add(tone === 'success' ? 'is-success' : 'is-error');
    }
  }

  function toPayload(form) {
    var formData = new FormData(form);
    return {
      email: String(formData.get('email') || '').trim(),
      consent_granted: formData.get('consent_granted') === 'true',
      lead_magnet_id: String(formData.get('lead_magnet_id') || '').trim(),
      source_path: String(formData.get('source_path') || '').trim(),
      client_id: String(formData.get('client_id') || '').trim(),
      company_website: String(formData.get('company_website') || '').trim()
    };
  }

  function prepareHiddenFields(form) {
    var sourcePath = form.querySelector('input[name="source_path"]');
    var clientId = form.querySelector('input[name="client_id"]');
    if (sourcePath) {
      sourcePath.value = window.location.pathname + window.location.search;
    }
    if (clientId) {
      clientId.value = getClientId();
    }
  }

  function wireForm(form) {
    var status = form.querySelector('[data-subscribe-status]');
    var button = form.querySelector('button[type="submit"]');
    prepareHiddenFields(form);

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      prepareHiddenFields(form);
      if (button) {
        button.disabled = true;
      }
      setStatus(status, 'Saving your subscription...', null);

      try {
        var response = await fetch(form.action || '/api/subscribe', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json'
          },
          body: JSON.stringify(toPayload(form))
        });

        var data = await response.json().catch(function () {
          return {};
        });

        if (!response.ok || !data.ok) {
          throw new Error(data.error || 'We could not save your subscription right now.');
        }

        form.reset();
        prepareHiddenFields(form);
        var consent = form.querySelector('input[name="consent_granted"]');
        if (consent) {
          consent.checked = true;
        }
        setStatus(status, data.message || 'You’re subscribed successfully.', 'success');
      } catch (error) {
        setStatus(status, error.message || 'We could not save your subscription right now.', 'error');
      } finally {
        if (button) {
          button.disabled = false;
        }
      }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-subscribe-form]'), wireForm);
})();
