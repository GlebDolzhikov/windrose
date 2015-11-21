
Template.sked.events({
    'click .addBort': function(){
        Meteor.call('addBort',$(event.target).parent().parent()[0].id)
    },
    'dblclick .day':function(event){
        Meteor.call('addFlt', event.clientX,$(event.target).parent().parent().attr('id'),event.target.id,$('.countainer')[0].id)

    },
    'click .saveAs': function(){
        var input = prompt('Введите название, например: зима 2016');

        Meteor.call('saveAs',$('.countainer')[0].id,input,function (error, result) {
         Router.go('/sked/' + result); });

    },
    'click .delBort': function(){

        Meteor.call('delBort',event.target.attributes.datafld.nodeValue)
    },
    'click #reset': function(){
        Meteor.call('reset')
    },
    'click .open': function(){

    }
});

Template.layout.events({
    'click .addBort': function(){
        Meteor.call('addBort',$('.countainer')[0].id)
    },
    'click .saveAs': function(){
        var input = prompt('Введите название, например: зима 2016');

        Meteor.call('saveAs',$('.countainer')[0].id,input,function (error, result) {
            Router.go('/sked/' + result); });

    },
    'click #dovid': function(){
        var input = prompt('Задайте тайм блок, у форматі KBPAYT,200(час у хвилинах)');
        var direction = input.split(',')[0];
        var time = input.split(',')[1];
        Meteor.call('addTime',direction,time);
    }
});

Template.skedList.events({
    'click li':function(){
        $("#myModal").modal("hide");
    },
    'click .cls':function(){
        Meteor.call('delFlt', event.target.attributes.datafld.nodeValue)
    }
});


Template.rect.events({
    'dblclick .rect':function(event){
        Meteor.call('delFlt', event.target.id)
    },
    'change .textRow>input':function(e){
        Meteor.call('updFltLength',e.target.value,$(e.target).parent().parent()[0].id)
    }
});
