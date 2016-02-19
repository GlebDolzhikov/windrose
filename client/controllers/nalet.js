Template.nalet.helpers({
    ttlDuration: function(){
        var skedObj =  Data.findOne(Template.parentData(2)._id);
        var ttlTime = 0;

        var monthsTimeCounter = [];
        for(var i = 0; i<13;i++){
            monthsTimeCounter[i] = 0;
        }
        Data.find({
            name:'flight',
            bort: this.createdAt,
            skedId: Template.parentData(2)._id
        }).forEach(function(el){
            if(el.range) {
                if (skedObj.range && skedObj.range[0].length > 1 && el.range[0]) {

                    var skedRange = moment.range(new Date(skedObj.range[0]), new Date(skedObj.range[1]));
                    var fltRange = moment.range(new Date(el.range[0]), new Date(el.range[1]));
                    var counter = 0;
                    var monthsCounter = [];
                    for (var i = 0; i < 13; i++) {
                        monthsCounter[i] = 0;
                    }
                    if (skedRange.overlaps(fltRange)) {
                        fltRange.by('days', function (moment) {
                            if (skedRange.contains(moment) && moment.weekday() == el.dayNum) {
                                monthsCounter[moment.month() + 1]++; //счетчик месяцев
                                counter++; // общий счетчик
                            }
                        });
                    }
                    for (var i = 0; i < 12; i++) {
                        if (monthsCounter[i] != 0) {
                            monthsTimeCounter[i] += ((el.width / 3) * 5) * monthsCounter[i]
                        }
                    }
                    ttlTime += (el.width / 3) * 5 * counter;

                }
            }else {
                ttlTime += ((el.width/3)*5)*4.3;
            }
        });
        //возвращаем объект + массив с налетами за месяца
        var x;
        for (x in monthsTimeCounter){
            if(monthsTimeCounter[x]) {
                monthsTimeCounter[x] = Math.round(monthsTimeCounter[x] / 60)
            }
        }
        return {ttl:Math.round(ttlTime/60),month:monthsTimeCounter}
    }
});