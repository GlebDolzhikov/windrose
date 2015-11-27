Meteor.startup(function() {
   Session.set('data_loaded', false);
    Meteor.setTimeout(function(){react()},100)
  });
Accounts.onLogin(function(user){
    react();
});

trustUsers = [
    'Windrose','windrose','Guest','Gleb','Olga','Nadya','Oksana','Nastya'
];

function varif(user){
    for(var i = 0;trustUsers.length>i;i++){
        if(user==trustUsers[i]) return true;
    }
    return false;
}

function react() {
    if (Meteor.user()) {
        var userObj = Meteor.user();
        if (varif(userObj.username)) {
            Meteor.subscribe('data', function () {
                Meteor.subscribe('comments');
                Session.set('data_loaded', true);
                dbIsReady();
            });
        }
    }
}



//fixture
  function dbIsReady(){
    if (Data.find().count() === 0) {
        Meteor.call('addFixtures');
    }
  }

