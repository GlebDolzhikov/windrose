
Meteor.publish('data', function () {
       if(this.userId) {
                return Data.find({});
        }
    });
