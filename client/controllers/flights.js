//jQuery UI Resize and draggable
var doit;

initUi = function () {
    $(".rect").mousedown(function (event) {
        if (event.ctrlKey || event.altKey) {
            $(event.target).draggable({helper: 'clone'});
        } else {
            $(event.target).draggable({helper: 'original'});
        }
    }).resizable({
        grid: 3,
        handles: 'e,w',
        resize: function (event, ui) {

            if (parseInt(Data.findOne($(this)[0].id).depTime.substring(0, 2)) > 23) {
                $(this).trigger('mouseup')
            }
            var bortId = $(event.target).parent().attr('id'),
                dayId = $(event.target).parent().parent().parent().attr('id');
            if (Session.get("blockMode")) {
                $(this).css(ui.originalSize);
            }
            Meteor.call('updateDomEl', {
                    'width': parseInt($(this).css('width')),
                    'left': parseInt($(this).css('left'))
                },
                event.target.id, bortId, dayId
            )
        }
    }).draggable({
        grid: [3, 1],
        snap: ".day",
        snapTolerance: 25,
        snapMode: "inner",
        start: function(){
            var snapped = $(this).data('draggable').snapElements;
            snapped.forEach(function(el){
                el.width = 1000000;
                el.left = -50000;
            });
        },
        revert: function (event, ui) {
            if (Data.findOne($(this)[0].id).arrSlot || Data.findOne($(this)[0].id).depSlot || Session.get("blockMode")) {
                return true;
            }
            if (parseInt(Data.findOne($(this)[0].id).depTime.substring(0, 2)) > 23) {
                return true;
            }
            return !event;
        },
        drag: function (event, ui) {
            var bortId = $(event.target).parent().attr('id'),
                dayId = $(event.target).parent().parent().parent().attr('id');
            Meteor.call('updateDomEl', {
                    'width': parseInt($(this).css('width')),
                    'left': parseInt($(this).css('left'))
                },
                event.target.id, bortId, dayId
            );
            $(".rect").draggable({helper: 'original'});
            $('.editable-text').each(function () {
                if ($(this).draggable) $(this).draggable({disabled: true})
            })
        },
        stop: function (event, ui) {
            var bortId = $(event.target).parent().attr('id'),
                dayId = $(event.target).parent().parent().parent().attr('id');
            Meteor.call('updateDomEl', {
                    'width': parseInt($(this).css('width')),
                    'left': parseInt($(this).css('left'))
                },
                event.target.id, bortId, dayId
            );
            $(".rect").draggable({helper: 'original'});
            $('.editable-text').each(function () {
                if ($(this).draggable) $(this).draggable({disabled: true})
            })
        }
    });

    $('.day').droppable({
        accept: '.rect',
        drop: function (event, ui) {
            var pos = parseInt(ui.helper.css('left')),
                bortId = this.id,
                dayId = $(this).parent().parent().attr('id'),
                skedId = $('.countainer')[0].id,
                elementId = ui.draggable.attr('id');
            if (event.ctrlKey) {
                Meteor.call('copyFlt', pos, dayId, bortId, skedId, elementId, function (error, result) {
                    Meteor.call('updateDomEl', {
                        'width': parseInt(ui.helper.css('width')),
                        'left': parseInt(ui.helper.css('left'))
                    }, result, bortId, dayId)
                });

            }
            else if (event.altKey) {
                Meteor.call('copyBackFlt', pos, dayId, bortId, skedId, elementId, function (error, result) {
                    Meteor.call('updateDomEl', {
                        'width': parseInt(ui.helper.css('width')),
                        'left': parseInt(ui.helper.css('left'))
                    }, result, bortId, dayId)
                });
            }
            else {

                if (Data.findOne(elementId).arrSlot || Data.findOne(elementId).depSlot || Session.get("blockMode")) {
                    return false
                }
                $(this).append(ui.draggable);
                bortId = event.target.id;
                dayId = $(event.target).parent().parent().attr('id');
                Meteor.call('updateDomEl', {
                        'width': parseInt(ui.helper.css('width')),
                        'left': parseInt(ui.helper.css('left'))
                    },
                    ui.helper.attr("id"), bortId, dayId
                )
            }
        }
    });

    $('.fixed').resizable({
        disabled: true
    });

    $('.nav h2').text($('.title').text());
    $('.title').hide();
    var contentWidth = parseInt($('.countainer').width());
    $('#side-bar').width(window.innerWidth - contentWidth - 60);
    $('#side-bar').css("top", ($(".countainer").outerHeight() + 100))
};

Template.flights.onRendered(function () {
    clearTimeout(doit);
    doit = setTimeout(preInitUi, 100);
});


function preInitUi() {
    Tracker.autorun(function () {
        if(!Session.get('blockMode')){
            setTimeout(initUi,200);
        }
    });
}

Template.flights.helpers({
    arrTimeFormat: function () {
        var hours = parseInt(this.arrTime.substring(0, 2));
        if (hours > 23) return (hours - 24) + ":" + this.arrTime.substring(this.arrTime.indexOf(":") + 1, 5) + "+1";
        else return this.arrTime;
    },
    blockMode: function () {
        return Session.get("blockMode")
    },
    blocks: function () {
        return Data.find({name: "block", flight: this._id})
    }
});

