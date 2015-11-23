
Meteor.publish('data', function () {
       if(this.userId) {
                return Data.find({});
        }
    });


temporaryFiles.allow({
    insert: function( userId, file ) {
        return true;
    },
    remove: function( userId, file ) {
        return true;
    },
    read: function( userId, file ) {
        return true;
    },
    write: function( userId, file, fields ) {
        return true;
    }
});