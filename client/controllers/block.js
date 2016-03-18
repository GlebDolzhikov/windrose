Template.block.events({
    'click .cls': function () {
        Meteor.call('delFlt', this._id)
    },
    'change #companySelect': function(e){
        console.log(this._id, $(e.target).val());
        Meteor.call('chngCompanyBlock', this._id, $(e.target).val());
    }
});

Template.block.helpers({
    companys: function () {
       return Data.find({name: "company",company:{ $not: this.company }})
    }
});

