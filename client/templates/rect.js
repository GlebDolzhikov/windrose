//jQuery UI Resize and draggable
var doit;

Template.rect.onRendered(function(){
    function initUi() {
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
                //fire after resize complete
                var bortId = $(event.target).parent().attr('id'),
                    dayId = $(event.target).parent().parent().parent().attr('id');
                Meteor.call('updateDomEl', {
                        'width': parseInt($(this).css('width')),
                        'left': parseInt($(this).css('left'))
                    },
                    event.target.id, bortId, dayId
                )
            }
        }).draggable({
            grid: [3,1],
            snap: ".time_line",
           revert: function (event, ui) {
/*                $(this).data("ui-draggable").originalPosition = {
                    top: 0,
                    left: 0
                };*/
                if (Data.findOne($(this)[0].id).arrSlot||Data.findOne($(this)[0].id).depSlot) {
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
                    $(this).append(ui.draggable);
                    bortId = event.target.id;
                    dayId = $(event.target).parent().parent().attr('id');
                    Meteor.call('updateDomEl', {
                            'width': parseInt($(event.target.firstElementChild).css('width')),
                            'left': parseInt($(event.target.firstElementChild).css('left'))
                        },
                        event.target.firstElementChild.id, bortId, dayId
                    )
                }
            }
        });

        $('.fixed').resizable({
            disabled: true
        });

        $('.nav h2').text($('.title').text());
        $('.title').hide();

    }
    clearTimeout(doit);
    doit = setTimeout(initUi, 100);

});