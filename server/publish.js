
Meteor.publish('data', function () {
       if(this.userId) {
                return Data.find();
        }
    });

Meteor.publish('comments', function () {
    if(this.userId) {
        return Comments.find();
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