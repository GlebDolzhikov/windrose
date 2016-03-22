Template.company.helpers({
    companysName: function () {
        return Data.find({name: "company"});
    }
});
Template.company.events({
    "click .addCompany": function (e) {
        var skedId = this._id;
        swal({
            title: "Додати компанiю",
            text: "Наприклад 'Аероплан'",
            type: 'input',
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top"
        }, function (company) {
            Meteor.call('addCompany', company, skedId);
        });
    },
    'click .cls': function () {
        Meteor.call('delFlt', this._id)
    }
});
