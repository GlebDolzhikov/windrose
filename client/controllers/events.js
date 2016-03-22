Template.skedList.events({
    'click li': function () {
        $("#myModal").modal("hide");
    },
    'click .cls': function () {
        Meteor.call('delFlt', event.target.attributes.datafld.nodeValue)
    }
});

Template.route.events({
    'click .cls': function () {
        Meteor.call('delFlt', this._id)
    }
});



