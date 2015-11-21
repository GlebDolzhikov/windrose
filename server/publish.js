
Meteor.publish('data', function () {
       if(this.userId) {
        /*   if (this.userId = 'Gleb') {*/
                return Data.find({});
          /*  }*/
        }
    });
