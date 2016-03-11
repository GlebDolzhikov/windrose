Template.layout.events({
    'click .addBort': function () {
        Meteor.call('addBort', $('.countainer')[0].id)
    },
    'click .saveAs': function () {
        var input = prompt('Задайте назву, нового розкладу:');

        Meteor.call('saveAs', $('.countainer')[0].id, input, function (error, result) {
            Router.go('/sked/' + result);
        });

    },
    'click .newSked': function () {
        var input = prompt('Задайте назву, нового розкладу:');

        Meteor.call('newSked',input, function (error, result) {
            Router.go('/sked/' + result);
        });

    },
    'click .addTimeBlock': function () {
        swal({
            title: "Задайте новий тайм блок",
            text: 'Формат KBP AYT, 200 (час у хвилинах)',
            type: 'input',
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top"
        }, function (input) {
            var direction = input.split(',')[0].toUpperCase();
            var time = parseInt(input.split(',')[1]);
            var lastTime = Data.findOne({name:'time',direction:direction});
            if (lastTime) {
                if(!confirm("Заданий напрям вже внесино у довiдник, з часом " + lastTime.time + "хвилин. Перезаписати новим часом?")) {
                    return;
                }
                swal("Час поновлено!",
                    "перемога",
                    "success");
            }
            Meteor.call('addTime', direction, time);
            Meteor.call('updAllFltLength',direction,time,function(e,r) {
                if (r) {
                    $('.fixed').resizable({
                        disabled: true
                    });
                }
            })
        });

    },
    'click .download': function () {
        Meteor.call('downloadExcelFile', $('.countainer')[0].id, function (err, fileUrl) {
            var link = document.createElement("a");
            link.download = 'Sked.xlsx';
            link.href = fileUrl;
            link.click();
        });
    },
    'click  #myonoffswitch' :function(){
        var checked = $(".onoffswitch-checkbox")[0].checked;
        Session.set("blockMode",checked);
    },
    'click  .addBlock' :function(){
        var flightId = Data.findOne(Session.get("chosenFlight"))._id;
        console.log(flightId);
        swal({
            title: "Додати компанiю",
            text: "Наприклад 'Аероплан'",
            type: 'input',
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top"
        }, function (input) {
            Meteor.call('addBlock', input, flightId);
        });

    }
});

Template.layout.helpers({
    skedInfo: function(){
        return Data.find({name:'time'},{sort:{direction:1}})
    },
    skedListObj:function(){
        return Data.find({name:'sked'},{sort:{cretedAt:-1}});
    },
    blockMode: function(){
        return Session.get("blockMode");
    },
    blocks: function(){
        return Data.find({name:"block",flight:Session.get("chosenFlight")})
    },
    flightNum: function(){
        if(Session.get("chosenFlight")) {
            var fltObj = Data.findOne(Session.get("chosenFlight"));
            if(fltObj){
                return fltObj.fltNumber;
            }
        }
    },
    bortName:function(){
        var fltObj = Data.findOne(Session.get("chosenFlight"));
        if(fltObj){
            var bortId = fltObj.bort;
            var bortObj = Data.findOne(bortId);
            if(bortObj){
                return bortObj.bort
            }
        }
    },
    bortCapacity:function(){
        var fltObj = Data.findOne(Session.get("chosenFlight"));
        if(fltObj){
            var bortId = fltObj.bort;
            var bortObj = Data.findOne(bortId);
            if(bortObj){
                return bortObj.capacity
            }
        }
    },
    bortOpen:function(){
        var fltObj = Data.findOne(Session.get("chosenFlight"));
        if(fltObj){
            var bortId = fltObj.bort;
            var bortObj = Data.findOne(bortId);
            if(bortObj){
                var total = 0;
                Data.find({"name":"block",flight:Session.get("chosenFlight")}).forEach(function(blockObj){
                    if(!isNaN(blockObj.amount)){
                        total +=  parseInt(blockObj.amount)
                    }

                });
                return bortObj.capacity - total;
            }
        }
    }
});