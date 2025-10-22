jQuery(function ($) {
    function initCartCheckboxes() {
        const $cartItems = $(".cart__item");
        const $allCheckbox = $(".cart-checkbox-all .custom-checkbox-page__input");
        const $itemCheckboxes = $(".cart-checkbox .custom-checkbox-page__input");

        $itemCheckboxes.on("change", function() {
            const $checkbox = $(this);
            const $cartItem = $checkbox.closest(".cart__item");

            if ($checkbox.is(":checked")) {
                $cartItem.addClass("checked");
            } else {
                $cartItem.removeClass("checked");
            }

            if ($itemCheckboxes.length === $itemCheckboxes.filter(":checked").length) {
                $allCheckbox.prop("checked", true);
            } else {
                $allCheckbox.prop("checked", false);
            }
        });

        $allCheckbox.on("change", function() {
            const isChecked = $(this).is(":checked");

            $itemCheckboxes.prop("checked", isChecked).trigger("change");
        });
    }

    function initCartDeleteChecked() {
        $("#cart-checked-delete").on("click", function(e) {
            e.preventDefault();

            const $checkedItems = $(".cart__item.checked");
            const $cartList = $(".cart__list");

            if ($checkedItems.length) {
                $checkedItems.remove();

                if ($cartList.find(".cart__item").length === 0) {
                    $cartList.remove();
                }

                $(".cart-checkbox-all .custom-checkbox-page__input").prop("checked", false);
            }
        });
    }

    function deleteCartItem() {
        $('.cart__item-delete').on('click', function(e) {
            e.preventDefault();
            const $cartItem = $(this).closest('.cart__item');
            $cartItem.remove();

        });
    }

    function uploadFile() {
        document.querySelector("#upload").addEventListener("change", function() {
            const fileName = this.files[0]?.name || "Выбрать файл";
            this.closest(".file-upload").querySelector(".file-upload__text").textContent = fileName;
        });
    }

    function openEditTabsCart() {
        $('.cart__edit-head').on('click', function() {
            const $this = $(this);
            if ($this.hasClass('open')) {
                $this.removeClass('open');
                $this.siblings('.cart__edit-body').slideUp();
            } else {
                $('.cart__edit-head').removeClass('open');
                $('.cart__edit-body').slideUp();
                $this.addClass('open');
                $this.siblings('.cart__edit-body').slideDown();
            }
        })
    }

    function showPromocodeForm() {
        $('.cart__sum-promocode-text').on('click', function(e) {
            e.preventDefault();
            $('.cart__sum-promocode-form-wrapp').slideToggle();
        })
    }

    function setPhoneMask() {
        document.addEventListener("DOMContentLoaded", () => {
            Inputmask({
                mask: "+38(999) 999-9999",
                placeholder: "_",
                showMaskOnHover: false
            }).mask("#order-phone");
        });
    }

    function initRecipientSelect() {
        const $select = $('#recipient-select');
        if ($select.length === 0) return;

        $select.niceSelect();
    }

    function initDeliverySelect() {
        const $selects = $('.delivery-select');
        if ($selects.length === 0) return;

        $selects.each(function() {
            $(this).niceSelect();
        });
    }

    function citySelectHandler() {
        $(".cart__ordering-block-delivery-cities span").on("click", function() {
            const city = $(this).text();
            const $select = $("#city-select");

            $select.find("option").filter(function() {
                return $(this).text() === city;
            }).prop("selected", true);

            $select.niceSelect('update');
        });
    };


    function initScripts() {
        initCartCheckboxes();
        initCartDeleteChecked();
        deleteCartItem();
        uploadFile();
        openEditTabsCart();
        showPromocodeForm();
        initRecipientSelect();
        initDeliverySelect();
        citySelectHandler();
    }
    $(document).ready(initScripts);

    document.addEventListener("DOMContentLoaded", setPhoneMask);
})