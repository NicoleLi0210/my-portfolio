  <!-- Scripts -->
// =============================
//  Mobile Menu：漢堡 + 左側抽屜
// =============================
(function () {
  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobileNav");
  const root = document.documentElement;

  // 漢堡開關
  toggleBtn.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");

    // 鎖定 body 滾動
    root.style.overflow = isOpen ? "hidden" : "";
  });

  // 點到選單內的超連結 → 自動關閉選單
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      root.style.overflow = "";
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  // =============================
  //   次選單展開（雙層）
  // =============================
  const parents = mobileNav.querySelectorAll(".mobile-nav-item.has-children");

  parents.forEach((item) => {
    const btn = item.querySelector(".mobile-nav-parent");
    const submenu = item.querySelector(".mobile-nav-sublist");
    const chevron = item.querySelector(".mobile-nav-chevron");

    btn.addEventListener("click", () => {
      item.classList.toggle("open");
      const isOpen = item.classList.contains("open");

      submenu.style.maxHeight = isOpen ? submenu.scrollHeight + "px" : "0px";
      chevron.textContent = isOpen ? "▴" : "▾";
    });
  });
})();
</>

  <>
    // Scroll Reveal
    (function () {
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if (!('IntersectionObserver' in window)) {
        revealElements.forEach((el) => el.classList.add('is-visible'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0,
          rootMargin: '0px 0px -5% 0px',
        }
      );

      revealElements.forEach((el) => observer.observe(el));
    })();

    // Smooth scroll for anchor links（含次選單）
    (function () {
      const header = document.querySelector('.header');

      function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const headerOffset = header ? header.offsetHeight + 8 : 0;
        const rect = target.getBoundingClientRect();
        const offset = rect.top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      }

      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          const id = href.slice(1);
          if (!id) return;
          if (document.getElementById(id)) {
            e.preventDefault();
            smoothScrollTo(id);
          }
        });
      });
    })();

    // Nav submenu：桌機 hover、手機點擊展開
    (function () {
      const submenuItems = document.querySelectorAll('.nav-item.has-submenu');

      submenuItems.forEach((item) => {
        const trigger = item.querySelector('.nav-link');
        const links = item.querySelectorAll('.submenu a');

        // 手機：點主選單展開 / 收起
        trigger.addEventListener('click', (e) => {
          if (window.innerWidth <= 900) {
            e.preventDefault();
            item.classList.toggle('open');
          }
        });

        // 手機：點子選單連結後，自動把選單收起
        links.forEach((link) => {
          link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
              item.classList.remove('open');
            }
          });
        });
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
          submenuItems.forEach((item) => item.classList.remove('open'));
        }
      });
    })();

    // Skills flip cards：桌機 hover、手機滾動自動翻面
    (function () {
      const cards = document.querySelectorAll('.skill-card');
      if (!cards.length) return;

      // Desktop hover
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          if (window.innerWidth > 768) {
            card.classList.add('is-flipped');
          }
        });
        card.addEventListener('mouseleave', () => {
          if (window.innerWidth > 768) {
            card.classList.remove('is-flipped');
          }
        });
      });

      // Mobile：IntersectionObserver 控制翻面
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => {
            if (window.innerWidth > 768) return;
            entries.forEach((entry) => {
              entry.target.classList.toggle('is-flipped', entry.isIntersecting);
            });
          },
          { threshold: 0.6 }
        );

        cards.forEach((card) => io.observe(card));
      }
    })();

    // Tools 手機版 Slider
    (function () {
      const slider = document.getElementById('toolSlider');
      if (!slider) return;

      const prevBtn = document.getElementById('toolPrev');
      const nextBtn = document.getElementById('toolNext');
      const cards = Array.from(slider.querySelectorAll('.tool-mobile-card'));

      let activeIndex = 0;

      function clampIndex(i) {
        if (i < 0) return 0;
        if (i > cards.length - 1) return cards.length - 1;
        return i;
      }

      // 取目前卡片實際寬度（含 RWD）
      function getCardWidth() {
        const first = cards[0];
        return first ? first.getBoundingClientRect().width : slider.clientWidth;
      }

      function updateClasses() {
        cards.forEach((card, idx) => {
          card.classList.remove('is-active', 'is-prev', 'is-next');

          if (idx === activeIndex) {
            card.classList.add('is-active');
          } else if (idx === activeIndex - 1) {
            card.classList.add('is-prev');
          } else if (idx === activeIndex + 1) {
            card.classList.add('is-next');
          }
        });
      }

      function goTo(index, withScroll = true) {
        activeIndex = clampIndex(index);
        const cardWidth = getCardWidth();

        if (withScroll) {
          slider.scrollTo({
            left: activeIndex * cardWidth,
            behavior: 'smooth',
          });
        }

        updateClasses();
      }

      // 初始狀態
      goTo(0, false);

      // 左右箭頭
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          goTo(activeIndex - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          goTo(activeIndex + 1);
        });
      }

      // 手指滑動時，同步更新 activeIndex
      slider.addEventListener('scroll', () => {
        const cardWidth = getCardWidth();
        const scrolledIndex = Math.round(slider.scrollLeft / cardWidth);
        const newIndex = clampIndex(scrolledIndex);
        if (newIndex !== activeIndex) {
          activeIndex = newIndex;
          updateClasses();
        }
      });

      // 視窗縮放時，重新對齊目前那張
      window.addEventListener('resize', () => {
        goTo(activeIndex, true);
      });
    })();

    // 年齡／年資自動計算
    (function () {
      const birthYear = 1993;
      const birthMonth = 2;   // 2 月
      const startWorkYear = 2015;

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // 年紀：如果現在月份 < 生日月份 → 再 -1
      let age = year - birthYear;
      if (month < birthMonth) {
        age -= 1;
      }

      // 年資 = 目前西元年 - 2015
      const workYears = year - startWorkYear;

      const ageEl = document.getElementById('age');
      const workEl = document.getElementById('workYears');

      if (ageEl) ageEl.textContent = age;
      if (workEl) workEl.textContent = workYears;
    })();

