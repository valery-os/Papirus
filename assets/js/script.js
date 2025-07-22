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
            $iconSearch.hide();
            $iconClose.show();
        }

        function hidePopup() {
            $searchPanel.removeClass("active");
            $fixedMenuOverlay.fadeOut(200);
            $popup.stop(true, true).fadeOut(200);
            $("body").removeClass("overflow");
            $iconSearch.show();
            $iconClose.hide();
            $suggestions.html('').hide();
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
            } else {
                $popup.stop(true, true).fadeOut(200);
            }
        }

        function bindEvents() {
            $input.on("input", handleSearchInput);

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
        let swiperBanners = null;

        function initSwiperBanners() {
            const screenWidth = window.innerWidth;

            if (swiperBanners !== null) {
                swiperBanners.destroy(true, true);
                swiperBanners = null;
            }

            const swiperOptions = screenWidth < 768 ? {
                spaceBetween: 10,
                freeMode: true,
                slidesPerView: 'auto',
            } : {
                spaceBetween: 10,
                slidesPerView: 1,
                loop: true,
                navigation: {
                    nextEl: ".offer__banners .slider-button-next",
                    prevEl: ".offer__banners .slider-button-prev",
                },
            };

            swiperBanners = new Swiper(".banners-slider", swiperOptions);
        }

        function debounce(func, wait = 100) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        initSwiperBanners();
        window.addEventListener('resize', debounce(initSwiperBanners, 200));
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
                $(this).addClass('hover');
                $(this).find('.product-card__hover-wrapp').fadeIn(200);
            },
            function () {
                $(this).removeClass('hover');
                $(this).find('.product-card__hover-wrapp').fadeOut(200);
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
            } else {
                $headerBottom.removeClass('fixed');
            }
        }
        toggleFixed();
        $(window).on('scroll.fixedHeader', toggleFixed);
    }



    function initScripts() {
        initStickyHeader();
        initLanguageSelect();
        initLiveSearch();
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
    }
    $(document).ready(initScripts);
})

