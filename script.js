const menuToggle = document.querySelector('#menuToggle');
const mobileMenu = document.querySelector('#mobileMenu');
const bgmToggle = document.querySelector('#bgmToggle');
const bgm = document.querySelector('#bgm');
const readMoreBtn = document.querySelector('#readMoreBtn');
const promoText = document.querySelector('#promoText');
const tabButtons = document.querySelectorAll('.tab-btn');
const noticePanels = document.querySelectorAll('.notice-panel');

menuToggle.addEventListener('click', () => {
  const opened = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? '메뉴 닫기' : '메뉴 열기');
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '메뉴 열기');
  });
});

bgmToggle.addEventListener('click', async () => {
  if (bgm.paused) {
    try {
      await bgm.play();
      bgmToggle.textContent = 'BGM 끄기';
      bgmToggle.classList.add('active');
      bgmToggle.setAttribute('aria-pressed', 'true');
    } catch (error) {
      bgmToggle.textContent = '재생 차단됨';
      window.setTimeout(() => {
        bgmToggle.textContent = 'BGM 켜기';
      }, 1300);
    }
  } else {
    bgm.pause();
    bgmToggle.textContent = 'BGM 켜기';
    bgmToggle.classList.remove('active');
    bgmToggle.setAttribute('aria-pressed', 'false');
  }
});

readMoreBtn.addEventListener('click', () => {
  const expanded = !promoText.classList.toggle('collapsed');
  readMoreBtn.textContent = expanded ? '▲접기' : '▼펼쳐보기';
  readMoreBtn.setAttribute('aria-expanded', String(expanded));
});

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.tab;

    tabButtons.forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    noticePanels.forEach((panel) => {
      const isActive = panel.id === `tab-${target}`;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });
  });
});
