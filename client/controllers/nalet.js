Template.nalet.helpers({
    ttlDuration: function(){
        var skedObj =  Data.findOne(Template.parentData(2)._id);
        var ttlTime = 0;
        Data.find({
            name:'flight',
            bort: this.createdAt,
            skedId: Template.parentData(2)._id
        }).forEach(function(el){

            if(skedObj.range&&skedObj.range[0].length>1&&el.range[0]){

                var skedRange = moment.range(new Date(skedObj.range[0]),new Date(skedObj.range[1]));
                var fltRange =   moment.range(new Date(el.range[0]),new Date(el.range[1]));
                var counter = 0;
                if(skedRange.overlaps(fltRange)){
                    fltRange.by('days', function(moment) {
                        if (skedRange.contains(moment)&&moment.weekday() == el.dayNum) {
                            counter++;
                        }
                    });
                }
                ttlTime += (el.width/3)*5*counter;

            }else{
                ttlTime += ((el.width/3)*5)*4.3;
            }
        });
        return Math.round(ttlTime/60);
    }
});