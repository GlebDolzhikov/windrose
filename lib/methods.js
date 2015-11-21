
Meteor.methods({
    updateDomEl: function (obj,id,bortId,dayId) {
         var posOfset=obj.left-75,  //отнимаем отступ
             pos= Math.round((posOfset-(posOfset%3))*1.66666),//округляем до 3, и переводи из 3 пикселей в 5 минут умножая на 1,6666,отнимаем отступ
             dur= Math.round((obj.width-(obj.width%3))*1.66666);

        function addZero(num){
                if(num<9){
                    return '0' + num;
                }
                 else return num
             }

         Data.update({_id: id},
                {
                    $set: {
                        bort:bortId,
                        day: dayId,
                        width: obj.width,
                        left: obj.left,
                        depTime: Math.floor(pos/60)+":"+addZero(pos%60),
                        arrTime:  Math.floor((pos+dur)/60)+":"+addZero((pos+dur)%60)
                    }
                }
         );
      },
    updFltLength:function(direction,id){
        var time = Data.findOne({direction:direction.toUpperCase()}).time;
        var dur= time/5*3;
        Data.update({_id: id},{$set:{width:dur}})
    },
    copyFlt: function(positon,dayId,bortId,skedId,elementId){
        var newFlt = Data.findOne({_id:elementId},
            {fields: {_id:0}});
        newFlt.left = positon - (positon % 3);
        newFlt.bort = bortId;
        newFlt.day = dayId;
        newFlt.skedId = skedId;

        return Data.insert(newFlt);
    },
    copyBackFlt: function(positon,dayId,bortId,skedId,elementId){
        var newFlt = Data.findOne({_id:elementId},
            {fields: {_id:0}});
        newFlt.left = positon - (positon % 3);
        newFlt.bort = bortId;
        newFlt.day = dayId;
        newFlt.skedId = skedId;
        newFlt.fltNumber ='7W '+(+ parseInt(newFlt.fltNumber.substring(3,10))+1);
        newFlt.direction =  newFlt.direction.split(' ').reverse().join(' ');

        return Data.insert(newFlt);
    },
    addFlt: function(positon,dayId,bortId,skedId){

            function addZero(num) {
                if (num < 9) {
                    return '0' + num;
                }
                else return num
            }

            var posOfset = positon - 75,
                pos = Math.round((posOfset - (posOfset % 3)) * 1.66666);
            Data.insert({
                name: 'flight',
                width: 72,
                left: positon - (positon % 3),
                direction: 'KBP AYT',
                bort: bortId,
                depTime: Math.floor(pos / 60) + ":" + addZero(pos % 60),
                arrTime: Math.floor((pos + 120) / 60) + ":" + addZero((pos + 120) % 60),
                day: dayId,
                fltNumber: '7W 7011',
                skedId: skedId
            });

    },
    delFlt: function(id){
        Data.remove({
            _id:id
        });
    },
    editFlt: function(id,derection){
        Data.update({_id: id}, {
            $set: {
                direction: derection
            }
        })
    },
    reset: function(){
        Data.remove({});
    },
    addBort: function(skedId){

    Data.insert({
        name: 'bort',
        bort: 'A320',
        skedId: skedId,
        createdAt: new Date().toString()
    })
    },
    delBort: function(id){
        Data.remove({
            _id:id
        });
    },
    saveAs: function(id,title){
    var newId = Data.insert({
            name: 'sked',
            title:title,
            createdAt: new Date()
        });

        //копируем рейсы и борта и создаем новые с новым скед ИД
         Data.find({
            name:{$in:['flight','bort']},
            skedId:id
        },{fields: { _id: 0,skedId:0}}).fetch().forEach(function(el){
            el.skedId = newId;
            Data.insert(el);
        });

        return newId;

    },
    addFixtures: function(){
        var skedID = Data.insert({
            name: 'sked',
            index: true,
            title: 'Черновик',
            createdAt: new Date().toString()
        });

        var day = Data.insert({
            name: 'day',
            day: 1
        });

        for(var i = 2;i<=7;i++){
            Data.insert({
                name: 'day',
                day: i
            });
        }

        var bortID = Data.insert({
            name: 'bort',
            bort:'A320',
            createdAt: new Date().toString(),
            day: day,
            skedId:skedID
        });
    },
    addTime:function(direction,time){
       Data.remove({direction:direction.toUpperCase()});
        Data.insert({
            name: 'time',
            time: time,
            direction:direction.toUpperCase()
        });
    }
});