Template.sidebar.helpers({
    comment:function(){
        var parentData = Template.parentData(1)
        if (parentData){
        var skedId = parentData._id;

        return Comments.find({skedId:skedId},{sort:{date:-1}})
        }
    }
});
Template.sidebar.events({
    'submit form':function(e){
        e.preventDefault();
        var text = event.target.text.value;
        var parentData = Template.parentData(1);
        var skedId = parentData._id;
        event.target.text.value = "";
        Meteor.call('addComment',text,skedId,Meteor.user().username);
    }
});

Template.commentTpl.events({
    'dblclick p': function(){
              Meteor.call('removeComment',this._id);
    }
});

Template.commentTpl.helpers({
    dataL:function(){
            var date = this.date;
        var options = { hour12: false };
            return date.toLocaleString('ru-ru', options);
        }
});

Template.sidebar.onRendered(function(){
    Meteor.setTimeout(function(){
        var contentWidth = parseInt($('.countainer').width());
        $('#side-bar').width(window.innerWidth-contentWidth-60);
        $('#side-bar').css("top",($(".countainer").outerHeight()+100))
    },5000)
    });