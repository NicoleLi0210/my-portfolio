document.addEventListener('DOMContentLoaded', () => {
  // ===== Scroll Reveal =====
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  // ===== 年齡 & 年資 =====
  const birthYear = 1993;
  const workStartYear = 2015;
  const now = new Date();
  const ageEl = document.getElementById('age');
  const workYearsEl = document.getElementById('workYears');
  if (ageEl) ageEl.textContent = now.getFullYear() - birthYear;
  if (workYearsEl) workYearsEl.textContent = now.getFullYear() - workStartYear;

  // ===== 手機側邊選單 =====
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // 第二層展開/收合
    mobileNav.querySelectorAll('.mobile-nav-item.has-children').forEach(item => {
      const parentBtn = item.querySelector('.mobile-nav-parent');
      const subList = item.querySelector('.mobile-nav-sublist');
      if (!parentBtn || !subList) return;

      parentBtn.addEventListener('click', () => {
        const isExpanded = subList.style.maxHeight && subList.style.maxHeight !== '0px';
        if (isExpanded) {
          subList.style.maxHeight = '0px';
        } else {
          subList.style.maxHeight = subList.scrollHeight + 'px';
        }
      });
    });

    // 點錨點關閉側邊選單
    mobileNav.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== 工具 mobile slider（如果有的話）=====
  const slider = document.getElementById('toolSlider');
  const prevBtn = document.getElementById('toolPrev');
  const nextBtn = document.getElementById('toolNext');

  if (slider && prevBtn && nextBtn) {
    const cards = Array.from(slider.querySelectorAll('.tool-mobile-card'));
    let activeIndex = 0;

    const updateActive = () => {
      cards.forEach((card, index) => {
        card.classList.remove('is-active', 'is-prev', 'is-next');
        if (index === activeIndex) {
          card.classList.add('is-active');
        } else if (index === activeIndex - 1) {
          card.classList.add('is-prev');
        } else if (index === activeIndex + 1) {
          card.classList.add('is-next');
        }
      });
      cards[activeIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    };

    updateActive();

    prevBtn.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      updateActive();
    });

    nextBtn.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % cards.length;
      updateActive();
    });
  }

  // ===== 懸浮按鈕顯示/隱藏 =====
  const floatingActions = document.getElementById('floatingActions');
  const contactSection = document.getElementById('contact');

  if (floatingActions && contactSection) {
    const contactObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            floatingActions.classList.add('is-hidden');   // 看到 contact：隱藏懸浮
          } else {
            floatingActions.classList.remove('is-hidden');
          }
        });
      },
      { threshold: 0.3 }
    );
    contactObserver.observe(contactSection);
  }

  // ===== 共用：share / top / contact 行為 =====
  function handleAction(action) {
    switch (action) {
      case 'top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'contact':
        const contact = document.getElementById('contact');
        if (contact) {
          contact.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 'share': {
        const url = window.location.href;

        // 手機優先用原生分享
        if (window.innerWidth < 768 && navigator.share) {
          navigator
            .share({
              title: document.title,
              url
            })
            .catch(() => {});
          return;
        }

        // 桌機：複製連結 + 提示
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(url)
            .then(() => {
              alert('連結已複製，歡迎分享給對這份作品集有興趣的人。');
            })
            .catch(() => {
              prompt('無法自動複製，請手動複製這段連結：', url);
            });
        } else {
          // 更舊的瀏覽器
          prompt('請手動複製這段連結：', url);
        }
        break;
      }

      default:
        break;
    }
  }

  // 把所有 data-action 按鈕（浮動 + contact 文字版）一起綁定
  const actionButtons = document.querySelectorAll('[data-action]');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action) handleAction(action);
    });
  });
});
