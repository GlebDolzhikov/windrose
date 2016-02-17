

Meteor.methods({

    updateDomEl: function (obj,id,bortId,dayId) {
        if (Data.findOne(id).arrSlot||Data.findOne(id).depSlot) {
            return;
        }
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                 var posOfset = obj.left-75,  //отнимаем отступ
                     pos = Math.round((posOfset-(posOfset%3))*1.66666),//округляем до 3, и переводи из 3 пикселей в 5 минут умножая на 1,6666,отнимаем отступ
                     dur = Math.round((obj.width-(obj.width%3))*1.66666);

                function addZero(num){
                        if(num<9){
                            return '0' + num;
                        }
                         else return num
                     }
                console.log(id,bortId);
                 Data.update({_id: id},
                        {
                            $set: {
                                bort:bortId,
                                day: dayId,
                                width: obj.width,
                                left: obj.left,
                                depTime: Math.floor(pos/60)+":"+addZero(pos%60),
                                arrTime:  Math.floor((pos+dur)/60)+":"+addZero((pos+dur)%60),
                                dayNum: Data.findOne({_id:dayId}).day
                            }
                        }
                 );
            }
        }
      },
    updFltLength:function(direction,id){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                var direct = Data.findOne({direction: direction.toUpperCase(),name:'time'});
                if (direct) {
                    var time = parseInt(direct.time);
                    var dur = (time / 5) * 3;
                    Data.update({_id: id}, {$set: {
                        width: dur,
                        fixed:true,
                        direction: direction.toUpperCase()
                    }});
                    return true;
                }
            }
        }
    },
    updAllFltLength:function(direction,time){
        var flights = Data.find({
            direction:direction.toUpperCase(),
            name:'flight'
        }).fetch();

        if(flights){
            for(var i = 0; i<flights.length;i++){
                var dur = (time/5)*3;
                Data.update({_id: flights[i]._id},{$set:{
                    width:dur,
                    fixed:true,
                    direction: direction.toUpperCase()
                }})
            }
            return true;
        }
    },
    copyFlt: function(positon,dayId,bortId,skedId,elementId){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                var newFlt = Data.findOne({_id: elementId},
                    {fields: {_id: 0}});
                newFlt.left = positon - (positon % 3);
                newFlt.bort = bortId;
                newFlt.day = dayId;
                newFlt.skedId = skedId;
                newFlt.dayNum = Data.findOne({_id: dayId}).day;

                return Data.insert(newFlt);
            }}
    },
    copyBackFlt: function(positon,dayId,bortId,skedId,elementId){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                var newFlt = Data.findOne({_id: elementId},
                    {fields: {_id: 0}});
                newFlt.left = positon - (positon % 3);
                newFlt.bort = bortId;
                newFlt.day = dayId;
                newFlt.skedId = skedId;
                newFlt.fltNumber = '7W ' + (+parseInt(newFlt.fltNumber.substring(3, 10)) + 1);
                newFlt.direction = newFlt.direction.split(' ').reverse().join(' ');
                newFlt.dayNum = Data.findOne({_id: dayId}).day;

                return Data.insert(newFlt);
            }}
    },
    addFlt: function(positon,dayId,bortId,skedId){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                if (this.userId) {
                    var user = Meteor.users.findOne(this.userId);
                    if (user.username != 'Guest') {

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
                            direction: 'KBP',
                            bort: bortId,
                            depTime: Math.floor(pos / 60) + ":" + addZero(pos % 60),
                            arrTime: Math.floor((pos + 120) / 60) + ":" + addZero((pos + 120) % 60),
                            day: dayId,
                            fltNumber: '7W 7011',
                            skedId: skedId,
                            dayNum: Data.findOne({_id: dayId}).day,
                            depSlot:false,
                            arrSlot:false
                        });
                    }
                }
            }}
    },
    delFlt: function(id){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                if (Data.findOne(id).arrSlot||Data.findOne(id).depSlot) {
                    return;
                }
                if (Data.findOne({_id: id}).index) {
                    return;
                }
                Data.remove({
                    _id: id
                });
                Data.remove({
                    skedId: id
                });
                Comments.remove({
                    skedId: id
                });
            }}
    },
    editFlt: function(id,derection){
        Data.update({_id: id}, {
            $set: {
                direction: derection
            }
        })
    },
    addBort: function(skedId){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                Data.insert({
                    name: 'bort',
                    bort: 'A320',
                    skedId: skedId,
                    createdAt: new Date().toString()
                })
            }}
    },
    editBort:function(id,position){
        Data.update({_id: id}, {
            $set: {
                position: position
            }
        })
    },
    delBort: function(id){
        var bort = Data.findOne(id);
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                if(!Data.findOne({
                        name:"flight",
                        bort:bort.createdAt
                    }))
                {
                    Data.remove({
                        _id: id
                    });
                    Data.remove({
                        bort: id
                    });
                } else{
                    if(Meteor.isClient) swal("Заборонена операція,Спочатку треба прибрати усі рейси")
                }
            }}
    },
    saveAs: function(id,title){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
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

    }}},
    addFixtures: function(){
        if(this.userId) {
            var user = Meteor.users.findOne(this.userId);
            if (user.username != 'Guest') {
                var user = Meteor.users.findOne(this.userId);
                if (user.username != 'Guest') {
                    var skedID = Data.insert({
                        name: 'sked',
                        index: true,
                        title: 'Базовий розклад',
                        createdAt: new Date().toString()
                    });

                    var day = Data.insert({
                        name: 'day',
                        day: 1
                    });

                    for (var i = 2; i <= 7; i++) {
                        Data.insert({
                            name: 'day',
                            day: i
                        });
                    }

                    var bortID = Data.insert({
                        name: 'bort',
                        bort: 'A320',
                        createdAt: new Date().toString(),
                        day: day,
                        skedId: skedID
                    });
                }
            }
        }
    },
    addTime:function(direction,time){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                Data.remove({direction: direction.toUpperCase(), name: 'time'});
                Data.insert({
                    name: 'time',
                    time: time,
                    direction: direction.toUpperCase()
                });
            }}
    },
    'clearFlt': function(){
        Data.find({name:"flight"}).forEach(function(myDoc){
            if( !Data.findOne({name:"bort",createdAt:myDoc.bort}) )
                {
                    Data.update({_id: myDoc._id}, {
                    $set: {
                        name: "archie"
                    }
                }) }
        });
    },
    'addComment': function(comment,skedId,username){
        Comments.insert({
            text:comment,
            skedId:skedId,
            user:this.userId,
            date: new Date(),
            userName:username
        })
    },
    removeComment:function(id){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                Comments.remove({_id:id})
            }
        }

    },
    toggleSlot:function(id,slot){
        if(this.userId){
            var user = Meteor.users.findOne(this.userId);
            if (user.username!='Guest') {
                if(slot == 'a'){
                    var arrSlot = Data.findOne({_id:id}).arrSlot;
                    Data.update({_id:id},{$set:{
                        arrSlot:!arrSlot
                    }})
                }
                else {
                    var depSlot = Data.findOne({_id: id}).depSlot;
                    Data.update({_id: id}, {
                        $set: {
                            depSlot: !depSlot
                        }
                    })
                }
            }
        }

    },
    setRange:function(id,from,to,singleDays){
        if(from != "") {
            Data.update({_id: id}, {
                $set: {
                    range: [from, to]
                }
            })
        } else {
            var arr =  singleDays.split(",");
            Data.update({_id: id}, {
                $set: {
                    range: arr
                }
            })
        }
    }
});

