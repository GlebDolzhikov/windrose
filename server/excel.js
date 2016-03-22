Meteor.methods({
    downloadExcelFile: function (id) {
        var Future = Npm.require('fibers/future');
        var futureResponse = new Future();
        var skedName = Data.findOne({_id: id}).title;

        var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
        var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
        var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
        worksheet.writeToCell(0, 0, 0, 0, skedName); // Example : writing to a cell
        worksheet.mergeCells(0, 0, 0, 0, 0, 1); // Example : merging files
        worksheet.writeToCell(1, 0, 'Номер рейсу:');
        worksheet.writeToCell(1, 1, 'Маршрут:');
        worksheet.writeToCell(1, 2, 'Розклад UTC:');
        worksheet.writeToCell(1, 3, 'День:');
        worksheet.writeToCell(1, 4, 'Борт:');
        worksheet.writeToCell(1, 5, 'Перiод:');
        for (var i = 6; i < 18; i++) {
            worksheet.writeToCell(1, i, i - 5);
        }
        var colNum = 18;
        Data.find({name: "company", sked: id}, {sort: {company: 1}}).forEach(function (company) {
            if (company.company) {
                worksheet.writeToCell(1, colNum, company.company);
                colNum++;
            }
        });
        worksheet.writeToCell(1, colNum, "Усього:");

        worksheet.setColumnProperties([ // Example : setting the width of columns in the file
            {wch: 15},
            {wch: 15},
            {wch: 25},
            {wch: 10},
            {wch: 15},
            {wch: 25},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3},
            {wch: 3}
        ]);

        // Example : writing multple rows to file
        var row = 2;
        var validBorts = [];
        var prevDay = 1;

        Data.find({name: "bort", skedId: id}).forEach(function (bort) {
            validBorts.push(bort._id);
        });

        Data.find({name: 'flight', skedId: id, bort: {$in: validBorts}}, {
            sort: {
                dayNum: 1,
                arrDirection: 1
            }
        }).forEach(function (flights) {

            //дополнительная строка после вывода дня
            if (prevDay < parseInt(flights.dayNum)) {
                row++;
            }
            prevDay = flights.dayNum;

            var fltNum = (parseInt(flights.fltNumber.substring(3, 10)));

            if (fltNum % 2) { // if flt num not even
                var backFlt = Data.findOne({
                    name: 'flight',
                    fltNumber: '7W ' + (fltNum + 1),
                    dayNum: flights.dayNum,
                    skedId: id
                });

                if (backFlt) {
                    worksheet.writeToCell(row, 0, flights.fltNumber + '/' + (parseInt(flights.fltNumber.substring(5, 10)) + 1));
                    worksheet.writeToCell(row, 1, flights.direction + ' ' + flights.direction.substring(0, 3));
                    worksheet.writeToCell(row, 2, flights.depTime + '-' + flights.arrTime + '/' + backFlt.depTime + '-' + backFlt.arrTime);
                } else {
                    worksheet.writeToCell(row, 0, flights.fltNumber);
                    worksheet.writeToCell(row, 1, flights.direction);
                    worksheet.writeToCell(row, 2, flights.depTime + '-' + flights.arrTime);
                }
                worksheet.writeToCell(row, 3, 'Day ' + flights.dayNum);
                worksheet.writeToCell(row, 4, Data.findOne(flights.bort).bort);
                if (flights.range) {
                    if (flights.range.length > 1) {
                        flights.range.reformated = [];
                        flights.range.forEach(function (el, n) {
                            flights.range.reformated[n] = flights.range[n].substring(0, 5).replace(/-/g, "/");
                        });
                        if (!flights.singleDays) {
                            worksheet.writeToCell(row, 5, flights.range.reformated[0] + "-" + flights.range.reformated[1]);
                        } else {
                            worksheet.writeToCell(row, 5, flights.range.reformated.join('-'));
                        }
                    }

                    //расчет колличчества рейсов в месяц
                    var monthsCounter = coutFlightByMoth(flights);

                    for (var i = 6; i < 18; i++) {
                        worksheet.writeToCell(row, i, monthsCounter[i - 5]);
                    }
                }
                //вывод блоков
                var colNum = 18;
                Data.find({name: "company", sked: id}, {sort: {company: 1}}).forEach(function (company) {
                    var blockObj = Data.findOne({name: "block", flight: flights._id, company: company.company});
                    if (blockObj) {
                        if (blockObj.amount) {
                            worksheet.writeToCell(row, colNum, blockObj.amount);
                        }
                    }
                    colNum++;
                });
                //вывод общей вместимости
                var bortObj = Data.findOne(flights.bort);
                if (bortObj) {
                    if (bortObj.capacity) {
                        worksheet.writeToCell(row, colNum, bortObj.capacity);
                    }
                }

                row++;
            }
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
                    filename: uuid,
                    contentType: 'application/octet-stream'
                }, function (err, file) {
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

        function coutFlightByMoth(flights) {

            var counter = 0;
            var monthsCounter = [];
            for (var i = 0; i < 13; i++) {
                monthsCounter[i] = 0;
            }
            if (flights.singleDays) { //если период не задан, а заданы единичные даты
                for (var i = 0; i < flights.range.length; i++) {
                    var fltDay = moment(flights.range[i], "DD-MM-YYYY");
                    monthsCounter[fltDay.month() + 1]++;
                    counter++
                }
            } else {
                var fltRange = moment.range(dateFormat(flights.range[0]), dateFormat(flights.range[1]));

                fltRange.by('days', function (moment) {
                    if (moment.weekday() == flights.dayNum) {
                        monthsCounter[moment.month() + 1]++; //счетчик месяцев
                        counter++; // общий счетчик
                    }
                });
            }
            return monthsCounter;

            function dateFormat(date) {
                var from = date.split("-");
                var f = new Date(from[2], from[1] - 1, from[0]);
                return f;
            }
        }
    }

});