jQuery(function ($) {

    function initDeliveryTabs() {
        $('.delivery__tab-item').on('click', function() {
            var $this = $(this);
            var target = '#delivery-tab-' + $this.data('tab');

            $('.delivery__tab-item').removeClass('delivery__tab-item--active');
            $('.delivery__tab-content').removeClass('delivery__tab-content--active').hide();

            $this.addClass('delivery__tab-item--active');
            $(target).addClass('delivery__tab-content--active').fadeIn(200);
        });
    }

    $(document).ready(function() {
        initDeliveryTabs();
    });
})