function preloaderSlider() {
    const wrappers = document.querySelectorAll('.product-cards__list');

    wrappers.forEach(wrapper => {
        wrapper.classList.add('loading-slider');
    });
}

preloaderSlider();

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
                if ($(e.target).hasClass('fixed-menu-overlay')) {
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

                $('.offer__cats-menu').fadeOut();
                $('.header-cat-menu-overlay').fadeOut();
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
                if (!$(e.target).closest('.search.js-search-panel, .search-live, .live-search-history').length && $(e.target) == $('svg')) {
                    $('.js-search-panel').removeClass("active");
                    hideHistory();
                }
            });

            $overlay.on('click', function () {
                $('.js-search-panel').removeClass("active");
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
            if (brandsSlider === null) {
                brandsSlider = new Swiper(".brands-slider", {
                    slidesPerView: 2, // минимальное количество для мобилок
                    spaceBetween: 5,
                    navigation: {
                        nextEl: ".brands .slider-button-next",
                        prevEl: ".brands .slider-button-prev",
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 'auto',
                            freeMode: true,
                            spaceBetween: 10,
                        },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1200: { slidesPerView: 5 },
                        1641: { slidesPerView: 6 },
                    }
                });
            }
        }

        initBrandsSlider();

    }

    // function initBrandsSliderModule() {
    //     let brandsSlider = null;
    //
    //     function initBrandsSlider() {
    //         const width = window.innerWidth;
    //
    //         if (width >= 576 && brandsSlider === null) {
    //             brandsSlider = new Swiper(".brands-slider", {
    //                 slidesPerView: 6,
    //                 spaceBetween: 5,
    //                 navigation: {
    //                     nextEl: ".brands .slider-button-next",
    //                     prevEl: ".brands .slider-button-prev",
    //                 },
    //                 breakpoints: {
    //                     576: { slidesPerView: 2 },
    //                     768: { slidesPerView: 3 },
    //                     1024: { slidesPerView: 4 },
    //                     1200: { slidesPerView: 5 },
    //                     1641: { slidesPerView: 6 },
    //                 }
    //             });
    //         } else if (width < 576 && brandsSlider !== null) {
    //             brandsSlider.destroy(true, true);
    //             brandsSlider = null;
    //         }
    //     }
    //
    //     function debounce(func, wait = 150) {
    //         let timeout;
    //         return function (...args) {
    //             clearTimeout(timeout);
    //             timeout = setTimeout(() => func.apply(this, args), wait);
    //         };
    //     }
    //
    //     initBrandsSlider();
    //     window.addEventListener('resize', debounce(initBrandsSlider, 200));
    //
    //     const $brandsBtn = $('.brands__btn');
    //     if ($brandsBtn.length) {
    //         $brandsBtn.on('click', function () {
    //             $('.brands .swiper-slide').fadeIn(0, function() {
    //                 $(this).css('display', 'flex');
    //             });
    //             $('.brands').addClass('active');
    //             $(this).remove();
    //         });
    //     }
    // }

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
            });
        });
    }

    function initTooltipForDataElements() {
        const $elements = $('[data-tooltip]');
        if ($elements.length === 0) return;

        const $tooltip = $('<div id="tooltip-mark" class="tooltip-mark"></div>').appendTo('body');
        let tooltipTimer;

        $elements.on('mouseenter', function () {
            const $el = $(this);
            const text = $el.data('tooltip');
            if (!text) return;

            tooltipTimer = setTimeout(function () {
                $tooltip.text(text).addClass('show');

                const offset = $el.offset();
                const elWidth = $el.outerWidth();
                const tooltipWidth = $tooltip.outerWidth();
                const tooltipHeight = $tooltip.outerHeight();

                const top = offset.top - tooltipHeight + 17;
                const left = offset.left + elWidth / 2;

                $tooltip.css({
                    left: left + 'px',
                    top: top + 'px',
                    opacity: 1
                });
            }, 100);
        });

        $elements.on('mouseleave', function () {
            clearTimeout(tooltipTimer);
            $tooltip.removeClass('show').css('opacity', 0);
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
                    init: function () {
                        // когда слайдер полностью инициализирован — убираем прелоадер
                        const wrapper = sliderEl.closest('.product-cards__list');
                        if (wrapper) {
                            wrapper.classList.remove('loading-slider');
                        }
                    },
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
            $(this).toggleClass('active');
        });
    }

    function setupProductCardHover() {
        $('.product-card').hover(
            function () {
                const $card = $(this);

                const $imageLink = $card.find('.product-card__image');
                const newImg = $imageLink.data('img');
                const $img = $imageLink.find('img');

                if (newImg) {
                    $imageLink.attr('data-old-img', $img.attr('src'));
                    $img.attr('src', newImg);
                }

                if ($card.find('.product-card__hidden').length !== 0) {
                    $card.addClass('show');
                    $card.find('.product-card__hidden').fadeIn(200);
                } else {
                    $card.css('box-shadow', '0 0 10px 0 rgba(0, 0, 0, .12)');
                }
            },
            function () {
                const $card = $(this);
                const $imageLink = $card.find('.product-card__image');
                const oldImg = $imageLink.attr('data-old-img');
                const $img = $imageLink.find('img');

                if (oldImg) {
                    $img.attr('src', oldImg);
                }

                if ($card.find('.product-card__hidden').length !== 0) {
                    $card.removeClass('show');
                    $card.find('.product-card__hidden').fadeOut(200);
                } else {
                    $card.css('box-shadow', 'none');
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

    function setupProfileMenu() {
        $('.header__actions-btn-profile').hover(
            function () {
                $('.fixed-profile-menu-header').fadeIn(200);
            },
            function () {
                setTimeout(function () {
                    if (!$('.fixed-profile-menu-header').is(':hover')) {
                        $('.fixed-profile-menu-header').fadeOut(200);
                    }
                }, 500);
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

        $('.offer__cats-menu .offer__cats-list > li')
            .on('mouseenter', function (e) {
                console.log('hover');
                e.preventDefault();
                $('.offer__cats-menu .offer__cats-list > li').not(this).removeClass('active');
                $(this).addClass('active');
                if ($(this).find('.offer__cats-submenu').length === 0) {
                   $(this).closest('.container').addClass('empty-cat');
                } else {
                  $(this).closest('.container').removeClass('empty-cat');
                }
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
        let $header_height = $('.header').outerHeight();

        $btn.on('click', function (e) {
            e.preventDefault();
            $menu.fadeToggle();
            $('.header-cat-menu-overlay').fadeToggle();
            $('.offer__cats-list').css('max-height', `calc(100vh - ${$header_height}px)`);
            $('html').toggleClass('overflow');
            $btn.toggleClass('active');
        });

        $(window).on('resize', function () {
            $('.offer__cats-list').css('max-height', `calc(100vh - ${$('.header').outerHeight()}px)`);
        });

        $(document).on('click', function (e) {
            const $target = $(e.target);
            const clickInsideMenu = $target.closest('.offer__cats-menu .container').length > 0;
            const clickOnButton = $target.closest('.header__catalog-btn').length > 0;

            if ($menu.is(':visible') && !clickInsideMenu && !clickOnButton) {
                $menu.fadeOut();
                $('.header-cat-menu-overlay').fadeOut();
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
                $(this).addClass('active');
                if ($(this).find('.offer__cats-submenu').length === 0) {
                    $(this).closest('.offer').addClass('empty-cat');
                    console.log(3333)
                } else {
                    $(this).closest('.offer').removeClass('empty-cat');
                }
                // $('.offer .offer__cats-link').hide();
            }
        );

        $('.offer').mouseleave(closeOfferMenu);

        $(document)
            .on('mouseenter', '.offer.empty-cat .offer__cats', function() {
            })
            .on('mouseleave', '.offer.empty-cat .offer__cats', function() {
                closeOfferMenu();
            });
        function closeOfferMenu() {
            $('.offer').removeClass('active');
            $('.offer .offer__cats > ul > li').removeClass('active');
            $('.offer .offer__cats-submenu').fadeOut(0);
            $('.fixed-cat-menu-overlay').fadeOut(0);
            $('.offer .offer__cats-link').show();
        }
    }

    function showAllCategories() {
        $(document).on('click', '.offer__cats-list-button-more', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $parentList = $(this).closest('.offer__cats-list');

            $parentList.toggleClass('overflow');
            $(this).toggleClass('show');

            if ($(this).hasClass('show')) {
                $parentList.animate({
                    scrollTop: 0
                }, 400);
            }
        });
    }

    function handleFixedHeader() {
        const $headerBottom = $('.header__bottom-wrapper');

        if ($headerBottom.length === 0) return; 

        const offsetTop = $headerBottom.offset().top;

        function toggleFixed() {
            if ($(window).scrollTop() >= offsetTop) {
                $headerBottom.addClass('fixed');
                // $('.offer__cats-menu').css('top', $headerBottom.outerHeight());
            } else {
                $headerBottom.removeClass('fixed');
                // $('.offer__cats-menu').css('top', $('.header').outerHeight());
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
            },
            numeric: ($input) => {
                const v = $.trim($input.val());
                if (v === '') return null;
                const re = /^\d+$/;
                return re.test(v) ? null : 'Допускаються лише цифри.';
            },
            maxValue: ($input, param) => {
                const v = $.trim($input.val());
                if (v === '') return null;
                const num = parseFloat(v);
                const max = parseFloat(param);
                if (isNaN(num) || isNaN(max)) return 'Некоректне число.';
                return num <= max ? null : `Максимальне значення — ${max}.`;
            },
            maxValueBonus: ($input, param) => {
                const v = $.trim($input.val());
                if (v === '') return null;
                const num = parseFloat(v);
                const max = parseFloat(param);
                if (isNaN(num) || isNaN(max)) return 'Некоректне число.';
                return num <= max ? null : `Недостатньо бонусів для використання`;
            },
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

    function initResetPromocodeButton() {
        const $button = $('.added-promocode');
        if ($button.length === 0) return;

        $button.on('click', function () {
            const $cartSumList = $('.cart__sum-list');
            $cartSumList.find('.cart__sum-item.promo-discount').remove();

            const $form = $('#promocode-form');
            const $input = $form.find('input');
            const $group = $input.closest('.form-group');
            const $error = $group.find('.validation-error');
            const $buttonForm = $form.find('.cart__sum-promocode-form-btn');

            $buttonForm.removeClass('added-promocode').text('Застосувати');
            $form.removeClass('success');
            $input.val('');

            $group.removeClass('error-field');
            $input.removeClass('invalid');
            $error.text('');
            $form.removeClass('success');
        });
    };

    function initPromocodeForm() {
        const $form = $('#promocode-form');
        if ($form.length === 0) return;

        const $button = $form.find('.cart__sum-promocode-form-btn');
        const $input = $form.find('input');
        const $group = $input.closest('.form-group');
        const $error = $group.find('.validation-error');
        const $cartSumList = $('.cart__sum-list');

        const validCodes = {
            'SALE2025': 300.00,
            'DISCOUNT10': 150.00,
            'WELCOME': 100.00
        };

        $form.on('submit', function (e) {
            e.preventDefault();

            if ($button.hasClass('added-promocode')) {
                $cartSumList.find('.cart__sum-item.promo-discount').remove();
                $button.removeClass('added-promocode').text('Застосувати');
                $form.removeClass('success');
                $input.val('');
                return;
            }

            const code = $.trim($input.val());

            $group.removeClass('error-field');
            $input.removeClass('invalid');
            $error.text('');
            $form.removeClass('success');
            $cartSumList.find('.cart__sum-item.promo-discount').remove();

            if (code === '') {
                $group.addClass('error-field');
                $input.addClass('invalid');
                $error.text('Це поле є обовʼязковим.');
                return;
            }

            if (validCodes.hasOwnProperty(code)) {
                const discount = validCodes[code];

                const discountHtml = `
                <div class="cart__sum-item promo-discount">
                    <p class="cart__sum-item-title">
                        Знижка по промокоду:
                    </p>
                    <span class="cart__sum-item-value">
                        ${discount.toFixed(2)} ₴
                    </span>
                </div>
            `;

                const $target = $cartSumList.find('.cart__sum-item.cart__sum-item-full').first();
                if ($target.length) {
                    $(discountHtml).insertBefore($target);
                } else {
                    $cartSumList.append(discountHtml);
                }

                $form.addClass('success');
                $button.addClass('added-promocode').text('Відмінити');

            } else {
                $group.addClass('error-field');
                $input.addClass('invalid');
                $error.text('Промокод введено невірно');
            }
        });
    }


    document.querySelectorAll('textarea').forEach(el => {
        if (el.value.trim() !== '') {
            el.classList.add('has-value');
        }

        el.addEventListener('input', () => {
            if (el.value.trim() !== '') {
                el.classList.add('has-value');
            } else {
                el.classList.remove('has-value');
            }
        });
    });

    function startCountdown() {
        var $el = $('#countdown');
        if (!$el.length) return;

        var endTime = new Date();
        endTime.setHours(endTime.getHours() + 12);

        function updateTimer() {
            var now = new Date();
            var diff = Math.floor((endTime - now) / 1000);
            if(diff < 0) diff = 0;

            var hours = String(Math.floor(diff / 3600)).padStart(2,'0');
            var minutes = String(Math.floor((diff % 3600) / 60)).padStart(2,'0');
            var seconds = String(diff % 60).padStart(2,'0');

            $el.text('До конца осталось ' + hours + ':' + minutes + ':' + seconds);
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    function initSaleTimer() {
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);

        function updateTimer() {
            let now = new Date().getTime();
            let distance = endDate - now;

            if (distance <= 0) {
                $(".product__info-sale-red p").text("Акцію завершено");
                clearInterval(timerInterval);
                return;
            }

            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            hours = hours.toString().padStart(2, "0");
            minutes = minutes.toString().padStart(2, "0");
            seconds = seconds.toString().padStart(2, "0");

            $(".product__info-sale-red p").text(
                "Залишилось " + days + " дні " + hours + ":" + minutes + ":" + seconds + " сек"
            );
        }

        updateTimer();
        let timerInterval = setInterval(updateTimer, 1000);
    }

    function initProductRelatedSliders() {
        const sliders = document.querySelectorAll('.product-related-slider');
        if (!sliders.length) return;

        sliders.forEach(sliderEl => {
            new Swiper(sliderEl, {
                slidesPerView: 'auto',
                spaceBetween: 9,
                freeMode: true,
                grabCursor: true,
                scrollbar: {
                    el: sliderEl.querySelector(".swiper-scrollbar"),
                    draggable: true,
                },

            });
        });
    }

    function initProductRelatedSlidersHome() {
        const sliders = document.querySelectorAll('.product-related-slider-home');
        if (!sliders.length) return;

        sliders.forEach(sliderEl => {
            new Swiper(sliderEl, {
                slidesPerView: 6,
                spaceBetween: 9,
                grabCursor: true,
                breakpoints: {
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 5,
                        freeMode: true,
                    },
                    576: {
                        slidesPerView: 3,
                        spaceBetween: 5,
                        freeMode: true,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 7,
                        freeMode: false,
                    },
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 9,
                        freeMode: false,
                    },
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 9,
                        freeMode: false,
                    },
                    1400: {
                        slidesPerView: 6,
                        spaceBetween: 9,
                        freeMode: false,
                    }
                }

            });
        });
    }

    function initStrongerTooltips() {
        var $tooltip = $('#tooltip');
        var tooltipTimer;
        $('.stronger__item').on('mouseenter', function () {
            var $item = $(this);
            tooltipTimer = setTimeout(function () {
                $tooltip.text($item.data('tooltip'));
                var offset = $item.offset();
                var left = offset.left + $item.outerWidth() / 2;
                var top = offset.top ;
                $tooltip.css({
                    left: left + 'px',
                    top: top + 'px',
                    opacity: 1
                });
            }, 100);
        });
        $('.stronger__item').on('mouseleave', function () {
            clearTimeout(tooltipTimer);
            $tooltip.css('opacity', 0);
        });
    }

    function showAddedTooltip(target, text = 'Товар додан!') {
        var $target = $(target);

        $target.next('.added-tooltip').remove();

        var $tip = $('<div class="added-tooltip">' + text + '</div>');
        $('body').append($tip);

        var offset = $target.offset();
        var left = offset.left + $target.outerWidth() / 2;
        var top = offset.top - 8;

        $tip.css({
            left: left + 'px',
            top: top + 'px'
        }).addClass('show');

        var cartSvg = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.98926 19.1904C10.0408 19.1905 10.8936 20.0432 10.8936 21.0947C10.8931 22.1459 10.0405 22.998 8.98926 22.998C7.938 22.9979 7.08542 22.1459 7.08496 21.0947C7.08496 20.0432 7.93772 19.1905 8.98926 19.1904ZM20.0342 19.1904C21.0858 19.1904 21.9385 20.0431 21.9385 21.0947C21.938 22.146 21.0855 22.998 20.0342 22.998C18.9831 22.9977 18.1313 22.1458 18.1309 21.0947C18.1309 20.0433 18.9828 19.1907 20.0342 19.1904ZM8.98926 20.9902C8.93183 20.9903 8.88477 21.0373 8.88477 21.0947C8.88522 21.1518 8.93211 21.1981 8.98926 21.1982C9.04642 21.1982 9.09232 21.1518 9.09277 21.0947C9.09277 21.0373 9.0467 20.9903 8.98926 20.9902ZM20.0342 20.9902C19.9769 20.9905 19.9307 21.0374 19.9307 21.0947C19.9311 21.1517 19.9772 21.1979 20.0342 21.1982C20.0914 21.1982 20.1382 21.1518 20.1387 21.0947C20.1387 21.0372 20.0917 20.9902 20.0342 20.9902ZM5.12988 0.125977C5.4892 0.18959 5.78177 0.466857 5.85547 0.834961L6.71582 5.13281H7.58594C7.46579 5.6694 7.40042 6.22698 7.40039 6.7998C7.40039 10.997 10.8028 14.4002 15 14.4004C19.1972 14.4002 22.6006 10.997 22.6006 6.7998C22.6006 6.22698 22.5352 5.6694 22.415 5.13281H23.0469C23.3151 5.13281 23.5693 5.25232 23.7402 5.45898C23.8896 5.63968 23.9622 5.87038 23.9443 6.10156L23.9307 6.20117L22.3242 14.626L22.3232 14.6328C22.1901 15.3019 21.8254 15.9032 21.2939 16.3311C20.7667 16.7553 20.108 16.9817 19.4316 16.9727V16.9736H9.67188V16.9727C8.99562 16.9816 8.3367 16.7553 7.80957 16.3311C7.27849 15.9035 6.91451 15.3024 6.78125 14.6338L5.09473 6.20898L4.23438 1.91211H0.956055C0.459245 1.91201 0.055928 1.50849 0.0556641 1.01172C0.0556641 0.514723 0.459082 0.110451 0.956055 0.110352H4.97266L5.12988 0.125977ZM15 0.200195C18.6449 0.200199 21.5994 3.15491 21.5996 6.7998C21.5996 10.4449 18.6451 13.4004 15 13.4004C11.3549 13.4004 8.40039 10.4449 8.40039 6.7998C8.4006 3.1549 11.3551 0.200195 15 0.200195ZM19.7305 4.41406C19.4376 4.12126 18.9628 4.1212 18.6699 4.41406L14.3447 8.73926L11.9307 6.3252L11.874 6.27344C11.5794 6.03312 11.1447 6.05059 10.8701 6.3252C10.5956 6.59981 10.5781 7.03454 10.8184 7.3291L10.8701 7.38574L13.8145 10.3301L13.8711 10.3818C14.1656 10.6218 14.6005 10.6045 14.875 10.3301L19.7305 5.47461C20.0232 5.18187 20.0229 4.70699 19.7305 4.41406ZM21.6006 6.7998L21.5918 7.13965C21.5975 7.02722 21.5996 6.91365 21.5996 6.7998L21.5918 6.4707C21.5972 6.57973 21.6006 6.68945 21.6006 6.7998Z" fill="#16489F"/>
            </svg>
            `;
        if ($target.closest('.product-card').length) {
            $buttons_icon = $target.closest('.product-card').find('.btn-buy');
            $buttons_icon.find('svg').each(function () {
                $(this).replaceWith($(cartSvg).clone());
            });
            $buttons_icon.find('span').each(function () {
                $(this).text('В кошику');
            });
            $buttons_icon.addClass('in-cart');
        } else {
            $target.find('svg').each(function () {
                $(this).replaceWith($(cartSvg).clone());
            });
            $target.addClass('in-cart');
            $target.find('span').each(function () {
                $(this).text('В кошику');
            });
        }
        setTimeout(function () {
            $tip.fadeOut(200, function(){ $(this).remove(); });
        }, 2000);
    }

    function addReminder() {
        $(document).on('click', '.btn-reminder-product', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.added-tooltip').remove();
            var $target = $(this);
            if ($target.hasClass('active')) {
                return;
            }
            $target.closest('.product-card').find('.btn-reminder-product').addClass('active');
            // $target.addClass('active');
            $target.next('.added-tooltip').remove();
            var $tip = $('<div class="added-tooltip">Додано в нагадування!</div>');
            $('body').append($tip);

            var offset = $target.offset();
            var left = offset.left + $target.outerWidth() / 2;
            var top = offset.top - 8;

            $tip.css({
                left: left + 'px',
                top: top + 'px'
            }).addClass('show');
            setTimeout(function () {
                $tip.fadeOut(200, function(){ $(this).remove(); });
            }, 2000);
        });
    }

    function dropdownPhone() {
        $('.header__phone-arrow').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.header__phone-wrapper').toggleClass('active');
            $('.header__phone-dropdown').fadeToggle(300);
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.header__phone-wrapper').length) {
                $('.header__phone-wrapper').removeClass('active');
                $('.header__phone-dropdown').fadeOut(300);
            }
        });
    }

    function initColorOptionBtnSync() {
        $(document).on('click', '.color-option-btn', function () {
            const $btn = $(this).closest('.product-card').find('.color-option-btn');
            const $productCard = $btn.closest('.product-card');
            const $colorsBlocks = $productCard.find('.product-card__colors');
            const svgIcon = `
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.830643 7.70251L6.83 1.70316M6.82936 7.69699L0.830002 1.69763" stroke="#8996A7" stroke-width="1.5" stroke-linecap="round"/>
                </svg>`;

            const isOpen = $colorsBlocks.first().hasClass('open');

            if (!isOpen) {
                $colorsBlocks.each(function () {
                    const $colorsBlock = $(this);

                    const $hiddenLabels = $btn.nextAll('label.color-option').filter(function () {
                        return $(this).css('display') === 'none';
                    });

                    $productCard.find('.color-option-btn').each(function () {
                        if (!$(this).data('original-text')) {
                            $(this).data('original-text', $(this).find('span').html());
                        }
                    });

                    $hiddenLabels.each(function (index) {
                        $(this).fadeIn(200);
                    });

                    $colorsBlock.addClass('open');
                });

                $productCard.find('.color-option-btn span').html(svgIcon);

            } else {
                $colorsBlocks.each(function () {
                    const $colorsBlock = $(this);
                    const $hiddenLabels = $btn.nextAll('label.color-option').filter(function () {
                        return $(this).css('display') !== 'none';
                    });

                    $hiddenLabels.fadeOut(200);
                    $colorsBlock.removeClass('open');
                });

                $productCard.find('.color-option-btn').each(function () {
                    $(this).find('span').html($(this).data('original-text'));
                });
            }
        });
    }

    function changeImageColor() {
        $('.color-option').on('click', function () {
            console.log(333)
            const newImage = $(this).data('image');
            const $productCard = $(this).closest('.product-card');
            const $mainImage = $productCard.find('.image-color img');

            if (newImage) {
                $mainImage.attr('src', newImage);
            }
        });
    }

    function initReminderTooltip() {
        $(document).on('mouseenter', '.not-available .btn-buy:not(.active)', function() {
            var $el = $(this);

            var $tooltip = $('<div class="added-tooltip">Повідомити коли з\'явиться</div>').css({
                position: 'absolute',
                zIndex: 9999,
                whiteSpace: 'nowrap',
                display: 'none'
            }).appendTo('body');

            $tooltip.css({ display: 'block' });

            var offset = $el.offset();
            var elWidth = $el.outerWidth();
            var tooltipWidth = $tooltip.outerWidth();
            var tooltipHeight = $tooltip.outerHeight();

            var top = offset.top - 8;
            var left = offset.left + (elWidth / 2) ;

            $tooltip.css({
                top: top + 'px',
                left: left + 'px'
            }).fadeIn(200);

            $el.on('mouseleave.addedTooltip', function() {
                $tooltip.fadeOut(200, function() { $(this).remove(); });
                $el.off('mouseleave.addedTooltip');
            });
        });
    }

    function openProfileMenu() {
        $('.open-profile-menu').on('click', function (e) {
            $('.fixed-profile-menu').fadeToggle(200);
            $(document).on('click', function (e) {
                if (!$(e.target).closest('.fixed-profile-menu, .open-profile-menu').length) {
                    $('.fixed-profile-menu').fadeOut(200);
                }
            });
        });
    }

    function setMaxForCounters() {
        $('.input-counter .input-counter__field').each(function() {
            $(this).attr('max', 100).attr('min', 1);

            $(this).on('input', function() {
                let value = parseInt($(this).val(), 10);

                if (isNaN(value) || value < 1) {
                    $(this).val(1);
                } else if (value > 999) {
                    $(this).val(999);
                }
            });
        });
    }

    $('.btn-product-buy').on('click', function () {
        showAddedTooltip(this);
    });

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
        initTooltipForDataElements();
        initTagsClickHandler();
        initProductCardsSliders();
        setupHeartClickHandler();
        setupProductCardHover();
        setupSeoContentToggle();
        setupFooterMenuToggle();
        setupAuthPopup();
        setupPasswordToggle();
        setupCartPopupHover();
        setupProfileMenu();
        setupMobileMenuToggle();
        initCatalogMenu();
        showAllCategories();
        handleFixedHeader();
        startCountdown();
        initSaleTimer();
        initProductRelatedSliders();
        initProductRelatedSlidersHome();
        initStrongerTooltips();
        addReminder();
        dropdownPhone();
        initFormValidation('#form-register');
        initFormValidation('#form-login');
        initFormValidation('#form-review');
        initFormValidation('#cart-add-sku-form');
        initFormValidation('#cart-download');
        initFormValidation('#cart-form');
        initFormValidation('#contacts-form');
        initFormValidation('#profile-form');
        initFormValidation('#bonus-form');
        initPromocodeForm();
        initResetPromocodeButton();
        // initColorOptionBtnSync();
        changeImageColor();
        initReminderTooltip();
        openProfileMenu();
        setMaxForCounters();
    }
    $(document).ready(initScripts);
})

