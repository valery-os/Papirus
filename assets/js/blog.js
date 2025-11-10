jQuery(function ($) {

    function initActionsTabs() {
        $('.actions-tab__item').on('click', function() {
            var $this = $(this);
            var target = '#actions-tab__content-' + $this.data('tab');

            $('.actions-tab__item').removeClass('actions-tab__item--active');
            $('.actions-tab__content').removeClass('actions-tab__content--active').hide();

            $this.addClass('actions-tab__item--active');
            $(target).addClass('actions-tab__content--active').fadeIn(200);
        });
    }

    $(document).ready(function() {
        initActionsTabs();
    });
})