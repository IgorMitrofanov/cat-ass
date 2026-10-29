const procedures = {
  nails: { name: 'Коготочки', price: 500, image: 'mascot-nails.webp', quote: 'Теперь царапаю<br>только морально.', alt: 'Чудик гордо показывает аккуратно подстриженные коготочки' },
  brushed: { name: 'Вычёсывание', price: 1200, image: 'mascot-brushed.webp', quote: 'Из меня достали<br>ещё одного меня.', alt: 'Пушистый вычесанный чудик важно позирует с расчёской' },
  teeth: { name: 'Зубки', price: 700, image: 'mascot-teeth.webp', quote: 'Кусаю с ослепительной<br>улыбкой.', alt: 'Чудик улыбается чистыми белыми зубками и держит щётку' },
  shaved: { name: 'Стрижка', price: 3000, image: 'mascot-shaved.webp', quote: 'Характер под ноль<br>не берётся.', alt: 'Подстриженный Армен с пушистой головой, лапами-варежками и хвостом льва' }
};
const money = value => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
const tabs = [...document.querySelectorAll('.service-tab')];
const preview = document.querySelector('#service-preview');
const serviceImage = document.querySelector('#service-image');
const serviceQuote = document.querySelector('#service-quote');
const addButton = document.querySelector('#add-service');
const feedback = document.querySelector('#service-feedback');
const form = document.querySelector('#ticket-form');
const checks = [...form.querySelectorAll('input[name="procedure"]')];
const total = document.querySelector('#ticket-total');
const status = document.querySelector('#ticket-status');
const result = document.querySelector('#ticket-result');
const submitButton = document.querySelector('#ticket-submit');
let activeService = 'nails';
let imageVersion = 0;
let ticketText = '';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const selected = () => checks.filter(input => input.checked).map(input => input.value);

function syncAddButton() {
  const added = checks.find(input => input.value === activeService).checked;
  addButton.classList.toggle('added', added);
  addButton.innerHTML = `<span aria-hidden="true">${added ? '✓' : '+'}</span>`;
  addButton.setAttribute('aria-label', added ? `${procedures[activeService].name} уже в талоне` : `Добавить ${procedures[activeService].name.toLowerCase()} в талон`);
}
function showService(id, updateUrl = true) {
  if (!Object.hasOwn(procedures, id)) id = 'nails';
  activeService = id;
  tabs.forEach(tab => {
    const isActive = tab.dataset.service === id;
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });
  preview.setAttribute('aria-labelledby', `tab-${id}`);
  serviceQuote.innerHTML = procedures[id].quote;
  feedback.textContent = '';
  syncAddButton();
  const version = ++imageVersion;
  const next = new Image();
  if (!reducedMotion.matches) serviceImage.classList.add('switching');
  next.onload = () => {
    if (version !== imageVersion) return;
    serviceImage.src = next.src;
    serviceImage.alt = procedures[id].alt;
    serviceImage.classList.remove('switching');
  };
  next.onerror = () => {
    if (version !== imageVersion) return;
    serviceImage.classList.remove('switching');
    feedback.textContent = 'Кот спрятался. Выбери другую процедуру или обнови страницу.';
  };
  next.src = `assets/${procedures[id].image}`;
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('service', id);
    history.replaceState(null, '', url);
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showService(tab.dataset.service));
  tab.addEventListener('keydown', event => {
    let nextIndex;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    tabs[nextIndex].focus();
    showService(tabs[nextIndex].dataset.service);
  });
});
function updateTicket() {
  total.value = money(selected().reduce((sum, id) => sum + procedures[id].price, 0));
  result.hidden = true;
  ticketText = '';
  submitButton.innerHTML = 'Выписать талон <span aria-hidden="true">↗</span>';
  status.textContent = selected().length ? '' : 'Выбери хотя бы одну процедуру. Даже коту нужен план.';
  syncAddButton();
}
checks.forEach(input => input.addEventListener('change', updateTicket));
addButton.addEventListener('click', () => {
  const input = checks.find(item => item.value === activeService);
  input.checked = true;
  updateTicket();
  feedback.textContent = `${procedures[activeService].name} в талоне. Он ждёт ниже.`;
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const ids = selected();
  if (!ids.length) {
    status.textContent = 'Выбери хотя бы одну процедуру. Даже коту нужен план.';
    checks[0].focus();
    return;
  }
  ticketText = ['КОШАЧЬЕ ОЧКО', 'Шуточный талон на красоту', '', ...ids.map(id => `${procedures[id].name}: ${money(procedures[id].price)}`), '', `Итого: ${money(ids.reduce((sum, id) => sum + procedures[id].price, 0))}`, 'Осуждающий взгляд: в подарок.', '', 'Это шутка, а не настоящая запись. Кот согласия не давал.'].join('\n');
  result.hidden = false;
  status.textContent = 'Талон готов. Никуда не отправлен, никто не побрит.';
  submitButton.innerHTML = 'Талон выписан <span aria-hidden="true">✓</span>';
});
document.querySelector('#copy-ticket').addEventListener('click', async () => {
  if (!ticketText) return;
  try {
    await navigator.clipboard.writeText(ticketText);
    status.textContent = 'Талон скопирован. Можно показать коту.';
  } catch {
    const blob = new Blob([ticketText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: 'talon-krasoty.txt' });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Копирование недоступно. Талон сохранён текстовым файлом.';
  }
});
const petButton = document.querySelector('.mascot-button');
const speech = document.querySelector('.hero-speech');
const petReplies = ['Ладно.<br>Ещё за ушком.', 'Это входит<br>в стоимость?', 'Руки убери.<br>Нет, верни.', 'Мур.<br>Никому не говори.', 'Я вообще-то<br>и так красивый.'];
let petCount = 0;
let petTimeout;
petButton.addEventListener('click', () => {
  speech.innerHTML = petReplies[petCount++ % petReplies.length];
  petButton.classList.add('is-petted');
  clearTimeout(petTimeout);
  petTimeout = setTimeout(() => petButton.classList.remove('is-petted'), 220);
});
showService(new URLSearchParams(location.search).get('service') || 'nails', false);
document.querySelector('#year').textContent = new Date().getFullYear();
