(function () {
  var storageKey = 'dayfiles_contact_client_id_v1';

  function getClientId() {
    try {
      var existing = window.localStorage.getItem(storageKey);
      if (existing) {
        return existing;
      }
      var created = 'df-contact-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
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

  function applyTopicPrefill(form) {
    var params = new URLSearchParams(window.location.search);
    var topic = params.get('topic');
    var topicField = form.querySelector('[name="topic"]');
    if (topicField && topic && !topicField.value) {
      topicField.value = topic.slice(0, 160);
    }
  }

  function toPayload(form) {
    var formData = new FormData(form);
    return {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      topic: String(formData.get('topic') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      source_path: String(formData.get('source_path') || '').trim(),
      client_id: String(formData.get('client_id') || '').trim(),
      company_website: String(formData.get('company_website') || '').trim()
    };
  }

  function wireForm(form) {
    var status = form.querySelector('[data-contact-status]');
    var button = form.querySelector('button[type="submit"]');
    var topicField = form.querySelector('[name="topic"]');
    prepareHiddenFields(form);
    applyTopicPrefill(form);

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      prepareHiddenFields(form);

      if (button) {
        button.disabled = true;
      }
      setStatus(status, 'Sending your message...', null);

      try {
        var response = await fetch(form.action || '/api/contact', {
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
          throw new Error(data.error || 'We could not save your message right now.');
        }

        var preservedTopic = topicField ? topicField.value : '';
        form.reset();
        prepareHiddenFields(form);
        if (topicField) {
          topicField.value = preservedTopic;
        }
        setStatus(status, data.message || 'Thanks. Your message has been received.', 'success');
      } catch (error) {
        setStatus(status, error.message || 'We could not save your message right now.', 'error');
      } finally {
        if (button) {
          button.disabled = false;
        }
      }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-contact-form]'), wireForm);
})();
