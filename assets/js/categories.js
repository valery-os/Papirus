jQuery(function($) {

    function showMoreCategories() {
        $(document).on('click', '.categories__item-show-more', function () {
            const $btn = $(this);
            const $wrapper = $btn.prev('.categories__item-list');

            if ($wrapper.length) {
                $wrapper.find('li:hidden').each(function () {
                    $(this).css('display', 'flex').hide().fadeIn();
                });
            }

            $btn.hide();
        });
    }

    function handleCategoryClick(e) {
        const $item = $(this);

        // Только если на мобилке
        if (window.innerWidth >= 575) return;

        e.preventDefault();

        $item.toggleClass('open');

        const $list = $item.find('.categories__item-list');

        if ($item.hasClass('open')) {
            $list.stop(true, true).css('display', 'flex').hide().slideDown();
        } else {
            $list.stop(true, true).slideUp(() => {
                $list.css('display', '');
            });
        }
    }

    function initCategories() {
        $(document).off('click', '.categories__item:not(.categories__item-empty)', handleCategoryClick);
        $(document).on('click', '.categories__item:not(.categories__item-empty)', handleCategoryClick);
    }

    function initScripts() {
        showMoreCategories();
        initCategories();
    }

    $(document).ready(initScripts);
    $(window).on('resize', initCategories);
});
