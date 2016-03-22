var global;
Template.flights.events({
    'click .rect': function (e) {
        if (Session.get("blockMode")) {
            Session.set("chosenFlight", this._id);
            $("#blockModal").modal("show")
        }
        var thisObj = this;
        if (e.shiftKey) {
            Meteor.call('fltFixToggle', e.target.id, function (error, result) {
                var me = $("#" + e.target.id);
                if (result) {
                    me.resizable({
                        disabled: false
                    }).addClass("orange");
                } else {
                    me.resizable({
                        disabled: true
                    }).removeClass("orange");
                    Meteor.call("updFltLength", thisObj.direction, thisObj._id)
                }
            });
        }
    },
    'dblclick .rect': function (event) {
        event.stopPropagation();
        swal({
            title: "Видалити рейс?",
            text: "Увага, повернути дiю неможливо",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Так!",
            cancelButtonText: "Нi...",
            closeOnConfirm: true,
            customClass: "warning",
            imageSize: "200x200",
            imageUrl: "/img/plane2.jpg"
        }, function (isConfirm) {
            if (isConfirm) {
                Meteor.call('delFlt', event.target.id);
                swal("Зроблено!", "Рейс видалено", "success");
            }
        })
    },
    'change .textRow>input': function (e) {
        Meteor.call('updFltLength', e.target.value, $(e.target).parent().parent()[0].id, function (e, r) {
            if (r) {
                $('.fixed').resizable({
                    disabled: true
                });
            }
        })
    },
    'click .arrSlot': function (e) {
        Meteor.call('toggleSlot', this._id, 'a')
    },
    'click .depSlot': function (e) {
        Meteor.call('toggleSlot', this._id, 'd')
    },
    'contextmenu .rect': function (e) {
        return false; // pervent context menu
    },
    'mousedown .rect': function (event) {
        //Устанавлтваем период выполнения рейса
        if (event.button == 2) {
            var fltObj = this;
            setTimeout(function () {
                var day = Data.findOne(fltObj.day).day;
                var range = fltObj.range;
                if (range) {
                    if (fltObj.range.length < 3) {
                        range = " з " + fltObj.range[0] + " по " + fltObj.range[1] + " по " + day + " днях";
                    } else {
                        range = fltObj.range.join(' | ');
                    }
                } else {
                    range = "не задоно";
                }
                setTimeout(function () {
                    var modal = $(".periodModal");
                    global = modal.html();
                    modal.find("input").attr("id", "from");
                    modal.find("p").append("<p><strong>Обрати перiод:</strong></p>");
                    modal.find("fieldset").append("<input  type='text' id ='to'/>");
                    modal.find("fieldset").append("<strong>Обрати дати:</strong>");
                    modal.find("fieldset").append("<input type='text' id ='multi'/>");
                    $("#from").datepicker({
                        defaultDate: "+1w",
                        changeMonth: true,
                        numberOfMonths: 1,
                        dateFormat: 'dd-mm-yy',
                        onClose: function (selectedDate) {
                            $("#to").datepicker("option", "minDate", selectedDate);
                        }
                    });
                    $("#to").datepicker({
                        defaultDate: "+1w",
                        changeMonth: true,
                        numberOfMonths: 1,
                        dateFormat: 'dd-mm-yy',
                        onClose: function (selectedDate) {
                            $("#from").datepicker("option", "maxDate", selectedDate);
                        }
                    });
                    $("#multi").datepick({
                        defaultDate: "+1w",
                        changeMonth: true,
                        numberOfMonths: 1,
                        dateFormat: 'dd-mm-yy',
                        multiSelect: 999,
                        onClose: function (selectedDate) {
                            $("#multi").datepicker("option", "minDate", selectedDate);
                        }

                    });
                }, 100);
                swal({
                    title: "Задати перiод:",
                    text: "Наразi перiод: " + range,
                    type: 'input',
                    customClass: "periodModal",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    animation: "slide-from-top",
                    imageSize: "200x200",
                    imageUrl: "/img/plane2.jpg"
                }, function (rangePromt) {
                    if (rangePromt === false && $("#multi").val() === "") {
                        $(".periodModal").html(global);
                        return false;
                    }
                    Meteor.call('setRange', fltObj._id, $("#from").val(), $("#to").val(), $("#multi").val(), fltObj.dayNum);
                    $(".periodModal").html(global);
                });
            }, 50)
        }
    }

});
