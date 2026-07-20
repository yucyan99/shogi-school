/**
 * =====================================================================
 * ゆうちゃんのオンライン将棋教室 - script.js
 * ---------------------------------------------------------------------
 * 実装内容:
 *  - ローディング画面の表示制御
 *  - ハンバーガーメニューの開閉（ESCキー対応・背景固定）
 *  - ヘッダーのスクロール時背景変更
 *  - スムーススクロール（ヘッダー分のoffset考慮）
 *  - ナビゲーションの現在位置ハイライト
 *  - スクロール演出（IntersectionObserverによるフェードイン）
 *  - 数字のカウントアップ演出
 *  - FAQアコーディオン（複数開閉可）
 *  - トップに戻るボタンの表示制御
 *
 * グローバル汚染防止のため、即時実行関数（IIFE）でスコープを閉じている。
 * ===================================================================== */
(() => {
  "use strict";

  /* ------------------------------------------------------------------
   * ユーティリティ
   * ------------------------------------------------------------------ */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /* ------------------------------------------------------------------
   * 1. ヘッダー：スクロールで背景を変更
   * ------------------------------------------------------------------ */
  const initHeaderScroll = () => {
    const header = $("#siteHeader");
    if (!header) return;

    const SCROLL_THRESHOLD = 40;

    const updateHeaderState = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    updateHeaderState();
    window.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateHeaderState);
    }, { passive: true });
  };

  /* ------------------------------------------------------------------
   * 2. ハンバーガーメニューの開閉
   * ------------------------------------------------------------------ */
  const initMobileNav = () => {
    const hamburgerBtn = $("#hamburgerBtn");
    const mobileNav = $("#mobileNav");
    if (!hamburgerBtn || !mobileNav) return;

    const openMenu = () => {
      mobileNav.classList.add("is-open");
      hamburgerBtn.classList.add("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      hamburgerBtn.setAttribute("aria-label", "メニューを閉じる");
      document.body.style.overflow = "hidden"; // 背景固定
    };

    const closeMenu = () => {
      mobileNav.classList.remove("is-open");
      hamburgerBtn.classList.remove("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    };

    const toggleMenu = () => {
      const isOpen = mobileNav.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    hamburgerBtn.addEventListener("click", toggleMenu);

    // メニュー内のリンクをクリックしたら閉じる
    $$(".mobile-nav__link", mobileNav).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // ESCキーで閉じる
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMenu();
        hamburgerBtn.focus();
      }
    });
  };

  /* ------------------------------------------------------------------
   * 3. スムーススクロール（ヘッダー分のoffsetを考慮）
   * ------------------------------------------------------------------ */
  const initSmoothScroll = () => {
    const header = $("#siteHeader");
    const headerHeight = header ? header.offsetHeight : 76;

    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        event.preventDefault();

        const targetPosition =
          targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      });
    });
  };

  /* ------------------------------------------------------------------
   * 4. ナビゲーションの現在位置ハイライト
   * ------------------------------------------------------------------ */
  const initActiveNavHighlight = () => {
    const navLinks = $$("[data-nav-link]");
    if (navLinks.length === 0) return;

    const sections = navLinks
      .map((link) => {
        const id = link.getAttribute("href");
        return id ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (sections.length === 0) return;

    const setActiveLink = (id) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  /* ------------------------------------------------------------------
   * 5. スクロール演出（フェードイン）
   * ------------------------------------------------------------------ */
  const initRevealAnimations = () => {
    const targets = $$(".reveal");
    if (targets.length === 0) return;

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
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    targets.forEach((target) => observer.observe(target));
  };

  /* ------------------------------------------------------------------
   * 6. FAQ アコーディオン（複数開閉可能）
   * ------------------------------------------------------------------ */
  const initFaqAccordion = () => {
    const questions = $$(".faq-item__question");
    if (questions.length === 0) return;

    questions.forEach((button) => {
      const answerId = button.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);
      if (!answer) return;

      button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
          button.setAttribute("aria-expanded", "false");
          answer.style.maxHeight = "0px";
        } else {
          button.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    });
  };

  /* ------------------------------------------------------------------
   * 7. トップへ戻るボタン
   * ------------------------------------------------------------------ */
  const initScrollTopButton = () => {
    const button = $("#scrollTopBtn");
    if (!button) return;

    const SHOW_THRESHOLD = 480;

    const updateVisibility = () => {
      if (window.scrollY > SHOW_THRESHOLD) {
        button.classList.add("is-visible");
      } else {
        button.classList.remove("is-visible");
      }
    };

    window.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateVisibility);
    }, { passive: true });

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    updateVisibility();
  };

  /* ------------------------------------------------------------------
   * 初期化処理
   * ------------------------------------------------------------------ */
  const init = () => {
    initHeaderScroll();
    initMobileNav();
    initSmoothScroll();
    initActiveNavHighlight();
    initRevealAnimations();
    initFaqAccordion();
    initScrollTopButton();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
