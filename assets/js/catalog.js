jQuery(function ($) {
    function initFilterRange({
             sliderSelector = '#filter-range',
             inputMinSelector = '#filter-min',
             inputMaxSelector = '#filter-max',
             start = [200, 800],
             min = 0,
             max = 1000,
             step = 1
     } = {}) {
        const slider = document.querySelector(sliderSelector);
        const inputMin = document.querySelector(inputMinSelector);
        const inputMax = document.querySelector(inputMaxSelector);

        if (!slider || !inputMin || !inputMax) return;

        noUiSlider.create(slider, {
            start: start,
            connect: true,
            step: step,
            range: {
                min: min,
                max: max
            }
        });

        let sliderInitialized = false;

        slider.noUiSlider.on('update', function(values, handle){
            if(handle === 0) inputMin.value = Math.round(values[0]);
            else inputMax.value = Math.round(values[1]);

            const $form = $('#filter');
            if (!$form.length) return;

            if (sliderInitialized) {
                $form.addClass('loading');
                setTimeout(function () {
                    $form.removeClass('loading');
                }, 1000);
            }

            setTimeout(function () {
                sliderInitialized = true;
            }, 50); // небольшая задержка после загрузки
        });

        inputMin.addEventListener('change', function(){
            slider.noUiSlider.set([this.value, null]);
            const $form = $('#filter');

            if (!$form.length) return;
            $form.addClass('loading');
            setTimeout(function () {
                $form.removeClass('loading');
            }, 1000);
        });
        inputMax.addEventListener('change', function(){
            slider.noUiSlider.set([null, this.value]);
            const $form = $('#filter');

            if (!$form.length) return;
            $form.addClass('loading');
            setTimeout(function () {
                $form.removeClass('loading');
            }, 1000);
        });
    }

    function showMoreCheckboxes(limit = 10) {
        $('.filter__checkboxes').each(function () {
            $(this).find('.filter__checkbox').slice(limit).hide();
        });

        $(document).on('click', '.filter__checkbox-more', function () {
            let $btn = $(this);
            let $wrapper = $btn.prev('.filter__checkboxes');

            if ($wrapper.length) {
                $wrapper.find('.filter__checkbox:hidden').each(function () {
                    $(this).css("display", "flex").hide().fadeIn();
                });
            }

            $btn.hide();
        });
    }

    function filterItemOpen() {
        $(document).on('click', '.filter__item-head', function () {
            let $head = $(this);
            let $body = $head.next('.filter__item-body');
            if ($body.is(':visible')) {
                $body.slideUp(200);
                $head.removeClass('open');
            } else {
                $body.css('display', 'flex').hide().slideDown(200);
                $head.addClass('open');
            }
        });
    }

    function formatChecked() {
        $(document).on('click', '.formats__item', function () {
            $('.formats__item').removeClass('checked');
            $(this).addClass('checked');
        });
    }

    function brandsChecked() {
        $(document).on('click', '.catalog__brands-item-wrapper', function () {
            $('.catalog__brands-item-wrapper').removeClass('checked');
            $(this).addClass('checked');
        });
    }

    function initSort() {
        const $select = $('#sort-select');
        if ($select.length === 0) return;

        $select.niceSelect();
    }

    function initCatalogBrandSlider() {
        const sliderEl = document.querySelector('.catalog-brands-slider');
        if (!sliderEl) return;

        const sliderContainer = sliderEl.closest('.catalog__brands'); // или другой родительский блок, если нужен
        if (!sliderContainer) return;

        const nextBtn = sliderContainer.querySelector('.slider-button-next');
        const prevBtn = sliderContainer.querySelector('.slider-button-prev');
        new Swiper(sliderEl, {
            slidesPerView: 'auto',
            freeMode: true,
            spaceBetween: 5,
            navigation: {
                nextEl: nextBtn,
                prevEl: prevBtn,
            },
        });
    }

    function filterChoiceDelete() {
        $(document).on('click', '.filter__item-choice-delete', function () {
            const $item = $(this).closest('.filter__item-choice-item');
            const $wrapper = $item.closest('.filter__item-choice');

            $item.remove();

            if ($wrapper.find('.filter__item-choice-item').length < 1) {
                $wrapper.remove();
            }
            const $form = $('#filter');

            if (!$form.length) return;
            $form.addClass('loading');
            setTimeout(function () {
                $form.removeClass('loading');
            }, 1000);
        });
    }
    function filterChoiceReset() {
        $(document).on('click', '.filter__item-choice-reset', function () {
            const $wrapper = $('.filter__item-choice');
            $wrapper.remove();
            const $form = $('#filter');

            if (!$form.length) return;
            $form.addClass('loading');
            setTimeout(function () {
                $form.removeClass('loading');
            }, 1000);
        });
    }

    function setFilterListMaxHeight() {
        const windowWidth = $(window).width();

        if (windowWidth < 1649) {
            const headerHeight = $('.filter__header').outerHeight() || 0;
            const maxHeight = window.innerHeight - headerHeight;

            $('.filter__list').css('max-height', maxHeight + 'px');
        } else {
            $('.filter__list').css('max-height', '');
        }
    }

    function filterToggle() {
        $(document).on('click', '.filter-btn', function () {
            $('.filter').toggleClass('active');
            $('.fixed-filter-overlay').fadeToggle(100);
            $('html').toggleClass('overflow');
        });
    }

    function initFilterLoading() {
        const $form = $('#filter');

        if (!$form.length) return;

        $form.on('change input', function () {
            $form.addClass('loading');
            setTimeout(function () {
                $form.removeClass('loading');
            }, 1000);
        });


    }

    function syncProductCardColors() {
        $(document).on('change', '.product-card__colors input', function () {
            const $input = $(this);
            const value = $input.val();

            const $productCard = $input.closest('.product-card');

            if ($productCard.length) {
                $productCard.find('.product-card__colors input').each(function () {
                    if ($(this).val() === value) {
                        $(this).prop('checked', true);
                    } else {
                        $(this).prop('checked', false);
                    }
                });
            }
        });
    }

    function sortCatalogArrows() {
        $('.catalog__sort-arrows span').on('click', function() {
            $(this).siblings('span').removeClass('active');
            $(this).addClass('active');
        });
    }
    function initScripts() {
        initFilterRange({
            sliderSelector: '#filter-range',
            inputMinSelector: '#filter-min',
            inputMaxSelector: '#filter-max',
            start: [200, 800],
            min: 0,
            max: 1000,
            step: 10
        });
        showMoreCheckboxes();
        filterItemOpen();
        formatChecked();
        brandsChecked();
        initSort();
        initCatalogBrandSlider();
        filterChoiceDelete();
        filterChoiceReset();
        setFilterListMaxHeight();
        filterToggle();
        initFilterLoading()
        syncProductCardColors();
        sortCatalogArrows();
    }
    $(document).ready(initScripts);

    $(window).on('resize', function () {
        setFilterListMaxHeight();
    });

})