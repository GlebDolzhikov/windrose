Meteor.methods({
    downloadExcelFile : function(id) {
    var Future = Npm.require('fibers/future');
    var futureResponse = new Future();
    var skedName = Data.findOne({_id:id}).title;

    var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
    var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
    var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
    worksheet.writeToCell(0,0,0,0, skedName); // Example : writing to a cell
    worksheet.mergeCells(0,0,0,0,0,1); // Example : merging files
    worksheet.writeToCell(1,0, 'Номер рейсу');
    worksheet.writeToCell(1,1, 'Маршрут');
    worksheet.writeToCell(1,2, 'Розклад UTC');
    worksheet.writeToCell(1,3, 'День');

    worksheet.setColumnProperties([ // Example : setting the width of columns in the file
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 10 }
    ]);

    // Example : writing multple rows to file
    var row = 2;
    Data.find({name:'flight',skedId:id},{sort:{dayNum:1}}).forEach(function(flights) {
        var fltNum = (parseInt(flights.fltNumber.substring(3,10)));

        if(fltNum%2){ // if flt num not even
            var backFlt =  Data.findOne({name:'flight',fltNumber:'7W '+(fltNum+1),dayNum:flights.dayNum,skedId:id});

            if (backFlt){
                worksheet.writeToCell(row, 0, flights.fltNumber+'/'+(parseInt(flights.fltNumber.substring(5,10))+1));
                worksheet.writeToCell(row, 1, flights.direction+' '+flights.direction.substring(0,3));
                worksheet.writeToCell(row, 2, flights.depTime+'-'+flights.arrTime+'/'+backFlt.depTime+'-'+backFlt.arrTime);
                worksheet.writeToCell(row, 3, 'Day '+flights.dayNum);
            }else {
                worksheet.writeToCell(row, 0, flights.fltNumber);
                worksheet.writeToCell(row, 1, flights.direction);
                worksheet.writeToCell(row, 2, flights.depTime + '-' + flights.arrTime);
                worksheet.writeToCell(row, 3, 'Day '+flights.dayNum);
            }
        }
        row++;
    });


    workbook.addSheet('MySheet', worksheet); // Add the worksheet to the workbook

    mkdirp('tmp', Meteor.bindEnvironment(function (err) {
        if (err) {
            console.log('Error creating tmp dir', err);
            futureResponse.throw(err);
        }
        else {
            var uuid = UUID.v4();
            var filePath = './tmp/' + uuid;
            workbook.writeToFile(filePath);

            temporaryFiles.importFile(filePath, {
                filename : uuid,
                contentType: 'application/octet-stream'
            }, function(err, file) {
                if (err) {
                    futureResponse.throw(err);
                }
                else {
                    futureResponse.return('/gridfs/temporaryFiles/' + file._id);
                }
            });
        }
    }));

    return futureResponse.wait();
}
});