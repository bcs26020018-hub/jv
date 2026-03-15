(function () {
  'use strict';

  // ----- Navigation -----
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link, [data-section]');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  function showSection(sectionId) {
    sections.forEach(function (s) {
      s.classList.toggle('active', s.id === sectionId);
    });
    navLinks.forEach(function (link) {
      const target = link.getAttribute('data-section');
      link.classList.toggle('active', target === sectionId);
    });
    if (nav) nav.classList.remove('open');
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const target = link.getAttribute('data-section');
      if (target) {
        e.preventDefault();
        showSection(target);
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // ----- Campus Map -----
  const buildings = document.querySelectorAll('.map-building');
  const legendItems = document.querySelectorAll('.legend-item');
  const infoPlaceholder = document.querySelector('.map-info-placeholder');
  const infoContent = document.querySelector('.map-info-content');
  const infoName = document.querySelector('.map-info-name');
  const infoDesc = document.querySelector('.map-info-desc');

  let currentFilter = 'all';

  function setMapInfo(name, desc) {
    if (!infoPlaceholder || !infoContent || !infoName || !infoDesc) return;
    infoPlaceholder.classList.add('hidden');
    infoContent.classList.remove('hidden');
    infoName.textContent = name;
    infoDesc.textContent = desc;
  }

  function clearMapInfo() {
    if (!infoPlaceholder || !infoContent) return;
    infoPlaceholder.classList.remove('hidden');
    infoContent.classList.add('hidden');
  }

  buildings.forEach(function (b) {
    b.addEventListener('click', function () {
      const name = b.getAttribute('data-name');
      const desc = b.getAttribute('data-desc');
      buildings.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      if (name && desc) setMapInfo(name, desc);
    });
  });

  legendItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const filter = item.getAttribute('data-filter');
      currentFilter = filter;
      legendItems.forEach(function (x) { x.classList.remove('active'); });
      item.classList.add('active');
      buildings.forEach(function (b) {
        const category = b.classList.contains('academic') ? 'academic' : b.classList.contains('services') ? 'services' : 'recreation';
        const show = filter === 'all' || category === filter;
        b.style.display = show ? '' : 'none';
      });
      clearMapInfo();
      buildings.forEach(function (b) { b.classList.remove('active'); });
    });
  });

  // ----- Lost & Found Form -----
  const lostFoundForm = document.getElementById('lostfound-form');
  const lostFoundList = document.getElementById('lostfound-list');

  if (lostFoundForm && lostFoundList) {
    lostFoundForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const form = e.target;
      const type = form.querySelector('[name="type"]').value;
      const description = form.querySelector('[name="description"]').value;
      const location = form.querySelector('[name="location"]').value;
      const contact = form.querySelector('[name="contact"]').value;

      const li = document.createElement('li');
      li.className = 'lostfound-item ' + type;
      li.innerHTML =
        '<span class="item-type">' + (type === 'lost' ? 'Lost' : 'Found') + '</span>' +
        '<strong>' + escapeHtml(description) + '</strong> – ' + escapeHtml(location) + '. Contact: ' + escapeHtml(contact);
      lostFoundList.insertBefore(li, lostFoundList.firstChild);
      form.reset();
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ----- Chatbot -----
  const chatbotToggle = document.querySelector('.chatbot-toggle');
  const chatbotPanel = document.querySelector('.chatbot-panel');
  const chatbotClose = document.querySelector('.chatbot-close');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');

  function openChatbot() {
    if (chatbotPanel) chatbotPanel.classList.add('open');
    if (chatbotInput) setTimeout(function () { chatbotInput.focus(); }, 100);
  }

  function closeChatbot() {
    if (chatbotPanel) chatbotPanel.classList.remove('open');
  }

  if (chatbotToggle) chatbotToggle.addEventListener('click', openChatbot);
  if (chatbotClose) chatbotClose.addEventListener('click', closeChatbot);

  // Simple rule-based campus Q&A
  const campusResponses = [
    { keywords: ['library', 'hours', 'open', '24'], response: 'The UTS Library has 24/7 access during exam periods. Normal hours are 8am–10pm on weekdays. Check the Student Portal for current hours.' },
    { keywords: ['where is', 'building', 'location', 'find', 'how to get'], response: 'Use the Campus Map on this site—click any building for details. Reception in the Main Tower can give you directions and maps.' },
    { keywords: ['lost', 'found', 'wallet', 'keys', 'phone', 'bag'], response: 'Report lost or found items in the Lost & Found section above. You can also hand in found items at Reception.' },
    { keywords: ['event', 'events', 'career', 'workshop', 'sports'], response: 'Check the Events & Announcements section for upcoming career fairs, workshops, and campus events.' },
    { keywords: ['study', 'tips', 'exam', 'revision', 'resources'], response: 'Go to the Study Resources section for time management, note-taking, and exam prep tips, plus links to the portal and LMS.' },
    { keywords: ['cafe', 'food', 'coffee', 'eat'], response: 'The Student Café is in the central area—great for coffee and meals. There are also vending machines in the Tower and Engineering buildings.' },
    { keywords: ['gym', 'sport', 'fitness', 'pool'], response: 'The Sports Centre has a gym, pool, and courts. Check the Events section for club activities and opening hours.' },
    { keywords: ['reception', 'admin', 'id card', 'enrolment'], response: 'Reception in the Main Tower handles ID cards, general enquiries, and can point you to enrolment and admin services.' },
    { keywords: ['hello', 'hi', 'hey'], response: 'Hi! Ask me about the library, map, events, study tips, or lost and found.' },
    { keywords: ['help', 'what can you'], response: 'I can answer questions about UTS campus: buildings, library hours, events, study resources, lost and found, and where to find things. Try asking in plain English!' },
    { keywords: ['thanks', 'thank you'], response: 'You\'re welcome! Good luck with your studies.' }
  ];

  function getBotResponse(userText) {
    if (!userText || !userText.trim()) return 'Please type a question about campus.';
    const lower = userText.toLowerCase().trim();
    for (var i = 0; i < campusResponses.length; i++) {
      var r = campusResponses[i];
      var match = r.keywords.some(function (k) { return lower.indexOf(k) !== -1; });
      if (match) return r.response;
    }
    return 'I\'m not sure about that. Try asking about the library, campus map, events, study tips, or lost and found. You can also visit Reception in the Main Tower for help.';
  }

  function addMessage(text, isUser) {
    if (!chatbotMessages) return;
    const div = document.createElement('div');
    div.className = 'chat-message ' + (isUser ? 'user' : 'bot');
    const p = document.createElement('p');
    p.textContent = text;
    div.appendChild(p);
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  if (chatbotForm && chatbotInput) {
    chatbotForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const text = chatbotInput.value.trim();
      if (!text) return;
      addMessage(text, true);
      chatbotInput.value = '';
      var reply = getBotResponse(text);
      setTimeout(function () { addMessage(reply, false); }, 400);
    });
  }
})();
