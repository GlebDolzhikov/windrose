Template.skedList.helpers({
    date: function(){
         return new Date(Date.parse(this.createdAt)).toLocaleDateString()
    }
});

Template.day.helpers({
    bort:function(){
        if (Template.parentData(2)) {
            return Data.find({
                name: 'bort',
                skedId: Template.parentData(2)._id
            },{sort:{position:1}});
        }
    },
    dayToString: function(){
        switch(this.day)
        {
            case 7:return("Неділя");break;
            case 1:return("Понеділок");break;
            case 2:return("Вівторок");break;
            case 3:return("Середа");break;
            case 4:return("Четвер");break;
            case 5:return("П`ятниця");break;
            case 6:return("Субота");break;
        }
    }
});





