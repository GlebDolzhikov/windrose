Template.sked.helpers({
    week:function(){
        return Data.find({name:'day'},{sort:{day:1}});
    },
    bort:function(){
        if (this._id) {
            return Data.find({
                name: 'bort',
                skedId: this._id
            });
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
