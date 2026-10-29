(() => {
  'use strict';

  const procedures = {
    cut: {
      name: 'Стрижка', price: 3000,
      image: '../assets/mascot-zhmykh-shaved.webp',
      alt: 'Жмых после стрижки: те же огромные глаза, острые уши и коротко стриженное тело',
      caption: 'Жмых после стрижки',
      title: 'Голова при нём.\nШуба отдельно.',
      description: 'Открываем кота под шерстью. Львиную важность и выразительные уши оставляем на месте.',
      quote: '«Меня стало меньше.\nЗначения — больше».'
    },
    nails: {
      name: 'Когти', price: 500,
      image: '../assets/mascot-nails.webp',
      alt: 'Жмых показывает когти на поднятой лапе рядом с когтерезом',
      caption: 'Жмых и его острые вопросы',
      title: 'Манеры мягче.\nЛапы всё те же.',
      description: 'Убираем лишнее с кончиков когтей. Диван пока не в курсе, но уже надеется.',
      quote: '«Я и раньше был нежный.\nПросто с последствиями».'
    },
    brush: {
      name: 'Вычёсывание', price: 1200,
      image: '../assets/mascot-brushed.webp',
      alt: 'Жмых с пушистым хвостом держит большую щётку для шерсти',
      caption: 'Жмых отделяется от дивана',
      title: 'Кот отдельно.\nВторой кот — в щётке.',
      description: 'Вычёсываем лишнюю шерсть. Жмых остаётся целиком, хотя по объёму трудно поверить.',
      quote: '«Это запасной я.\nНа случай холодов».'
    },
    teeth: {
      name: 'Зубки', price: 700,
      image: '../assets/mascot-teeth.webp',
      alt: 'Жмых широко улыбается и держит зубную щётку',
      caption: 'Жмых улыбается с подтекстом',
      title: 'Улыбка шире.\nПодозрения те же.',
      description: 'Знакомим зубки со щёткой. Жмых показывает результат всем, кто случайно оказался рядом.',
      quote: '«Теперь видно,\nчем я недоволен».'
    }
  };

  const form = document.querySelector('#grooming-form');
  const checkboxes = Array.from(form.querySelectorAll('input[name="procedure"]'));
  const totalOutput = document.querySelector('#total');
  const countOutput = document.querySelector('#selected-count');
  const image = document.querySelector('#procedure-image');
  const previewButtons = Array.from(document.querySelectorAll('[data-preview]'));
  const result = document.querySelector('#character-result');
  const resultText = document.querySelector('#result-text');
  const format = new Intl.NumberFormat('ru-RU');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let imageTimer;

  function setLines(element, text) {
    element.replaceChildren();
    text.split('\n').forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  }

  function preview(key) {
    if (!Object.hasOwn(procedures, key)) return;
    const item = procedures[key];
    previewButtons.forEach(button => {
      const active = button.dataset.preview === key;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#procedure-category').textContent = item.name;
    setLines(document.querySelector('#procedure-title'), item.title);
    document.querySelector('#procedure-description').textContent = item.description;
    setLines(document.querySelector('#procedure-quote'), item.quote);
    document.querySelector('#stage-caption').textContent = item.caption;
    clearTimeout(imageTimer);
    const replaceImage = () => {
      image.hidden = false;
      image.src = item.image;
      image.alt = item.alt;
      image.classList.remove('is-changing');
    };
    if (reducedMotion.matches || image.src.endsWith(item.image.replace('../', ''))) {
      replaceImage();
    } else {
      image.classList.add('is-changing');
      imageTimer = setTimeout(replaceImage, 140);
    }
  }

  image.addEventListener('error', () => {
    image.hidden = true;
    document.querySelector('#stage-caption').textContent = 'Портрет не загрузился. Выберите другую процедуру или обновите страницу.';
  });

  function selectedKeys() {
    return checkboxes.filter(input => input.checked).map(input => input.value);
  }

  function updateCalculation({ save = true } = {}) {
    const selected = selectedKeys();
    const total = selected.reduce((sum, key) => sum + procedures[key].price, 0);
    totalOutput.replaceChildren(document.createTextNode(`${format.format(total)} `));
    const currency = document.createElement('span');
    currency.textContent = '₽';
    totalOutput.append(currency);
    const count = selected.length;
    countOutput.textContent = count === 0 ? 'Пока без процедур' : `${count} ${count === 1 ? 'процедура' : 'процедуры'} в расчёте`;
    checkboxes.forEach(input => {
      input.closest('.service-option').querySelector('.selection-label').textContent = input.checked ? 'Выбрано' : 'Добавить';
    });
    result.hidden = true;
    if (save) {
      const url = new URL(window.location.href);
      if (selected.length) url.searchParams.set('procedures', selected.join(','));
      else url.searchParams.delete('procedures');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function restoreSelection() {
    const requested = (new URLSearchParams(window.location.search).get('procedures') || '').split(',');
    checkboxes.forEach(input => { input.checked = requested.includes(input.value); });
    updateCalculation({ save: false });
    const selected = selectedKeys();
    if (selected.length) preview(selected[selected.length - 1]);
  }

  previewButtons.forEach(button => button.addEventListener('click', () => preview(button.dataset.preview)));
  checkboxes.forEach(input => input.addEventListener('change', () => {
    if (input.checked) preview(input.value);
    updateCalculation();
  }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = selectedKeys();
    const total = selected.reduce((sum, key) => sum + procedures[key].price, 0);
    let description;
    if (!selected.length) {
      description = 'Жмых остался при своём: вся шерсть, все амбиции, ни рубля.';
    } else if (selected.length === 4) {
      description = 'Шерсть укрощена. Когти приличные. Зубки блестят. Характер, к счастью, родной.';
    } else if (selected.includes('cut')) {
      description = 'Голова царская. Попа на свободе. Жмых по-прежнему выше всего этого.';
    } else if (selected.includes('brush') && selected.includes('nails')) {
      description = 'Дивану вернули надежду. Жмыху оставили всю его пушистую важность.';
    } else if (selected.includes('teeth')) {
      description = 'Жмых улыбается так, будто это вы пришли к нему на осмотр.';
    } else if (selected.includes('brush')) {
      description = 'В щётке остался ещё один Жмых. Основной выглядит слегка удивлённым.';
    } else {
      description = 'Острые вопросы сняты. Жмых решает, какие задать следующими.';
    }
    resultText.textContent = `${description} Итого ${format.format(total)} ₽.`;
    result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
  });

  document.querySelector('.result-close').addEventListener('click', () => {
    result.hidden = true;
    form.querySelector('button[type="submit"]').focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !result.hidden) {
      result.hidden = true;
      form.querySelector('button[type="submit"]').focus();
    }
  });
  window.addEventListener('popstate', restoreSelection);
  restoreSelection();

  // Warm the four local portraits after the document is ready; no external requests.
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => Object.values(procedures).forEach(item => { const portrait = new Image(); portrait.src = item.image; }));
  }
})();
