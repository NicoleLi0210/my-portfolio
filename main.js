// =============================
//  Mobile Menu：漢堡 + 左側抽屜
// =============================
(function () {
  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.getElementById("mobileNav");
  const root = document.documentElement;

  if (!toggleBtn || !mobileNav) return;

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

    if (!btn || !submenu || !chevron) return;

    // 預設收起
    submenu.style.maxHeight = "0px";

    btn.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");

      submenu.style.maxHeight = isOpen ? submenu.scrollHeight + "px" : "0px";
      chevron.textContent = isOpen ? "▴" : "▾";
    });
  });
})();

// =============================
//  Scroll Reveal
// =============================
(function () {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  revealElements.forEach((el) => observer.observe(el));
})();

// =============================
//  Anchor Smooth Scroll（含手機 / 桌機）
// =============================
(function () {
  const header = document.querySelector(".header");

  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const headerOffset = header ? header.offsetHeight + 8 : 0;
    const rect = target.getBoundingClientRect();
    const offset = rect.top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const id = href.slice(1);
      if (!id) return;
      if (document.getElementById(id)) {
        e.preventDefault();
        smoothScrollTo(id);
      }
    });
  });
})();

// =============================
//  Desktop Nav submenu：桌機 hover、手機點擊展開
//  （手機其實主要用側邊選單，這段只影響上方主選單）
// =============================
(function () {
  const submenuItems = document.querySelectorAll(".nav-item.has-submenu");
  if (!submenuItems.length) return;

  submenuItems.forEach((item) => {
    const trigger = item.querySelector(".nav-link");
    const links = item.querySelectorAll(".submenu a");
    if (!trigger) return;

    // 手機：點主選單展開 / 收起
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        item.classList.toggle("open");
      }
    });

    // 手機：點子選單連結後，自動把選單收起
    links.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          item.classList.remove("open");
        }
      });
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      submenuItems.forEach((item) => item.classList.remove("open"));
    }
  });
})();

// =============================
//  Skills flip cards：桌機 hover、手機滾動自動翻面
// =============================
(function () {
  const cards = document.querySelectorAll(".skill-card");
  if (!cards.length) return;

  // Desktop hover
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        card.classList.add("is-flipped");
      }
    });
    card.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        card.classList.remove("is-flipped");
      }
    });
  });

  // Mobile：IntersectionObserver 控制翻面
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (window.innerWidth > 768) return;
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-flipped", entry.isIntersecting);
        });
      },
      { threshold: 0.6 }
    );

    cards.forEach((card) => io.observe(card));
  }
})();

// =============================
//  Tools 手機版 Slider
// =============================
(function () {
  const slider = document.getElementById("toolSlider");
  if (!slider) return;

  const prevBtn = document.getElementById("toolPrev");
  const nextBtn = document.getElementById("toolNext");
  const cards = Array.from(slider.querySelectorAll(".tool-mobile-card"));

  if (!cards.length) return;

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
      card.classList.remove("is-active", "is-prev", "is-next");

      if (idx === activeIndex) {
        card.classList.add("is-active");
      } else if (idx === activeIndex - 1) {
        card.classList.add("is-prev");
      } else if (idx === activeIndex + 1) {
        card.classList.add("is-next");
      }
    });
  }

  function goTo(index, withScroll = true) {
    activeIndex = clampIndex(index);
    const cardWidth = getCardWidth();

    if (withScroll) {
      slider.scrollTo({
        left: activeIndex * cardWidth,
        behavior: "smooth",
      });
    }

    updateClasses();
  }

  // 初始狀態
  goTo(0, false);

  // 左右箭頭
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goTo(activeIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goTo(activeIndex + 1);
    });
  }

  // 手指滑動時，同步更新 activeIndex
  slider.addEventListener("scroll", () => {
    const cardWidth = getCardWidth();
    const scrolledIndex = Math.round(slider.scrollLeft / cardWidth);
    const newIndex = clampIndex(scrolledIndex);
    if (newIndex !== activeIndex) {
      activeIndex = newIndex;
      updateClasses();
    }
  });

  // 視窗縮放時，重新對齊目前那張
  window.addEventListener("resize", () => {
    goTo(activeIndex, true);
  });
})();

// =============================
//  年齡／年資自動計算
// =============================
(function () {
  const birthYear = 1993;
  const birthMonth = 2; // 2 月
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

  const ageEl = document.getElementById("age");
  const workEl = document.getElementById("workYears");

  if (ageEl) ageEl.textContent = age;
  if (workEl) workEl.textContent = workYears;
})();
// =============================
//  懸浮按鈕 + Contact 底部按鈕
// =============================
(function () {
  const floatingActions = document.getElementById("floatingActions");
  const contactSection = document.getElementById("contact");

  // 所有有 data-action 的按鈕：包含懸浮 & contact 區塊內按鈕
  const actionButtons = document.querySelectorAll("[data-action]");
  if (!actionButtons.length) return;

  const linkedinUrl =
    "https://www.linkedin.com/in/%E6%99%8F%E6%85%88-%E6%9D%8E-183172212";

  function handleAction(action) {
    switch (action) {
      case "contact": {
        // 聯絡我：直接開 LinkedIn
        window.open(linkedinUrl, "_blank", "noopener");
        break;
      }
      case "share": {
        const shareData = {
          title: document.title || "Nicole Li - Product Manager Portfolio",
          text: "這是 Nicole 的產品經理作品集網站。",
          url: window.location.href,
        };

        if (navigator.share) {
          // 手機 / 支援 Web Share API 的瀏覽器
          navigator.share(shareData).catch(() => {
            // 使用者取消就算了，不需要報錯
          });
        } else {
          // 簡單的 fallback：試著複製網址，不行就叫使用者手動
          const url = window.location.href;
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard
              .writeText(url)
              .then(() => {
                alert("已複製此頁網址，歡迎分享給其他人。");
              })
              .catch(() => {
                alert("請從瀏覽器網址列複製此頁網址進行分享。");
              });
          } else {
            alert("請從瀏覽器網址列複製此頁網址進行分享。");
          }
        }
        break;
      }
      case "top": {
        // 回到頂部
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        break;
      }
      default:
        break;
    }
  }

  // 綁定所有 data-action 按鈕的 click
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (!action) return;
      handleAction(action);
    });
  });

  // Contact 出現時隱藏懸浮按鈕，離開時再顯示
  if (floatingActions && contactSection && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== contactSection) return;

          if (entry.isIntersecting) {
            // Contact 出現在畫面時 → 隱藏懸浮按鈕
            floatingActions.classList.add("is-hidden");
          } else {
            // 離開 Contact → 顯示懸浮按鈕
            floatingActions.classList.remove("is-hidden");
          }
        });
      },
      {
        threshold: 0.15, // 大概有一小部分接觸到畫面就算「出現」
      }
    );

    io.observe(contactSection);
  }
})();


