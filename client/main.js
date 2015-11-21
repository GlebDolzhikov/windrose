//jQuery UI Resize and draggable
  Template.rect.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
      $(".rect").mousedown(function(event) {
          if(event.ctrlKey||event.altKey) {
              $(event.target).draggable({helper:'clone'});
          }else{
              $(event.target).draggable({helper:'original'});
          }
      }).resizable({
        grid: 3,
        handles: 'e,w',
          resize: function (event, ui) {
          //fire after resize complete
          var bortId = $(event.target).parent().attr('id'),
              dayId =  $(event.target).parent().parent().parent().attr('id');
          Meteor.call('updateDomEl',  {
                'width':parseInt($(this).css('width')),
                'left':parseInt($(this).css('left'))
              },
              event.target.id, bortId,dayId
          )
        }
      }).draggable({
        grid: [3,20],
        snap: ".day" ,
        revert : function(event, ui) {
              $(this).data("uiDraggable").originalPosition = {
                  top : 0,
                  left : 0
              };
              return !event;
          },
        drag: function (event, ui) {
                var bortId = $(event.target).parent().attr('id'),
                    dayId = $(event.target).parent().parent().parent().attr('id');

                Meteor.call('updateDomEl', {
                        'width': parseInt($(this).css('width')),
                        'left': parseInt($(this).css('left'))
                    },
                    event.target.id, bortId, dayId
                );
            $(".rect").draggable({helper:'original'});
        }
      });

     $('.day').droppable({
        accept: '.rect',
        drop: function(event, ui) {
            var pos = parseInt(ui.helper.css('left')),
                bortId = this.id,
                dayId = $(this).parent().parent().attr('id'),
                skedId = $('.countainer')[0].id,
                elementId = ui.draggable.attr('id') ;
            if(event.ctrlKey) {
                Meteor.call('copyFlt',pos,dayId,bortId,skedId,elementId,function(error,result){
                    Meteor.call('updateDomEl',{
                        'width': parseInt(ui.helper.css('width')),
                        'left': parseInt(ui.helper.css('left'))
                    },result,bortId,dayId)
                });

            }
            else if(event.altKey){
                Meteor.call('copyBackFlt',pos,dayId,bortId,skedId,elementId,function(error,result){
                    Meteor.call('updateDomEl',{
                        'width': parseInt(ui.helper.css('width')),
                        'left': parseInt(ui.helper.css('left'))
                    },result,bortId,dayId)
                });
            }
            else {
                $(this).append(ui.draggable);
                    bortId = event.target.id;
                    dayId = $(event.target).parent().parent().attr('id');
                Meteor.call('updateDomEl', {
                        'width': parseInt($(event.target.firstElementChild).css('width')),
                        'left': parseInt($(event.target.firstElementChild).css('left'))
                    },
                    event.target.firstElementChild.id, bortId, dayId
                )
            }
        }
      });
    }
  };

  Meteor.startup(function() {
   Session.set('data_loaded', false);
    Meteor.setTimeout(function(){react()},100)
  });
Accounts.onLogin(function(user){
    react();
});
function react() {
    if (Meteor.user()) {
        var userObj = Meteor.user();
        if (userObj.username == 'windrose') {
            Meteor.subscribe('data', function () {
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

