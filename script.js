const bgm = document.querySelector('#bgm');
const bgmToggle = document.querySelector('#bgmToggle');
const bgmSeek = document.querySelector('#bgmSeek');
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
const PANEL_ANIMATION_TIME = 240;

let modalCloseTimer = null;

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
  const willExpand = promoText.classList.contains('collapsed');

  promoText.classList.toggle('collapsed', !willExpand);

  readMoreBtn.textContent = willExpand ? '▲접기' : '▼펼쳐보기';
  readMoreBtn.setAttribute('aria-expanded', String(willExpand));
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

      if (isActive) {
        panel.hidden = false;

        requestAnimationFrame(() => {
          panel.classList.add('active');
        });
      } else {
        panel.classList.remove('active');

        window.setTimeout(() => {
          if (!panel.classList.contains('active')) {
            panel.hidden = true;
          }
        }, PANEL_ANIMATION_TIME);
      }
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