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