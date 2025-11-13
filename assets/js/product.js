jQuery(function ($) {

    function initSliderProduct() {
        var productSliderThumb = new Swiper(".product-slider-thumb", {
            spaceBetween: 10,
            slidesPerView: 7,
            navigation: {
                nextEl: ".product__gallery-thumb .slider-button-next",
                prevEl: ".product__gallery-thumb .slider-button-prev",
            },
            breakpoints: {
                320: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
                480: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                640: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                },
                991: {
                    slidesPerView: 6,
                    spaceBetween: 10,
                },
                1201: {
                    slidesPerView: 7,
                    spaceBetween: 10,
                },
            }

        });
        var productSlider = new Swiper(".product-slider", {
            slidesPerView: 1,
            spaceBetween: 10,
            thumbs: {
                swiper: productSliderThumb,
            },
            navigation: {
                nextEl: ".product__gallery-slider .slider-button-next",
                prevEl: ".product__gallery-slider .slider-button-prev",
            },
        });
    }

    function handleFixedProductMenu() {
        $headerBottom = $('.header__bottom-wrapper');
        const $productMenu = $('#product-menu');

        if ($productMenu.length === 0) return;

        const offsetTop = $headerBottom.offset().top;

        function toggleFixed() {
            if ($(window).scrollTop() >= offsetTop) {
                $productMenu.addClass('fixed');
                $productMenu.css('top', $headerBottom.outerHeight());
            } else {
                $productMenu.removeClass('fixed');
                $productMenu.css('top', 'auto');
            }
        }
        toggleFixed();
        $(window).on('scroll.fixedHeader', toggleFixed);
    }

    function showMoreDescription() {
        $('.product-about__description-btn').on('click', function() {
            $('.product-about__description-text').removeClass('product-about__description-text-hidden');
            $('.product-about__description-more').show();
            $('.product-about__column-description').addClass(('active'))
            $(this).hide();
            $('.product-about__description-btn-hide').show();
        });
    }

    function hideDescription() {
        $('.product-about__description-btn-hide').on('click', function() {
            $('.product-about__description-text').addClass('product-about__description-text-hidden');
            $('.product-about__description-more').hide();
            $('.product-about__column-description').removeClass('active');
            $(this).hide();
            $('.product-about__description-btn').show();
        });
    }

    function initRating() {
        const ratings = document.querySelectorAll('.rating.rating--to-set');

        if (!ratings.length) return;

        ratings.forEach(rating => {
            const ratingActive = rating.querySelector('.rating__active');
            const ratingItems = rating.querySelectorAll('.rating__item');
            const ratingText = rating.querySelector('.product-reviews__rating-text');

            const messages = {
                1: "Очень плохо",
                2: "Плохо",
                3: "Нормально",
                4: "Хороший товар!",
                5: "Отлично!"
            };

            function setRating(value) {
                const percent = (value / 5) * 100;
                ratingActive.style.width = percent + '%';
                if (ratingText) {
                    ratingText.textContent = messages[value] || '';
                }
            }

            ratingItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    setRating(item.value);
                });
                item.addEventListener('mouseleave', () => {
                    const checked = rating.querySelector('.rating__item:checked');
                    setRating(checked ? checked.value : 0);
                });
                item.addEventListener('click', () => {
                    setRating(item.value);
                });
            });

            const checked = rating.querySelector('.rating__item:checked');
            setRating(checked ? checked.value : 0);
        });
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

    function showMoreReviews() {
        const btn = document.querySelector('.product-reviews__more-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const hiddenReviews = document.querySelectorAll('.product-reviews__item.hidden');
            hiddenReviews.forEach(review => {
                review.classList.remove('hidden');
            });
            btn.parentNode.style.display = 'none';
            btn.remove();
        });
    }

    function initProductGallerySlider() {
        var galleryThumbs = new Swiper(".product-gallery-thumbs", {
            spaceBetween: 10,
            slidesPerView: 9,
            freeMode: true,
            watchSlidesProgress: true,
            breakpoints: {
                320: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
                360: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                480: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                },
                640: {
                    slidesPerView: 7,
                    spaceBetween: 10,
                },
                991: {
                    slidesPerView: 8,
                    spaceBetween: 10,
                },
                1201: {
                    slidesPerView: 9,
                    spaceBetween: 10,
                },
            }
        });

        var galleryMain = new Swiper(".product-gallery-main", {
            spaceBetween: 10,
            navigation: {
                nextEl: ".product-gallery-next",
                prevEl: ".product-gallery-prev",
            },
            thumbs: {
                swiper: galleryThumbs,
            },
        });
    }

    function initSwiperMaximize() {
        const $body = $('body');

        $(document).on('click', '.maximize-btn', function () {
            const swiperInstance = document.querySelector('.product-gallery-main').swiper; // твой Swiper
            const activeSlide = $('.product-gallery-main .swiper-slide-active');

            if (!activeSlide.hasClass('video-wrap')) {
                const img = activeSlide.find('img');
                if (img.length) {
                    $body.append(`
                    <div id="max-img" class="max-img-wrap">
                        <button type="button" class="close-max-img-btn js-close-max-img">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.28365 18.7176C4.89312 18.3271 4.89312 17.6939 5.28365 17.3034L17.3045 5.28256C17.695 4.89204 18.3282 4.89204 18.7187 5.28256C19.1092 5.67309 19.1092 6.30625 18.7187 6.69677L6.69786 18.7176C6.30733 19.1081 5.67417 19.1081 5.28365 18.7176Z" fill="#16489F"/>
                                <path d="M18.7162 18.7174C18.3257 19.108 17.6925 19.108 17.302 18.7174L5.28117 6.69662C4.89065 6.3061 4.89065 5.67293 5.28117 5.28241C5.6717 4.89189 6.30486 4.89189 6.69539 5.28241L18.7162 17.3032C19.1067 17.6938 19.1067 18.3269 18.7162 18.7174Z" fill="#16489F"/>
                            </svg>
                        </button>
                    </div>
                `);
                    $('#max-img').append(img.clone());
                }
            }
        });

        $(document).on('click', '.js-close-max-img', function () {
            $('#max-img').remove();
        });
    }

    function initGalleryPopup() {
        $(".product-slider .swiper-slide").on("click", function () {
            $(".gallery-popup").fadeIn();
            $("html").addClass("overflow");
        });

        $(".gallery-popup__close, .gallery-popup__overlay").on("click", function () {
            $(".gallery-popup").fadeOut();
            $("html").removeClass("overflow");
        });
    }

    function initProductMenuScroll() {
        jQuery(function($) {
            let lastScrollTop = 0;

            $('.product-menu__list a').on('click', function(e) {
                e.preventDefault();

                const $link = $(this);
                const targetId = $link.attr('href');
                if (!(targetId && targetId.startsWith('#') && $(targetId).length)) return;

                const headerHeight = $('.header__bottom-wrapper').outerHeight() || 0;
                const menuHeight = $('.product-menu__list').outerHeight() || 0;

                const currentScroll = $(window).scrollTop();

                const $prevActive = $link.closest('.product-menu__list').find('a.active');
                const prevHref = $prevActive.attr('href') || '';

                let extraOffset = currentScroll > lastScrollTop ? 130 : 50;

                if ( prevHref === '#info') {
                    extraOffset = 160;

                }
                console.log('extra - ' + extraOffset)
                const targetOffset = $(targetId).offset().top - headerHeight - menuHeight - extraOffset;

                console.log('target - ' + targetOffset);

                $('html, body').stop(true, true).animate({ scrollTop: targetOffset }, 600, 'swing');

                $link
                    .addClass('active')
                    .closest('.product-menu__list')
                    .find('a')
                    .not($link)
                    .removeClass('active');

                lastScrollTop = currentScroll;
            });

            $(window).on('scroll', function() {
                lastScrollTop = $(this).scrollTop();
            });
        });
    }


    function initShowProductActionsMenu() {
        const $target = $('.product__info-actions');
        const $menu = $('.product-menu__right');
        let isVisible = false;

        if ($target.length && $menu.length) {
            $(window).on('scroll', function() {
                const windowTop = $(window).scrollTop() + 100;
                const targetTop = $target.offset().top;

                if (windowTop >= targetTop) {
                    if (!isVisible) {
                        isVisible = true;
                        $menu.stop(true, true).css("display", "flex").hide().fadeIn(300);
                    }
                } else {
                    if (isVisible) {
                        isVisible = false;
                        $menu.stop(true, true).fadeOut(300, function() {
                            $(this).css("display", "none");
                        });
                    }
                }
            });
        }
    }

    function initScripts() {
        initSliderProduct();
        handleFixedProductMenu();
        initProductRelatedSliders();
        showMoreDescription();
        initRating();
        showMoreReviews();
        initProductGallerySlider();
        initSwiperMaximize();
        initGalleryPopup();
        initProductMenuScroll();
        initShowProductActionsMenu();
        hideDescription();
    }
    $(document).ready(initScripts);



})