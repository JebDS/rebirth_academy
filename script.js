const bgm = document.querySelector('#bgm');
const bgmToggle = document.querySelector('#bgmToggle');
const bgmSeek = document.querySelector('#bgmSeek');
const bgmVolume = document.querySelector('#bgmVolume');
const bgmTime = document.querySelector('#bgmTime');

const readMoreBtn = document.querySelector('#readMoreBtn');
const promoText = document.querySelector('#promoText');

const tabButtons = document.querySelectorAll('.tab-btn');
const noticePanels = document.querySelectorAll('.notice-panel');
const noticeButtons = document.querySelectorAll('.notice-title-btn');

const noticeModal = document.querySelector('#noticeModal');
const modalTitle = document.querySelector('#modalTitle');
const modalBody = document.querySelector('#modalBody');
const modalClose = document.querySelector('#modalClose');

const MODAL_ANIMATION_TIME = 260;
const COLLAPSE_ANIMATION_TIME = 460;

let modalCloseTimer = null;
let collapseTimer = null;

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, '0')}:${String(remainSeconds).padStart(2, '0')}`;
};

const updateBgmTime = () => {
  const duration = bgm.duration || 0;
  const current = bgm.currentTime || 0;

  bgmTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  bgmSeek.value = duration ? String((current / duration) * 100) : '0';
};

if (bgmVolume) {
  bgm.volume = Number(bgmVolume.value);

  bgmVolume.addEventListener('input', () => {
    bgm.volume = Number(bgmVolume.value);
  });
}

bgm.addEventListener('loadedmetadata', updateBgmTime);
bgm.addEventListener('timeupdate', updateBgmTime);

bgm.addEventListener('ended', () => {
  bgmToggle.textContent = '▶';
  bgmToggle.setAttribute('aria-label', '배경음악 재생');
  bgmToggle.setAttribute('aria-pressed', 'false');
});

bgmToggle.addEventListener('click', async () => {
  if (bgm.paused) {
    try {
      await bgm.play();

      bgmToggle.textContent = 'Ⅱ';
      bgmToggle.setAttribute('aria-label', '배경음악 멈춤');
      bgmToggle.setAttribute('aria-pressed', 'true');
    } catch (error) {
      bgmToggle.textContent = '▶';
      bgmToggle.setAttribute('aria-label', '브라우저에서 재생이 차단되었습니다. 다시 재생');
      bgmToggle.setAttribute('aria-pressed', 'false');
    }
  } else {
    bgm.pause();

    bgmToggle.textContent = '▶';
    bgmToggle.setAttribute('aria-label', '배경음악 재생');
    bgmToggle.setAttribute('aria-pressed', 'false');
  }
});

bgmSeek.addEventListener('input', () => {
  if (!Number.isFinite(bgm.duration) || bgm.duration === 0) return;

  bgm.currentTime = (Number(bgmSeek.value) / 100) * bgm.duration;
});

readMoreBtn.addEventListener('click', () => {
  clearTimeout(collapseTimer);

  const isCollapsed = promoText.classList.contains('collapsed');

  if (isCollapsed) {
    promoText.classList.remove('fade-ready');

    requestAnimationFrame(() => {
      promoText.classList.remove('collapsed');
    });

    readMoreBtn.textContent = '▲접기';
    readMoreBtn.setAttribute('aria-expanded', 'true');
  } else {
    promoText.classList.remove('fade-ready');
    promoText.classList.add('collapsed');

    collapseTimer = window.setTimeout(() => {
      promoText.classList.add('fade-ready');
    }, COLLAPSE_ANIMATION_TIME);

    readMoreBtn.textContent = '▼펼쳐보기';
    readMoreBtn.setAttribute('aria-expanded', 'false');
  }
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

const openModal = (title, body) => {
  clearTimeout(modalCloseTimer);

  modalTitle.textContent = title;
  modalBody.textContent = body;
  modalClose.textContent = 'X';

  noticeModal.hidden = false;
  noticeModal.classList.remove('is-closing');

  requestAnimationFrame(() => {
    noticeModal.classList.add('is-open');
  });

  document.body.style.overflow = 'hidden';
  modalClose.focus();
};

const closeModal = () => {
  if (noticeModal.hidden) return;

  noticeModal.classList.remove('is-open');
  noticeModal.classList.add('is-closing');

  clearTimeout(modalCloseTimer);

  modalCloseTimer = window.setTimeout(() => {
    noticeModal.hidden = true;
    noticeModal.classList.remove('is-closing');
    document.body.style.overflow = '';
  }, MODAL_ANIMATION_TIME);
};

noticeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openModal(button.dataset.title, button.dataset.body);
  });
});

modalClose.addEventListener('click', closeModal);

noticeModal.addEventListener('click', (event) => {
  if (event.target === noticeModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !noticeModal.hidden) {
    closeModal();
  }
});