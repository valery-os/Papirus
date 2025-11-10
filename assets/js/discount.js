jQuery(function ($) {

    function initShowMoreBonuses() {
        $(document).on('click', '.discount__show-more button', function() {
            var $this = $(this);
            var target = $('.discount__hidden');

            if (target.is(':visible')) {
                target.slideUp();
                $this.removeClass('active')
            } else {
                target.slideDown().css('display', 'flex');
                $(this).addClass('active');
            }

            // Меняем текст
            var nowText = $.trim($this.find('span').text());
            var newText = $this.attr('data-text');
            $this.find('span').text(newText);
            $this.attr('data-text', nowText);
        });
    }

    $(document).ready(function() {
        initShowMoreBonuses();
    });

})