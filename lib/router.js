Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function () {
    this.render('sked');
}, {
    name: 'index',
    data: function () {
        return Data.findOne({
            name: 'sked',
            index: true
        });
    }
});

Router.route('/login', function () {
    this.render('login');
}, {name: 'login'}
);


Router.route('/sked/:_id', function () {
    this.render('sked');
},{
    name: 'skeds',
    data: function () {
        return Data.findOne(this.params._id);
    }
});

