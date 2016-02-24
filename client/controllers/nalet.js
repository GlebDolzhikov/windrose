Template.nalet.helpers({
    ttlDuration: function(){
        function dateFormat(date){
            var from = date.split("-");
            var f = new Date(from[2], from[1] - 1, from[0]);
            return f;
        }

        function dateFormatSlash(date){
            var from = date.split("/");
            var f = new Date(from[2], from[1] - 1, from[0]);
            return f;
        }

        var skedObj =  Data.findOne(Template.parentData(2)._id);
        var ttlTime = 0;

        var monthsTimeCounter = [];
        for(var i = 0; i<13;i++){
            monthsTimeCounter[i] = 0;
        }
        Data.find({
            name:'flight',
            bort: this._id,
            skedId: Template.parentData(2)._id
        }).forEach(function(el){
            if(skedObj.range){
                if(el.range) {
                    if (skedObj.range[0].length > 1 && el.range[0]) {
                        var skedRange = moment.range(dateFormatSlash(skedObj.range[0]),dateFormatSlash(skedObj.range[1]));
                        var fltRange = moment.range(dateFormat(el.range[0]), dateFormat(el.range[1]));
                        var counter = 0;
                        var monthsCounter = [];
                        for (var i = 0; i < 13; i++) {
                            monthsCounter[i] = 0;
                        }
                        if(el.singleDays){ //если период не задан, а заданы единичные даты
                            for(var i = 0;i < el.range.length; i++){
                                var fltDay = moment(el.range[i], "DD-MM-YYYY");
                                monthsCounter[fltDay.month() + 1]++;
                                if(skedRange.contains(fltDay)){
                                    counter++
                                }
                            }
                        }else {
                            if (skedRange.overlaps(fltRange)) { //если период задан
                                fltRange.by('days', function (moment) {
                                    if (moment.weekday() == el.dayNum) {
                                        monthsCounter[moment.month() + 1]++; //счетчик месяцев
                                        if(skedRange.contains(moment)){
                                            counter++; // общий счетчик

                                        }
                                    }
                                });
                            }
                        }
                        for (var i = 0; i < 12; i++) {
                            if (monthsCounter[i] != 0) {
                                monthsTimeCounter[i] += ((el.width / 3) * 5) * monthsCounter[i]
                            }
                        }
                        ttlTime += (el.width / 3) * 5 * counter;
                    }else{
                    }
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
    },
    range:function(){
        return Template.parentData(1).range
    },
    months:function(index){
        arr = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        return arr[index-1]
    }
});