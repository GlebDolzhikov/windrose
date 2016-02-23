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
        var id = this._id;
        swal({
            title: "Видалити запис?",
            text: "Увага, повернути дiю неможливо",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Так!",
            cancelButtonText: "Нi...",
            closeOnConfirm: true,
            customClass:"warning",
            imageSize:"370x200",
            imageUrl: "img/plane.jpg"
        }, function(isConfirm) {
            if (isConfirm) {
                Meteor.call('removeComment',id);
                swal("Зроблено!", "Запис видалено", "success");
            }else{
                swal("Дiю скасовано", "Запис не видалено", "error");
            }
        })

    }
});

Template.commentTpl.helpers({
    dataL:function(){
            var date = this.date;
        var options = { hour12: false };
            return date.toLocaleString('ru-ru', options);
        },
    username: function(){
        return Meteor.user().username
    }
});
