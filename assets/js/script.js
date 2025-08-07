jQuery(function ($) {
    function initStickyHeader() {
        const $target = $('.header__mobile-wrapp');
        if ($target.length === 0) return;

        const offsetTop = $target.offset().top;

        function handleScroll() {
            if ($(window).scrollTop() >= offsetTop) {
                $target.addClass('fixed');
            } else {
                $target.removeClass('fixed');
            }
        }

        $(window).on('scroll', handleScroll);
    }

    function initLanguageSelect() {
        const $select = $('#language-select');
        if ($select.length === 0) return;

        $select.niceSelect();
    }

    function initLiveSearch() {
        const $input = $(".search-frm__input");
        const $popup = $(".search-live");
        const $clearBtn = $(".search-frm-clear");
        const $searchPanel = $(".js-search-panel");
        const $toggleBtn = $(".search-frm-toggle-icon");
        const $iconSearch = $toggleBtn.find(".icon-search");
        const $iconClose = $toggleBtn.find(".icon-close");
        const $fixedMenuOverlay = $(".fixed-menu-overlay");
        const $suggestions = $(".search-suggestions");

        if (!$input.length || !$popup.length) return;

        const suggestionsData = [
            "Папір", "Папір а5", "Папір а4", "Папір а3", "Папір кольоровий",
            "Папір для принтера", "Папір для офісу", "Канцелярські товари",
            "Канцелярські товари оптом", "Канцелярія", "Канцелярія оптом",
            "Папір для нотаток"
        ];

        function showPopup() {
            $searchPanel.addClass("active");
            $fixedMenuOverlay.fadeIn(200);
            $("body").addClass("overflow");
            $iconClose.show();
        }

        function hidePopup() {
            $fixedMenuOverlay.fadeOut(200);
            $popup.stop(true, true).fadeOut(200);
            $("body").removeClass("overflow");
            $iconClose.hide();
            $suggestions.html('').hide();
            $(".search-live__no-results").hide();
            $(".search-live__cats li").show();
            $(".search-live__list .search-live__item").show();
        }

        function handleSearchInput() {

            const val = $input.val().trim().toLowerCase();
            if (val.length === 0) {
                hidePopup();
                return;
            }

            showPopup();

            const matched = suggestionsData
                .filter(item => item.toLowerCase().includes(val))
                .slice(0, 5);

            if (matched.length > 0) {
                const highlighted = matched.map(item => {
                    const regex = new RegExp(`(${val})`, "gi");
                    return `<div class="suggestion-item">${item.replace(regex, "<span>$1</span>")}</div>`;
                }).join("");
                $suggestions.html(highlighted).show();
            } else {
                $suggestions.html("").hide();
            }

            let categoryMatchCount = 0;
            $(".search-live__cats li").each(function () {
                const $li = $(this);
                const text = $li.find("a").text().toLowerCase();
                const isMatch = text.includes(val);

                if (isMatch && categoryMatchCount < 5) {
                    $li.show();
                    categoryMatchCount++;
                } else {
                    $li.hide();
                }
            });

            let productMatchCount = 0;
            $(".search-live__list .search-live__item").each(function () {
                const $item = $(this);
                const title = $item.find(".search-live__info-title").text().toLowerCase();
                const isMatch = title.includes(val);

                if (isMatch) {
                    $item.show();
                    productMatchCount++;
                } else {
                    $item.hide();
                }
            });

            const hasMatches = matched.length > 0 || categoryMatchCount > 0 || productMatchCount > 0;
            if (hasMatches) {
                $popup.stop(true, true).fadeIn(200);
                $(".search-live__no-results").hide();
            } else {
                $popup.stop(true, true).fadeOut(200);
                $(".search-live__no-results").show();
            }
        }

        function bindEvents() {
            $input.on("input change", handleSearchInput);

            $(document).on("click", ".suggestion-item", function () {
                const cleanText = $(this).text();
                $input.val(cleanText);
                $suggestions.hide();
                hidePopup();
            });

            $clearBtn.on("click", function () {
                $input.val("").focus();
                hidePopup();
            });

            $iconClose.on("click", function () {
                if ($iconClose.is(":visible")) {
                    $input.val("").focus();
                    hidePopup();
                }
            });

            $iconSearch.on("click", showPopup);

            $(document).on("click", function (e) {
                if (!$(e.target).closest(".js-search-panel").length) {
                    hidePopup();
                }
            });

            $(document).on("keydown", function (e) {
                if (e.key === "Escape" || e.keyCode === 27) {
                    $input.val("");
                    hidePopup();
                }
            });
        }


        bindEvents();
    }


    function initLiveSearchHistory() {
        const HISTORY_KEY = 'liveSearchHistory';
        const MAX_HISTORY = 8;
        const $overlay = $('.fixed-menu-overlay-history');

        function getHistory() {
            try {
                return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            } catch {
                return [];
            }
        }

        function saveHistory(arr) {
            try {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, MAX_HISTORY)));
            } catch {}
        }

        function pushHistory(term) {
            if (!term) return;
            let hist = getHistory().filter(t => t.toLowerCase() !== term.toLowerCase());
            hist.unshift(term);
            saveHistory(hist);
        }

        function removeHistoryItem(term) {
            let hist = getHistory();
            hist = hist.filter(t => t.toLowerCase() !== term.toLowerCase());
            saveHistory(hist);
        }

        function showOverlay() {
            if ($overlay.length) {
                $('.js-search-panel').addClass("active");
                $overlay.stop(true).fadeIn(200);
            }
        }

        function hideOverlay() {
            if ($overlay.length) {
                $overlay.stop(true).fadeOut(200);
            }
        }

        function renderHistory() {
            const history = getHistory();
            const $box = $('.live-search-history');
            if (!history.length) {
                $('.js-search-panel').addClass("active");
                $overlay.stop(true).fadeIn(200);
                return false;
            } else {

            }

            const html = `
      <div class="history-list">
        ${history
                .map(item => `
          <div class="history-item" data-value="${item}">
            <span class="history-text">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.1274 12.1657L13.3239 12.165V7.35767M2 11.0156L4.04995 13.2228C4.1895 13.3729 4.37902 13.4491 4.5692 13.4491M4.5692 13.4491C4.74163 13.4491 4.9145 13.3866 5.05102 13.26L7.25891 11.2098M4.5692 13.4491C4.51849 12.8682 4.59033 11.8428 4.63258 11.4027C4.77504 9.30437 5.6627 7.34536 7.15892 5.84872C10.5502 2.45847 16.0669 2.45847 19.4572 5.84872C21.177 7.56857 22.0245 9.8357 21.9995 12.0949C21.9752 14.2894 21.1277 16.4764 19.457 18.147C17.8145 19.7894 15.6308 20.6939 13.3079 20.6939C10.9859 20.6939 8.80219 19.7896 7.15892 18.147" stroke="#8996A7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ${item}
             </span>
            <button type="button" class="history-remove" aria-label="Видалити запит">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75391 3.75786L12.2392 12.2431M3.76172 12.2422L12.247 3.75696" stroke="#8996A7" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
          </div>`).join('')}
      </div>
    `;

            if ($box.find('.history-list').length) {
                $box.find('.history-list').replaceWith($(html));
            } else {
                $box.find('.live-search-history__top').after(html);
            }

            $box.show();
            showOverlay();
            return true;
        }

        function hideHistory() {
            const $box = $('.live-search-history');
            $box.find('.history-list').remove();
            $box.hide();
            hideOverlay();
        }

        function init() {
            const $input = $('.search-frm__input');
            const $historyBox = $('.live-search-history');

            if (!$input.length || !$historyBox.length) return;

            let typingTimer = null;
            const typingDelay = 1000;

            $input.on('focus', function () {
                if ($input.val().trim() === '') {
                    renderHistory();
                }
            });

            $input.on('input', function () {
                const val = $input.val().trim();

                if (val !== '') {
                    hideHistory();
                } else {
                    renderHistory();
                }

                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    const val2 = $input.val().trim();
                    if (val2) {
                        pushHistory(val2);
                    }
                }, typingDelay);
            });


            $input.on('keydown', function (e) {
                if (e.key === 'Enter') {
                    const val = $input.val().trim();
                    if (val) {
                        pushHistory(val);
                    }
                }
            });

            $(document).on('click', '.history-item .history-text', function () {
                const val = $(this).parent().data('value').trim();
                if (!val) return;
                $input.val(val);
                pushHistory(val);
                hideHistory();
            });

            $(document).on('click', '.history-remove', function (e) {
                e.stopPropagation();
                const $parent = $(this).closest('.history-item');
                const val = $parent.data('value');
                if (!val) return;
                removeHistoryItem(val);
                $parent.remove();

                if ($historyBox.find('.history-item').length === 0) {
                    hideHistory();
                }
            });

            $(document).on('click', '.clear-history', function (e) {
                e.stopPropagation();
                $('.js-search-panel').removeClass("active");
                localStorage.removeItem(HISTORY_KEY);
                hideHistory();
            });


            $(document).on('click', function (e) {
                if (!$(e.target).closest('.search.js-search-panel').length) {
                    $('.js-search-panel').removeClass("active");
                    hideHistory();
                }
            });

            $overlay.on('click', function () {
                hideHistory();
            });
        }

        $(function () {
            init();
        });
    }


    function initInputCounters() {
        const counters = document.querySelectorAll(".input-counter");
        if (!counters.length) return;

        counters.forEach(counter => {
            const input = counter.querySelector(".input-counter__field");
            const plusBtn = counter.querySelector(".input-counter__btn--plus");
            const minusBtn = counter.querySelector(".input-counter__btn--minus");

            if (!input || !plusBtn || !minusBtn) return;

            plusBtn.addEventListener("click", () => {
                input.stepUp();
            });

            minusBtn.addEventListener("click", () => {
                if (parseInt(input.value) > parseInt(input.min || 0)) {
                    input.stepDown();
                }
            });
        });
    }

    function initBannersSwiperModule() {
        const swiperBanners = new Swiper(".banners-slider", {
            spaceBetween: 10,
            slidesPerView: 1,
            loop: true,
            navigation: {
                nextEl: ".offer__banners .slider-button-next",
                prevEl: ".offer__banners .slider-button-prev",
            },
        });
    }

    function initStockSlider() {
        const sliderElement = document.querySelector(".stock-slider");
        if (!sliderElement) return;

        new Swiper(sliderElement, {
            slidesPerView: 5,
            spaceBetween: 7,
            breakpoints: {
                0: {
                    slidesPerView: 'auto',
                    freeMode: true,
                },
                1365: {
                    slidesPerView: 5,
                    freeMode: false,
                }
            }
        });
    }

    function initNewsSlider() {
        const sliderElement = document.querySelector(".news-slider");
        if (!sliderElement) return;

        new Swiper(sliderElement, {
            slidesPerView: 4,
            spaceBetween: 30,
            breakpoints: {
                0: {
                    slidesPerView: 'auto',
                    freeMode: true,
                    spaceBetween: 10,
                },
                1201: {
                    spaceBetween: 20,
                    slidesPerView: 4,
                    freeMode: false,
                },
                1365: {
                    spaceBetween: 30,
                }
            }
        });
    }

    function initBrandsSliderModule() {
        let brandsSlider = null;

        function initBrandsSlider() {
            const width = window.innerWidth;

            if (width >= 576 && brandsSlider === null) {
                brandsSlider = new Swiper(".brands-slider", {
                    slidesPerView: 6,
                    spaceBetween: 5,
                    navigation: {
                        nextEl: ".brands .slider-button-next",
                        prevEl: ".brands .slider-button-prev",
                    },
                    breakpoints: {
                        576: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1200: { slidesPerView: 5 },
                        1641: { slidesPerView: 6 },
                    }
                });
            } else if (width < 576 && brandsSlider !== null) {
                brandsSlider.destroy(true, true);
                brandsSlider = null;
            }
        }

        function debounce(func, wait = 150) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        initBrandsSlider();
        window.addEventListener('resize', debounce(initBrandsSlider, 200));

        const $brandsBtn = $('.brands__btn');
        if ($brandsBtn.length) {
            $brandsBtn.on('click', function () {
                $('.brands .swiper-slide').fadeIn(0, function() {
                    $(this).css('display', 'flex');
                });
                $('.brands').addClass('active');
                $(this).remove();
            });
        }
    }

    function initTagsSliders() {
        const sliders = document.querySelectorAll('.tags-slider');
        if (!sliders.length) return;

        sliders.forEach((sliderEl) => {
            const tagsContainer = sliderEl.closest('.tags');
            if (!tagsContainer) return;

            const nextBtn = tagsContainer.querySelector('.slider-button-next');

            new Swiper(sliderEl, {
                slidesPerView: 'auto',
                freeMode: true,
                spaceBetween: 5,
                navigation: {
                    nextEl: nextBtn,
                },
            });
        });
    }

    function initTagsClickHandler() {
        $('.tags__tag').off('click').on('click', function () {
            const tagsWrapper = $(this).closest('.product-cards__tags');
            tagsWrapper.find('.tags__tag').not(this).removeClass('active');
            $(this).toggleClass('active');
        });
    }

    function initMarksSliders() {
        const sliders = document.querySelectorAll('.marks-slider');
        if (!sliders.length) return;

        sliders.forEach(el => {
            new Swiper(el, {
                slidesPerView: 'auto',
                spaceBetween: 5,
                freeMode: false,
                grabCursor: true,
            });
        });
    }

    function initProductCardsSliders() {
        const sliders = document.querySelectorAll('.product-cards-slider');
        if (!sliders.length) return;

        sliders.forEach(sliderEl => {
            new Swiper(sliderEl, {
                slidesPerView: 'auto',
                spaceBetween: 5,
                freeMode: true,
                grabCursor: true,
                scrollbar: {
                    el: sliderEl.querySelector(".swiper-scrollbar"),
                    draggable: true,
                },
                on: {
                    touchMove: function () {
                        sliderEl.classList.add('swiper-is-dragging');
                    },
                    touchEnd: function () {
                        setTimeout(() => {
                            sliderEl.classList.remove('swiper-is-dragging');
                        }, 100);
                    },
                }
            });
        });

        document.querySelectorAll('.product-cards__list').forEach((el, index, all) => {
            const total = all.length;
            el.style.zIndex = total - index;
        });
    }

    function setupHeartClickHandler() {
        $('.heart').on('click', function () {
            $(this).closest('.product-card').find('.heart').toggleClass('active');
        });
    }

    function setupProductCardHover() {
        $('.product-card').hover(
            function () {
                if ($(this).find('.product-card__hover-wrapp').length !== 0) {
                    $(this).addClass('hover');
                    $(this).find('.product-card__hover-wrapp').fadeIn(200);
                }
            },
            function () {
                if ($(this).find('.product-card__hover-wrapp').length !== 0) {
                    $(this).removeClass('hover');
                    $(this).find('.product-card__hover-wrapp').fadeOut(200);
                }
            }
        );
    }

    function setupSeoContentToggle() {
        const $btn = $('.seo-content__btn');
        const $moreText = $('.more-text');

        const expandText = $btn.find('span').text().trim();
        const collapseText = $btn.data('toggle-text');

        $btn.on('click', function () {
            $(this).closest('.seo-content').toggleClass('active');
            $moreText.slideToggle(300, function () {
                if ($moreText.is(':visible')) {
                    $btn.find('span').text(collapseText);
                } else {
                    $btn.find('span').text(expandText);
                }
            });
        });
    }

    function setupFooterMenuToggle() {
        if (window.innerWidth < 993) {
            $('.footer__menu-title').on('click', function () {
                $(this).toggleClass('active');
                $(this).next('.footer__menu-list').slideToggle(300);
            });
        }
    }

    function setupAuthPopup() {
        $(".open-auth-popup").on("click", function () {
            $(".auth-popup").fadeIn();
            $("html").addClass("overflow");
        });

        $(".auth-popup__close, .auth-popup__overlay").on("click", function () {
            $(".auth-popup").fadeOut();
            $("html").removeClass("overflow");
        });

        $(".auth-tab").on("click", function () {
            const tab = $(this).data("tab");

            $(".auth-tab").removeClass("active");
            $(this).addClass("active");

            $(".auth-tab-content").removeClass("active");
            $("#" + tab).addClass("active");
        });
    }

    function setupPasswordToggle() {
        $(".toggle-password").on("click", function () {
            const $input = $(this).siblings("input");
            const isPassword = $input.attr("type") === "password";
            $(this).toggleClass("active");
            $input.attr("type", isPassword ? "text" : "password");
        });
    }

    function setupCartPopupHover() {
        $('.popup-cart-parent').hover(
            function () {
                $('.popup-cart-wrapper').fadeIn(200);
            },
            function () {
                $('.popup-cart-wrapper').fadeOut(200);
            }
        );
    }

    function setupMobileMenuToggle() {
        $('.menu-btn').on('click', function () {
            $('.mobile-menu').toggleClass('active');
            $('.catalog-menu').removeClass('active');
            $('.fixed-mobile-menu-overlay').fadeToggle(200);
            $('.catalog-menu__inner-item').removeClass('active');
            $('.cat-menu-btn').removeClass('open');
            $('html').toggleClass('overflow');
        });

        $('.menu-btn-close').on('click', function () {
            $('.mobile-menu').removeClass('active');
            $('.catalog-menu').removeClass('active');
            $('.fixed-mobile-menu-overlay').fadeOut(200);
            $('.catalog-menu__inner-item').removeClass('active');
            $('.cat-menu-btn').removeClass('open');
            $('html').removeClass('overflow');
        })
    }

    function initCatalogMenu() {
        function initMenuPosition() {
            const $header = $("#header");
            const headerHeight = $header.height();
            $('.offer__cats-menu').css("top", headerHeight);
        }

        initMenuPosition();
        $(window).on('resize', initMenuPosition);

        $('.offer__cats-menu .offer__cats-list > li:not(.show-all)').on('click', function (e) {
            e.preventDefault();
            $('.offer__cats-menu .offer__cats-list > li').not(this).removeClass('active');
            $(this).addClass('active');
        });

        $('.more-view').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('ul').find('li').fadeIn(200);
            $(this).remove();
        });

        $('.offer__cats-main-link').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const $submenu = $(this).closest('.offer__cats-submenu');
            $submenu.find('li').fadeIn(200);
            $submenu.find('.more-view').remove();
            $(this).remove();
        });

        $('.show-all a').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('.offer__cats').find('.offer__cats-list > li').fadeIn(200);
            $(this).remove();
        });

        $('.fixed-cat-menu-overlay').on('click', closeOfferMenu);

        $('.catalog-menu__item').on('click', function (e) {
            e.preventDefault();
            $(this).next('.catalog-menu__inner-item').addClass('active');
            $('.cat-menu-btn').addClass('open');
        });

        $(document).on('click', '.cat-menu-btn:not(.open)', function () {
            $('.catalog-menu').toggleClass('active');
            $('.mobile-menu').addClass('active');
            $('.fixed-mobile-menu-overlay').fadeIn(200);
        });

        $(document).on('click', '.cat-menu-btn.open', function () {
            $('.catalog-menu__inner-item').removeClass('active');
            $('.cat-menu-btn').removeClass('open');
        });

        const $menu = $('.offer__cats-menu');
        const $btn = $('.header__catalog-btn');

        $btn.on('click', function (e) {
            e.preventDefault();
            $menu.fadeToggle(400);
            $('html').toggleClass('overflow');
            $btn.toggleClass('active');
        });

        $(document).on('click', function (e) {
            const $target = $(e.target);
            const clickInsideMenu = $target.closest('.offer__cats-menu .container').length > 0;
            const clickOnButton = $target.closest('.header__catalog-btn').length > 0;

            if ($menu.is(':visible') && !clickInsideMenu && !clickOnButton) {
                $menu.fadeOut(400);
                $('html').removeClass('overflow');
                $btn.removeClass('active');
            }
        });

        $('.catalog-menu__cats-block h4:not(.empty)').on('click', function () {
            $('.catalog-menu__cats-block h4').not(this).removeClass('active');
            $('.catalog-menu__cats-block ul').not($(this).next()).slideUp(300);
            $(this).toggleClass('active');
            $(this).next().slideToggle(300);
        });

        $('.offer__cats-item').on('click', function (e) {
            e.preventDefault();
        });

        $('.offer .offer__cats > ul > li').hover(
            function () {
                const $this = $(this);
                $('.offer .offer__cats-submenu').hide();
                $this.find('.offer__cats-submenu').css('display', 'flex');
                $('.offer .offer__cats > ul > li').removeClass('active');
                $this.addClass('active');
                $('.offer').addClass('active');
                $('.fixed-cat-menu-overlay').fadeIn(0);
                $('.offer .offer__cats-link').hide();
            }
        );

        $('.offer').mouseleave(closeOfferMenu);

        function closeOfferMenu() {
            $('.offer').removeClass('active');
            $('.offer .offer__cats > ul > li').removeClass('active');
            $('.offer .offer__cats-submenu').fadeOut(0);
            $('.fixed-cat-menu-overlay').fadeOut(0);
            $('.offer .offer__cats-link').show();
        }
    }

    function handleFixedHeader() {
        const $headerBottom = $('.header__bottom-wrapper');

        if ($headerBottom.length === 0) return; 

        const offsetTop = $headerBottom.offset().top;

        function toggleFixed() {
            if ($(window).scrollTop() >= offsetTop) {
                $headerBottom.addClass('fixed');
                $('.offer__cats-menu').css('top', $headerBottom.outerHeight());
            } else {
                $headerBottom.removeClass('fixed');
                $('.offer__cats-menu').css('top', $('.header').outerHeight());
            }
        }
        toggleFixed();
        $(window).on('scroll.fixedHeader', toggleFixed);
    }

    function initFormValidation(selector) {
        const $form = $(selector);
        if ($form.length === 0) return;

        const validators = {
            required: ($input) => {
                return $.trim($input.val()) !== '' ? null : 'Це поле є обовʼязковим.';
            },
            email: ($input) => {
                const v = $.trim($input.val());
                if (v === '') return null;
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(v) ? null : 'Невірний формат email.';
            },
            phone: ($input) => {
                const v = $.trim($input.val());
                if (v === '') return null;
                const cleaned = v.replace(/[\s\-()]/g, '');
                const re = /^\+?\d{5,20}$/;
                return re.test(cleaned) ? null : 'Невірний номер телефону.';
            },
            min: ($input, param) => {
                return $input.val().length >= parseInt(param, 10) ? null : `Мінімум ${param} символів.`;
            },
            match: ($input, selector) => {
                const $other = $(selector);
                if ($other.length === 0) return 'Нема з чим порівняти.';
                return $input.val() === $other.val() ? null : 'Не збігається.';
            }
        };

        function parseRules(str) {
            if (!str) return [];
            return str.split(',').map(r => {
                const [name, param] = r.split(':');
                return { name: $.trim(name), param: param ? $.trim(param) : null };
            });
        }

        function validateInput($input) {
            const ruleStr = $input.data('validate') || '';
            const rules = parseRules(ruleStr);
            for (const rule of rules) {
                const fn = validators[rule.name];
                if (!fn) continue;
                const err = fn($input, rule.param);
                if (err) return err;
            }
            return null;
        }

        function showError($input, message) {
            const $group = $input.closest('.form-group');
            const $error = $group.find('.validation-error').first();
            if (message) {
                $group.addClass('error-field');
                $input.addClass('invalid');
                if ($error.length) $error.text(message);
            } else {
                $group.removeClass('error-field');
                $input.removeClass('invalid');
                if ($error.length) $error.text('');
            }
        }

        $form.attr('novalidate', 'novalidate');
        const $inputs = $form.find('[data-validate]');

        $inputs.on('input blur', function () {
            const $inp = $(this);
            const err = validateInput($inp);
            showError($inp, err);
        });

        $form.find('.toggle-password').off('click').on('click', function () {
            const $btn = $(this);
            const $group = $btn.closest('.form-group');
            const $input = $group.find('input').first();
            if (!$input.length) return;
            if ($input.attr('type') === 'password') {
                $input.attr('type', 'text');
                $btn.attr('aria-pressed', 'true');
            } else {
                $input.attr('type', 'password');
                $btn.attr('aria-pressed', 'false');
            }
        });

        $form.on('submit', function (e) {
            let hasError = false;
            $inputs.each(function () {
                const $inp = $(this);
                const err = validateInput($inp);
                showError($inp, err);
                if (err) hasError = true;
            });
            if (hasError) {
                e.preventDefault();
                const $first = $form.find('.invalid').first();
                if ($first.length) $first.focus();
            }
        });

        return {
            validateInput: (el) => validateInput($(el)),
            showError: (el, msg) => showError($(el), msg)
        };
    }

    function initScripts() {
        initStickyHeader();
        initLanguageSelect();
        initLiveSearch();
        initLiveSearchHistory();
        initInputCounters();
        initBannersSwiperModule();
        initStockSlider();
        initNewsSlider();
        initBrandsSliderModule();
        initTagsSliders();
        initMarksSliders();
        initTagsClickHandler();
        initProductCardsSliders();
        setupHeartClickHandler();
        setupProductCardHover();
        setupSeoContentToggle();
        setupFooterMenuToggle();
        setupAuthPopup();
        setupPasswordToggle();
        setupCartPopupHover();
        setupMobileMenuToggle();
        initCatalogMenu();
        handleFixedHeader();
        initFormValidation('#form-register');
        initFormValidation('#form-login');
    }
    $(document).ready(initScripts);
})

