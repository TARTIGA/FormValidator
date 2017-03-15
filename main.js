$(document).ready(function() {
    $("input[name=phone]")
        .mask("+7(999) 999-9999")
        .attr("placeholder", "+7(___)___-____");


    init();

    // Order main form
    FormValidator.init({

        form: 'serviceRequestForm',
        inputs: [{
                name: 'name',
                rules: ['required', 'isName']
            },
            {
                name: 'phone',
                rules: ['required', 'isPhone']
            },
            {
                name: 'email',
                rules: ['', 'isMail']
            }
        ],
        onSuccessfulSubmit: function(form) {
            sendAjaxForm('result_form', form, './inc/sendAjForm.php');
        }
    });

    // Vip Form

    FormValidator.init({

        form: 'serviceRequestFormVip',
        inputs: [{
                name: 'airport-from',
                rules: ['', 'isText']
            },
            {
                name: 'airport-to',
                rules: ['', 'isText']
            },
            {
                name: 'date-of-service',
                rules: ['required', 'isNotEqual mm/dd/yyyy']
            },

            {
                name: 'flight-number',
                rules: ['required', 'isText']
            },

            {
                name: 'name',
                rules: ['required', 'isName']
            },
            {
                name: 'phone',
                rules: ['required', 'isPhone']
            },
            {
                name: 'car-number-n-model',
                rules: ['', 'isText']
            },
        ],
        selects: [{
                name: 'service',
                rules: ['required', 'isNotDisabled']
            },
            {
                name: 'terminal-type',
                rules: ['required', 'isNotDisabled']
            }

        ],
        textareas: [{
                name: 'details',
                rules: ['', 'isText']
            }

        ],

        onSuccessfulSubmit: function(form) {
            sendAjaxFormVip('result_form', form, './inc/sendAjFormVip.php');
        }
    });

});