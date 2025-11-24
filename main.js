document.addEventListener('DOMContentLoaded', () => {
  // ====================================================
  // 1. Scroll Reveal（共用）
  // ====================================================
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (revealEls.length > 0) {
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
  }

  // ====================================================
  // 2. 年齡 & 年資
  // ====================================================
  const birthYear = 1993;
  const workStartYear = 2015;
  const now = new Date();
  const ageEl = document.getElementById('age');
  const workYearsEl = document.getElementById('workYears');
  if (ageEl) ageEl.textContent = now.getFullYear() - birthYear;
  if (workYearsEl) workYearsEl.textContent = now.getFullYear() - workStartYear;

  // ====================================================
  // 3. 全站錨點：加上 smooth scroll（手機錨點動畫用）
  // ====================================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      event.preventDefault();

      // 如有需要可以在這裡加上 header 高度位移
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });

  // ====================================================
  // 4. 手機側邊選單
  // ====================================================
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

      subList.style.maxHeight = '0px';

      parentBtn.addEventListener('click', () => {
        const isExpanded = subList.style.maxHeight && subList.style.maxHeight !== '0px';
        if (isExpanded) {
          subList.style.maxHeight = '0px';
        } else {
          subList.style.maxHeight = subList.scrollHeight + 'px';
        }
      });
    });

    // 點錨點關閉側邊選單（smooth scroll 由上面的錨點邏輯處理）
    mobileNav.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ====================================================
  // 5. Skills Overview 翻面：桌機 hover、手機進 viewport 自動翻
  // ====================================================
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillCards.length > 0) {
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    skillCards.forEach(card => {
      const inner = card.querySelector('.skill-card-inner');
      if (!inner) return;

      if (supportsHover) {
        // 桌機：用 JS 幫忙加 class，避免只吃 :hover 卻被其他條件蓋掉
        card.addEventListener('mouseenter', () => {
          inner.classList.add('is-flipped');
        });
        card.addEventListener('mouseleave', () => {
          inner.classList.remove('is-flipped');
        });
      }
    });

    // 手機：用 IntersectionObserver，進畫面後自動翻面
    if (!supportsHover && 'IntersectionObserver' in window) {
      const skillObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const inner = entry.target.querySelector('.skill-card-inner');
              if (inner) {
                inner.classList.add('is-flipped');
              }
              // 只翻一次就好
              skillObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      skillCards.forEach(card => skillObserver.observe(card));
    }
  }

  // ====================================================
  // 6. 手機工具 slider（修掉垂直捲動 + 手滑也能更新 active 狀態）
  // ====================================================
  const slider = document.getElementById('toolSlider');
  const prevBtn = document.getElementById('toolPrev');
  const nextBtn = document.getElementById('toolNext');

  if (slider && prevBtn && nextBtn) {
    const cards = Array.from(slider.querySelectorAll('.tool-mobile-card'));
    let activeIndex = 0;

    const applyActiveClasses = () => {
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
    };

    const scrollToActive = () => {
      const activeCard = cards[activeIndex];
      if (!activeCard) return;

      const cardWidth = activeCard.offsetWidth;
      const targetLeft =
        activeCard.offsetLeft - (slider.clientWidth - cardWidth) / 2;

      slider.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });
    };

    const updateActiveAndScroll = () => {
      applyActiveClasses();
      scrollToActive();
    };

    // 初始狀態
    applyActiveClasses();
    scrollToActive();

    // 左右箭頭：只捲 slider 自己，不再用 scrollIntoView 影響整頁
    prevBtn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      updateActiveAndScroll();
    });

    nextBtn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      activeIndex = (activeIndex + 1) % cards.length;
      updateActiveAndScroll();
    });

    // 手滑 slider：根據「最靠近中線的卡片」更新 active 狀態
    let ticking = false;
    slider.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sliderRect = slider.getBoundingClientRect();
          const sliderCenter = sliderRect.left + sliderRect.width / 2;

          let nearestIndex = activeIndex;
          let minDistance = Number.POSITIVE_INFINITY;

          cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distance = Math.abs(cardCenter - sliderCenter);
            if (distance < minDistance) {
              minDistance = distance;
              nearestIndex = index;
            }
          });

          if (nearestIndex !== activeIndex) {
            activeIndex = nearestIndex;
            applyActiveClasses(); // 手滑只要更新樣式即可，不強制再捲一次
          }

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ====================================================
  // 7. 懸浮按鈕顯示 / 隱藏（看到 contact 就隱藏）
  // ====================================================
  const floatingActions = document.getElementById('floatingActions');
  const contactSection = document.getElementById('contact');

  if (floatingActions && contactSection && 'IntersectionObserver' in window) {
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

  // ====================================================
  // 8. 共用：share / top / contact 行為（浮動 + Contact 區塊按鈕）
  // ====================================================
  function handleAction(action) {
    switch (action) {
      case 'top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'contact': {
        const contact = document.getElementById('contact');
        if (contact) {
          contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      }

      case 'share': {
        const url = window.location.href;

        // 手機：優先原生分享
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
          prompt('請手動複製這段連結：', url);
        }
        break;
      }

      default:
        break;
    }
  }

  // 綁定所有 data-action 按鈕（浮動 + contact 文字版）
  const actionButtons = document.querySelectorAll('[data-action]');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action) handleAction(action);
    });
  });
});
