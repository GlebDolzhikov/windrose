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
