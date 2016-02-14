        Template.sked.events({
            'click .addBort': function () {
                Meteor.call('addBort', $(event.target).parent().parent()[0].id)
            },
            'dblclick .day': function (event) {
                Meteor.call('addFlt', event.clientX, $(event.target).parent().parent().attr('id'), event.target.id, $('.countainer')[0].id)

            },
            'click .saveAs': function () {
                var input = prompt('Введите название, например: зима 2016');

                Meteor.call('saveAs', $('.countainer')[0].id, input, function (error, result) {
                    Router.go('/sked/' + result);
                });

            },
            'click .delBort': function () {

                Meteor.call('delBort', event.target.attributes.datafld.nodeValue)
            },
            'click #reset': function () {
                Meteor.call('reset')
            },
            'click .open': function () {

            }
        });

        Template.layout.events({
            'click .addBort': function () {
                Meteor.call('addBort', $('.countainer')[0].id)
            },
            'click .saveAs': function () {
                var input = prompt('Введите название, например: зима 2016');

                Meteor.call('saveAs', $('.countainer')[0].id, input, function (error, result) {
                    Router.go('/sked/' + result);
                });

            },
            'click .addTimeBlock': function () {

                swal({
                    title: "Задайте новий тайм блок",
                    text: 'Формат KBP AYT, 200 (час у хвилинах)',
                    type: 'input',
                    showCancelButton: true,
                    closeOnConfirm: true,
                    animation: "slide-from-top"
                }, function (input) {
                    var direction = input.split(',')[0].toUpperCase();
                    var time = parseInt(input.split(',')[1]);
                    console.log(direction,time);
                    Meteor.call('addTime', direction, time);
                    Meteor.call('updAllFltLength',direction,time,function(e,r) {
                        if (r) {
                            $('.fixed').resizable({
                                disabled: true
                            });
                        }
                    })
                });

            },
            'click .download': function () {
                Meteor.call('downloadExcelFile', $('.countainer')[0].id, function (err, fileUrl) {
                    var link = document.createElement("a");
                    link.download = 'Sked.xlsx';
                    link.href = fileUrl;
                    link.click();
                });
            }
        });

        Template.skedList.events({
            'click li': function () {
                $("#myModal").modal("hide");
            },
            'click .cls': function () {
                Meteor.call('delFlt', event.target.attributes.datafld.nodeValue)
            }
        });


        Template.rect.events({
            'dblclick .rect': function (event) {
                Meteor.call('delFlt', event.target.id)
            },
            'change .textRow>input': function (e) {

                Meteor.call('updFltLength', e.target.value, $(e.target).parent().parent()[0].id,function(e,r){
                    if(r){
                        $('.fixed').resizable({
                            disabled: true
                        });
                    }
                })
            },
            'click .arrSlot':function(e){
                Meteor.call('toggleSlot',this._id,'a')
/*                Meteor.setTimeout(function(){
                    if( !$(this).parent().hasClass("fixed")){
                        $(this).parent().resizable( "option", "disabled", false );
                    }
                    else{
                        $(this).parent().resizable( "option", "disabled", true );
                    }
                },20)*/
            },
            'click .depSlot':function(e){
                Meteor.call('toggleSlot',this._id,'d')
/*                Meteor.setTimeout(function(){
                    if( !$(this).parent().hasClass("fixed")){
                        $(this).parent().resizable( "option", "disabled", false );
                    }
                    else{
                        $(this).parent().resizable( "option", "disabled", true );
                    }
                },20)*/
            }
        });

        Template.route.events({
            'click .cls': function () {
                Meteor.call('delFlt', this._id)
            }
        });

