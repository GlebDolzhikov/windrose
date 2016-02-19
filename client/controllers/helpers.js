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

Template.skedList.helpers({
    date: function(){
         return new Date(Date.parse(this.createdAt)).toLocaleDateString()
    }
});

Template.day.helpers({
    bort:function(){
        if (Template.parentData(2)) {
            return Data.find({
                name: 'bort',
                skedId: Template.parentData(2)._id
            },{sort:{position:1}});
        }
    },
    dayToString: function(){
        switch(this.day)
        {
            case 7:return("Неділя");break;
            case 1:return("Понеділок");break;
            case 2:return("Вівторок");break;
            case 3:return("Середа");break;
            case 4:return("Четвер");break;
            case 5:return("П`ятниця");break;
            case 6:return("Субота");break;
        }
    }
});

Template.borts.helpers({
    ttlDuration: function(){
        var ttlTime = 0;
        Data.find({
            name:'flight',
            bort: this.createdAt,
            skedId: Template.parentData(3)._id
        }).forEach(function(el){
            ttlTime += el.width*2;
        });
        return Math.floor((ttlTime/60)*4.3);
    },
    flight:function(){
       return Data.find({
            name:'flight',
            bort: this.createdAt,
            day:Template.parentData()._id,
            skedId: Template.parentData(3)._id
        });
    },
    time:function(){
        var arr= [];
        for(var i = 0;i<31;i++){
            if(i>24)  {
                arr.push({hour:i-24})
            }
            else{
            arr.push({hour:i})
            }
        }
        return arr;
    }
});

Template.flights.helpers({
   arrTimeFormat : function(){
       var hours = parseInt(this.arrTime.substring(0,2));
       if(hours>23) return (hours-24) + ":" + this.arrTime.substring(this.arrTime.indexOf(":")+1,5) + "+1";
       else return this.arrTime;
   }
});

Template.nalet.helpers({
    ttlDuration: function(){
        var ttlTime = 0;
        Data.find({
            name:'flight',
            bort: this.createdAt,
            skedId: Template.parentData(2)._id
        }).forEach(function(el){
            ttlTime += (el.width/3)*5;
        });
        return Math.round((ttlTime/60)*4.3);
    }
});


Template.layout.helpers({
    skedInfo: function(){
        return Data.find({name:'time'},{sort:{direction:1}})
    },
    skedListObj:function(){
        return Data.find({name:'sked'},{sort:{cretedAt:-1}});
    }
});

Template.commentTpl.helpers({
    username: function(){
        return Meteor.user().username
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
                        d1 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.min(prv,cur)), {} );
                        d2 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.max(prv,cur)), {} );
                        $('#jrange input').val( d1+' - '+d2 );
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
                    prv = $.datepicker.parseDate( 'mm/dd/yy', d[0] ).getTime();
                    cur = $.datepicker.parseDate( 'mm/dd/yy', d[1] ).getTime();
                } else if ( v.length > 0 ) {
                    prv = cur = $.datepicker.parseDate( 'mm/dd/yy', v ).getTime();
                }
            } catch ( e ) {
                cur = prv = -1;
            }
            if ( cur > -1 )
                $('#jrange div').datepicker('setDate', new Date(cur));
            $('#jrange div').datepicker('refresh').show();
        });
});
