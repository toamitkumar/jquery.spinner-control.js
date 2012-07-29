(function ($) {
    $.fn.SpinnerControl = function (options) {
        // set default options
        var opt = $.extend({
            type: 'range',
            typedata: '',
            defaultVal: 0,
            width: '30px',
            backColor: '#fff',
            looping: false
        }, options);

        var otypedata;
        var callBacks = $.Callbacks();
        if(options.callback) {
            callBacks.add(options.callback);
        }

        if (options != null && options.typedata != null) {
            otypedata = $.extend({
                min: 1,
                max: 10,
                interval: 1,
                decimalplaces: 0
            }, options.typedata);
        }
        else {
            otypedata = $.extend({
                min: 1,
                max: 10,
                interval: 1,
                decimalplaces: 0
            });
        }
        opt.typedata = otypedata;

        var inputControl = this;

        // validate if the object is a input of text type.
        if (!inputControl.is(':text'))
            return inputControl;

        if (inputControl.hasClass('jQuerySpinnerControl')) {
            return inputControl;
        }
        else {
            inputControl.addClass('jQuerySpinnerControl');
        }

        // create the Spinner Control body.
        var strContainerDiv = '';
        strContainerDiv += '<div class="spinnerControl">';
        strContainerDiv += '<div class="leftButton"></div>';
        strContainerDiv += '<div class="valueDisplay"></div>';
        strContainerDiv += '<div class="rightButton"></div>';
        strContainerDiv += '</div>';

        // add the above created control to page
        var objContainerDiv = $(strContainerDiv).insertAfter(inputControl);

        // hide the input control and place within the Spinner Control body
        inputControl.insertAfter($("div.valueDisplay", objContainerDiv));
        inputControl.css('display', 'none');

        ($("div.valueDisplay", objContainerDiv)).css({ 'background-color': opt.backColor });
        ($("div.valueDisplay", objContainerDiv)).css({ 'min-width': opt.width });

        switch (opt.type) {
            case 'range':
                // set default value;
                if (opt.defaultVal < opt.typedata.min || opt.defaultVal > opt.typedata.max) {
                    opt.defaultVal = opt.typedata.min;
                }
                if (opt.defaultVal % opt.typedata.interval > 0) {
                    opt.defaultVal = parseInt((opt.defaultVal / opt.typedata.interval).toFixed(0)) * opt.typedata.interval;
                }
                inputControl.val(opt.defaultVal.toFixed(opt.typedata.decimalplaces));
                ($("div.valueDisplay", objContainerDiv)).html(opt.defaultVal.toFixed(opt.typedata.decimalplaces));
                var selectedValue = opt.defaultVal;

                if ((opt.typedata.max - opt.typedata.min) > opt.typedata.interval) {
                    // attach events;
                    $("div.rightButton", objContainerDiv).click(function () {
                        if ((selectedValue + opt.typedata.interval) <= opt.typedata.max || opt.looping) {
                            if ((selectedValue + opt.typedata.interval) > opt.typedata.max) {
                                selectedValue = opt.typedata.min - opt.typedata.interval;
                            }
                            var valueData = (selectedValue + opt.typedata.interval).toFixed(opt.typedata.decimalplaces);
                            selectedValue += opt.typedata.interval;
                            ($("div.valueDisplay", objContainerDiv)).html(valueData);
                            inputControl.val(valueData);
                            callBacks.fire( valueData );
                        }
                        return false;
                    });

                    $("div.leftButton", objContainerDiv).click(function () {
                        if ((selectedValue - opt.typedata.interval) >= opt.typedata.min || opt.looping) {
                            if ((selectedValue - opt.typedata.interval) < opt.typedata.min) {
                                selectedValue = opt.typedata.max + opt.typedata.interval;
                            }
                            var valueData = (selectedValue - opt.typedata.interval).toFixed(opt.typedata.decimalplaces);
                            selectedValue -= opt.typedata.interval;
                            ($("div.valueDisplay", objContainerDiv)).html(valueData);
                            inputControl.val(valueData);
                            callBacks.fire( valueData );
                        }
                        return false;
                    });
                }

                break;
            case 'list':
                if (!opt.typedata.list || opt.typedata.list.lenght == 0) {
                    return inputControl;
                }

                var listItems = opt.typedata.list.split(',');

                var selectedIndex = jQuery.inArray(opt.defaultVal, listItems);
                if (!selectedIndex >= 0) {
                    selectedIndex = 0;
                    opt.defaultVal = listItems[0];
                }

                inputControl.val(opt.defaultVal);
                ($("div.valueDisplay", objContainerDiv)).html(opt.defaultVal);

                if (listItems.length > 1) {
                    // attach events;
                    $("div.rightButton", objContainerDiv).click(function () {
                        if (selectedIndex < (listItems.length - 1) || opt.looping) {
                            if (selectedIndex == listItems.length - 1) {
                                selectedIndex = -1;
                            }
                            selectedIndex++;
                            var valueData = listItems[selectedIndex];
                            ($("div.valueDisplay", objContainerDiv)).html(valueData);
                            inputControl.val(valueData);
                        }
                        return false;
                    });

                    $("div.leftButton", objContainerDiv).click(function () {
                        if (selectedIndex > 0 || opt.looping) {
                            if (selectedIndex == 0) {
                                selectedIndex = listItems.length;
                            }
                            selectedIndex--;
                            var valueData = listItems[selectedIndex];
                            ($("div.valueDisplay", objContainerDiv)).html(valueData);
                            inputControl.val(valueData);
                        }
                        return false;
                    });
                }

                break;
        };

        // return the selected input control for the chainability
        return inputControl;
    };
})(jQuery);