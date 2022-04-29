$(document).ready(function() {
    /* Cardholder name */
    $('#cardname').on('input',function(){ 
        $(this).val($(this).val().replace(/[^A-Za-z\s]/g,'').trimStart() ); 
    });

    /* Card Number */
    $("#cardnr").inputmask("9999 9999 9999 9999");

    $("#cardnr").on("keyup", function() {
        var value = $(this).val();
        var src;

        var folder = "./template/template/images/";

        if (value[0] == 4) {
            src = folder + "visa-mini.svg";
        } else if (value[0] == 5) {
            src = folder + "mastercard-mini.svg";
        } else {
            src = folder + "card.svg";
        }

        $("#card-number-icon").attr("src", src);
    });
    

    /* CVC / CVV number */
    $('#cvc2').on('input',function(){ 
        $(this).val($(this).val().replace(/[^0-9]/g,'') ); 
    });

    /* Expire Date */
    $("#expire-date").inputmask("99/99");

    $("#expire-date").on("input", function(e) {
        var value = $(this).val();

        // Update hidden inputs
        $("#month-input").val(value.substr(0, 2));
        $("#year-input").val(value.substr(3, 5));

        // If user enters 2,3,4 ... change to 02, 03, 04 etc..
        var int  = value.replace(/\//g, "").replace(/\_/g, "");
        if (int.length == 1 && int != 0 && int != 1) {
            $(this).val(`0${value}`);
        }
    });

    /* On form submit validate and delete white spaces on card number */
    var isFormValid = true;

    $("#cardentry").on("submit", function(e) {
        /* Validation */
        isFormValid = true;
        $('.error-message').addClass('hidden');
        $('.input-field-with-error').removeClass('input-field-with-error');

        validateCardholder();
        validateCardnumber();
        validateExpirationDate();
        validateCVC();

        if (!isFormValid) {
            e.preventDefault();
            return false;
        }
        /* Delete whitespaces */
        $("#cardnr").inputmask('remove');
        $('#cardnr').val($('#cardnr').val().replace(/\s/g, ""));
        return true;
    });

    function validateCardholder() {
        var input = $('#cardname');
        var value = input.val();
        var pattern = /^[a-zA-Z ]+$/;

        if (!value.trim()) {
            input.closest('.input-field').addClass('input-field-with-error');
            $("#cardname-error-mandatory").removeClass("hidden");
            isFormValid = false;
        
        } else if (!pattern.test(value)) {
            input.closest('.input-field').addClass('input-field-with-error');
            $("#cardname-error-alpha").removeClass("hidden");
            isFormValid = false;
        }
    }

    function validateCardnumber() {
        var input = $("#cardnr");
        var value = input.val().replace(/\s/g, "").replace(/\_/g, "");
        if (!value.trim()) {
            input.closest('.input-field').addClass('input-field-with-error');
            $("#cardnr-error-mandatory").removeClass('hidden');
            isFormValid = false;
        } else if (value.length != 16) {
            input.closest('.input-field').addClass('input-field-with-error');
            $("#cardnr-error-length").removeClass('hidden');
            isFormValid = false;
        }
    }

    function validateExpirationDate() {
        var input = $("#expire-date");
        var value = input.val();
        if (!value.trim()) {
            input.closest('.input-field').addClass('input-field-with-error');
            $("#expire-date-error-mandatory").removeClass('hidden');
            isFormValid = false;
        }
        if (value.slice(0, 2) > 12) {
            input.closest('.input-field').addClass('input-field-with-error');
            $("#expire-date-error-format").removeClass('hidden');
            isFormValid = false;
        }
    }

    function validateCVC() {
        var input = $("#cvc2");
        var value = input.val();;
        if (!value.trim()) {
            input.closest('.input-field').addClass('input-field-with-error');
            $("#cvc2-error-mandatory").removeClass('hidden');
            isFormValid = false;
        } else if (value.length != 3) {
            input.closest('.input-field').addClass('input-field-with-error');
            $("#cvc2-error-length").removeClass('hidden');
            isFormValid = false;
        }
    }

    /* Copyright */
    $("#copyrights").html("© Copyrights 2007-" + new Date().getFullYear() + " PAŞA Bank");

    /* In English or Russian */
    $("#copyrights2").html("© Copyrights 2007-" + new Date().getFullYear() + " PASHA Bank");

});
