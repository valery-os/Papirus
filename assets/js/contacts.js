jQuery(function ($) {

    function initContactsSelect() {
        const $select = $('#contacts-select');
        if ($select.length === 0) return;
        console.log()
        $select.niceSelect();
    }

    function initScripts() {
        initContactsSelect();
    }
    $(document).ready(initScripts);



})