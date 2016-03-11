Template.sked.helpers({
    week:function(){
        return Data.find({name:'day'},{sort:{day:1}});
    },
    bort:function(){
        if (this._id) {
            return Data.find({
                name: 'bort',
                skedId: this._id
            },{sort:{position:1}});
        }
    }
});

Template.sked.onRendered(function () {
    var cur = -1, prv = -1;
    $('#jrange div')
        .datepicker({
            //numberOfMonths: 3,
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            beforeShowDay: function ( date ) {
                return [true, ( (date.getTime() >= Math.min(prv, cur) && date.getTime() <= Math.max(prv, cur)) ? 'date-range-selected' : '')];
            },
            onSelect: function ( dateText, inst ) {
                var d1, d2;
                prv = cur;
                cur = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
                if ( prv == -1 || prv == cur ) {
                    prv = cur;
                    $('#jrange input').val( dateText );
                } else {
                    d1 = $.datepicker.formatDate( 'dd/mm/yy', new Date(Math.min(prv,cur)), {} );
                    d2 = $.datepicker.formatDate( 'dd/mm/yy', new Date(Math.max(prv,cur)), {} );
                    $('#jrange input').val( d1+' - '+d2 );
                    var id = $(".countainer").attr('id');
                    Meteor.call('setSkedRange',id,d1,d2)
                }
            },
            onChangeMonthYear: function ( year, month, inst ) {
                //prv = cur = -1;
            },
            onAfterUpdate: function ( inst ) {
                $('<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">Done</button>')
                    .appendTo($('#jrange div .ui-datepicker-buttonpane'))
                    .on('click', function () { $('#jrange div').hide(); });
            }
        })
        .position({
            my: 'right top',
            at: 'right bottom',
            of: $('#jrange input')
        })
        .hide();
    $('#jrange input').on('focus', function (e) {
        var v = this.value,
            d;
        try {
            if ( v.indexOf(' - ') > -1 ) {
                d = v.split(' - ');
                prv = $.datepicker.parseDate( 'dd/mm/yy', d[0] ).getTime();
                cur = $.datepicker.parseDate( 'dd/mm/yy', d[1] ).getTime();
            } else if ( v.length > 0 ) {
                prv = cur = $.datepicker.parseDate( 'dd/mm/yy', v ).getTime();
            }
        } catch ( e ) {
            cur = prv = -1;
        }
        if ( cur > -1 )
            $('#jrange div').datepicker('setDate', new Date(cur));
        $('#jrange div').datepicker('refresh').show();
    });
});

Template.sked.events({
    'click .addBort': function () {
        Meteor.call('addBort', $(event.target).parent().parent()[0].id)
    },
    'dblclick .day': function (event) {
        Meteor.call('addFlt', event.clientX, $(event.target).parent().parent().attr('id'), event.target.id, $('.countainer')[0].id)

    },
    'click .saveAs': function () {
        var input = prompt('Введите название, например: зима 2016');

        Meteor.call('saveAs', $('.countainer')[0].id, input, function (error, result) {
            Router.go('/sked/' + result);
        });

    },
    'click .delBort': function (event) {
        Meteor.call('delBort', event.target.attributes.datafld.nodeValue)
    },
    'click .editBort': function (event) {
        var bortId = Data.findOne(event.target.attributes.datafld.nodeValue);
        if(Session.get("blockMode")){
            var text = (bortId.capacity ? bortId.capacity : "не задоно");
            swal({
                title: "Задайте загальну кiлькiсть мicць для "+bortId.bort+":",
                text: "Наразi: " + text,
                type: 'input',
                showCancelButton: true,
                closeOnConfirm: true,
                animation: "slide-from-top"
            }, function (capacity) {
                if (capacity === false) return false;
                Meteor.call('editBortCapacity', event.target.attributes.datafld.nodeValue, parseInt(capacity))
            });
        } else {
            var text = (bortId.position ? bortId.position : "не задоно");
            swal({
                title: "Задайте позицiю борта:",
                text: "Наразi позицiя: " + text,
                type: 'input',
                showCancelButton: true,
                closeOnConfirm: true,
                animation: "slide-from-top"
            }, function (position) {
                if (position === false) return false;
                Meteor.call('editBort', event.target.attributes.datafld.nodeValue, parseInt(position))
            });
        }
    },
    'click #reset': function () {
        Meteor.call('reset')
    },
    'click .open': function () {

    },
    "dblclick #setSkedRange": function(e){
        e.preventDefault()
        var id = $(".countainer").attr('id');
        Meteor.call('setSkedRange',id)
    }
});
