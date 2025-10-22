jQuery(function ($) {

    function initCalendar() {
        let datepicker = $('#sort-date').datepicker({
            range: true,
            dateFormat: 'yyyy-mm-dd',
            multipleDatesSeparator: ' ',
            autoClose: true,
            onSelect: function onSelect(fd, date) {
                if(fd.length === 21){
                    let dates = fd.split(' ');
                    Orders.dateStart = dates[0];
                    Orders.dateEnd = dates[1];
                    window.location.href = '/'+Papirus.getLangUri()+Orders.page+'/'+Orders.buildQuery();
                }
            }
        }).data('datepicker');
        $('.js-open-datepicker').on('click', function () {
            datepicker.show();
        });
    }

    function initProfileOrderCheck() {
        $(document).on('click', '.profile__orders-product', function(e) {
            if ($(e.target).is('input[type="checkbox"]')) return;
            const $item = $(this);
            const $checkbox = $item.find('input[type="checkbox"]');
            const isChecked = !$checkbox.prop('checked');
            $checkbox.prop('checked', isChecked);
            $item.toggleClass('check', isChecked);
            updateCheckAllState($item.closest('.profile__orders-products'));
        });
    }

    function updateCheckAllState($parent) {
        const $allBlock = $parent.find('.profile-orders-checkbox-all');
        const $allCheckbox = $allBlock.find('input[type="checkbox"]');
        const $items = $parent.find('.profile__orders-product');

        const allChecked = $items.length > 0 && $items.filter('.check').length === $items.length;

        $allCheckbox.prop('checked', allChecked);
        $allBlock.toggleClass('check', allChecked);
    }

    function initProfileOrdersCheckAll() {
        $(document).on('click', '.profile-orders-checkbox-all', function(e) {

            const $allItem = $(this);
            const $allCheckbox = $allItem.find('input[type="checkbox"]');
            const $parent = $allItem.closest('.profile__orders-products');
            const $items = $parent.find('.profile__orders-product');
            const isChecked = !$allCheckbox.prop('checked');

            $allCheckbox.prop('checked', isChecked);
            $allItem.toggleClass('check', isChecked);

            $items.each(function() {
                $(this)
                const $checkbox = $(this).find('input[type="checkbox"]');
                $checkbox.prop('checked', isChecked);
                $(this).toggleClass('check', isChecked);
            });
        });
    }

    function initOpenDetailsOrder() {
        $('.status-arrow').on('click', function() {
            var order_item = $(this).closest('.profile__orders-row');
            order_item.toggleClass('open');
            order_item.find('.profile__orders-row-bottom').slideToggle(300);
        });
    }


    function initScripts() {
        initCalendar();
        initProfileOrderCheck();
        initProfileOrdersCheckAll();
        initOpenDetailsOrder();
    }
    $(document).ready(initScripts);



})