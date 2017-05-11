// ХЕРНЯ, надо переписать этот детсад
$(document).ready(function() {
    /**Main state */
    var state = {
        forms: {},
        submits: {}
    };

    /**
     * Init Form Object
     * 
     * @param {any} data 
     */
    function setFormValidation(data) {
        var
            $form = $('form[name=' + data.form + ']'),
            formMap = {},
            validationResult,
            formName = data.form;


        state.forms[formName] = {
            form: $form
        };
        state.submits[formName] = {
            submit: null
        };

        if (data.hasOwnProperty('onSuccessfulSubmit')) {
            // state.forms[formName].onSuccessfulSubmit = data.onSuccessfulSubmit;
            state.submits[formName] = {
                submit: data.onSuccessfulSubmit
            };
            // console.log(state.submits[formName].submit + "START SUBMITS");
        }

        if (data.hasOwnProperty('inputs')) {
            formMap.$inputs = data.inputs.map(function(inputData) {
                var
                    $input = $form.find('input[name=' + inputData.name + ']'),
                    inputMap = {
                        $input: $input,
                        rules: inputData.rules,
                        name: inputData.name
                    };

                $input.focusout(function(evt) {
                    handleInputFocusOut(evt.target, inputMap);
                });

                return inputMap;
            });
        }

        /*********** Selects ************/

        if (data.hasOwnProperty('selects')) {
            formMap.$selects = data.selects.map(function(selectData) {
                var
                    $select = $form.find('select[name=' + selectData.name + ']'),
                    selectMap = {
                        $select: $select,
                        rules: selectData.rules,
                        name: selectData.name
                    };


                var selectState = false; // state of select

                $select.focus(function(evt) {
                    selectState = true;
                });

                $select.mouseleave(function(evt) {
                    // console.log("MOUSE LEAVE");
                    if (selectState) {
                        handleSelectFocusOut(evt.target, selectMap);
                        var optionVal = $(this).val();
                        if (optionVal == null) {
                            // console.log("FOCUSE OUT-ON-DEFAULT");
                        }

                    } else {
                        selectState = false;
                    }
                    // console.log("state = " + selectState + " option = " + optionVal);
                });

                return selectMap;
            });
        }
        /** Form Submit Event */
        $form.on('submit', function(evt) {
            handleFormSubmit(evt, formMap, formName)
        });
    }
    /**Add error message to validated element
     * 
     * 
     * @param {any} elem 
     * @param {any} messages 
     */
    function displayErrorMessage(elem, messages) {
        var $messageList = $('<div class="form__error_message text-danger"></div>');
        messages.forEach(function(message) {
            $messageList.append('<div class="form__error_message_inner">' + messages + '</div>');
            // $messageList.append('<input class="form__error_message" value=' + messages + '>');
        });
        $(elem).after($messageList);
    }

    /**
     * Remove error messages from element to validate
     * 
     * @param {any} elem 
     */
    function clearErrorMessage(elem) {
        $(elem).siblings('.form__error_message').remove();
    }

    /**
     * Validate input string value
     * 
     * @param {any} str 
     * @param {any} rules 
     * @returns 
     */
    function validateStr(str, rules) {
        var
            errors = [],
            regex,
            complexRuleResult;

        rules.forEach(function(rule) {
            switch (rule) {

                case 'required':
                    if (!str) {
                        errors.push({
                            rule: rule,
                            message: 'Поле не должно быть пустым'
                        });
                    }
                    break;

                case 'isMail':
                    regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (str && !regex.test(str)) {
                        errors.push({
                            rule: rule,
                            message: 'E-mail адрес заполнен неверно'
                        });
                    }
                    break;

                case 'isName':
                    regex = /^[a-zа-я\s]+$/i;
                    if (str && !regex.test(str)) {
                        errors.push({
                            rule: rule,
                            message: 'Поле должно содержать только буквы и пробелы'
                        });
                    }
                    break;

                case 'isPhone':
                    regex = /^\+?[0-9\s\-\(\)]*$/;
                    if (str && !regex.test(str)) {
                        errors.push({
                            rule: rule,
                            message: 'Поле должно содержать только цифры, пробелы и символы "+" и "-"'
                        });
                    }
                    break;

                case 'isText':
                    regex = /^[a-zа-я0-9\s]+$/i;
                    if (str && !regex.test(str)) {
                        errors.push({
                            rule: rule,
                            message: 'Поле не должно содержать специальных символов'
                        });
                    }
                    break;

                case 'isNumber':
                    regex = /^[0-9]+$/i;
                    if (str && !regex.test(str)) {
                        errors.push({
                            rule: rule,
                            message: 'Поле должно содержать только цифры'
                        });
                    }
                    break;


                default:
                    if (complexRuleResult = tryComplexRule(rule, str)) {
                        errors.push(complexRuleResult);
                    };
                    break;
            }
        });

        if (errors.length > 0) {
            return {
                str: str,
                errors: errors,
                messages: errors.map(function(error) {
                    return error.message;
                })
            }
        }
        return true;
    }

    /**************Validate Select************************** */


    /**
     * Validate Select Options
     * 
     * @param {any} str 
     * @param {any} rules 
     * @returns 
     */


    function validateOptions(str, rules) {
        var
            errors = [],
            // regex,
            complexRuleResult;

        rules.forEach(function(rule) {
            switch (rule) {

                case 'required':
                    // if ((select.find('option:selected').attr('disabled') == 'disabled')) {
                    if (str == null) {
                        errors.push({
                            rule: rule,
                            message: 'Поле не должно быть пустым'
                        });
                    }
                    break;

                default:
                    if (complexRuleResult = tryComplexRule(rule, str)) {
                        errors.push(complexRuleResult);
                    };
                    break;
            }
        });

        if (errors.length > 0) {
            return {
                str: str,
                errors: errors,
                messages: errors.map(function(error) {
                    return error.message;
                })
            }
        }
        return true;
    }

    /*****************End validate select*********************** */


    /**
     * Complex Rule for custom params
     * 
     * @param {any} rule 
     * @param {any} str 
     * @returns 
     */
    function tryComplexRule(rule, str) {
        var
            isNotEqualRegex = /^isNotEqual/,
            param;

        if (isNotEqualRegex.test(rule)) {
            param = rule.match(/^isNotEqual\s(.+)/)[1];
            if (str === param) {
                return { rule: 'isNotEqual', param: param };
            }
        }
        return false;
    }

    /**
     * Handle Select focus out event
     * 
     * @param {any} $select
     * @param {any} selectMap
     */
    function handleSelectFocusOut($select, selectMap) {
        validateSelect($select, selectMap);
    }

    /**
     * Selects Validate init
     * 
     * @param {any} $select 
     * @param {any} selectMap 
     * @returns 
     */
    function validateSelect($select, selectMap) {
        var
            $select = $($select),
            validationResult = validateOptions($select.val(), selectMap.rules);

        clearErrorMessage($select);
        if (validationResult !== true) {
            displayErrorMessage($select, validationResult.messages);
        }

        return validationResult;
    }



    /****************************************
     * Handle Input focus out event
     * 
     * @param {any} $input
     * @param {any} inputName
     */
    function handleInputFocusOut($input, inputMap) {
        validateInput($input, inputMap);
    }

    /**
     * Inputs Validate init
     * 
     * @param {any} $input 
     * @param {any} inputMap 
     * @returns 
     */
    function validateInput($input, inputMap) {
        var
            $input = $($input),
            validationResult = validateStr($input.val().trim(), inputMap.rules);

        clearErrorMessage($input);
        if (validationResult !== true) {
            displayErrorMessage($input, validationResult.messages);
        }

        return validationResult;
    }

    /**
     * Form submit
     * 
     * @param {any} evt 
     * @param {any} formMap 
     * @param {any} formName 
     */
    function handleFormSubmit(evt, formMap, formName) {
        // console.log(state.forms[formName].form);
        // console.log(state.submits[formName].submit);
        var errors = [];
        evt.preventDefault();

        if (formMap.hasOwnProperty('$inputs')) {
            formMap.$inputs.forEach(function($input) {
                var validationResult = validateInput($input.$input, $input);
                if (validationResult !== true) {
                    errors.push(validationResult);
                }
            });
        }

        if (formMap.hasOwnProperty('$selects')) {
            formMap.$selects.forEach(function($select) {
                var validationResult = validateSelect($select.$select, $select);
                if (validationResult !== true) {
                    errors.push(validationResult);
                }
            });
        }


        if (errors.length === 0) {
            if (typeof state.submits[formName].submit === 'function') {
                state.submits[formName].submit(state.forms[formName].form);
            }
        }
    }

    /**
     *  Initiate module
     * 
     * @param {any} initData 
     */
    function init(initData) {
        setFormValidation(initData);
    }

    window.FormValidator = {
        init: init
    };
});
