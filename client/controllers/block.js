Template.block.events({
    'click .cls': function () {
        Meteor.call('delFlt', this._id)
    }
});