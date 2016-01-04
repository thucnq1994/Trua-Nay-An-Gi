var xlsx = require('xlsx');
var csv = require('csv');

module.exports = function (buffer, cb) {
	var ret = [];

  var workBook = xlsx.read(buffer);
	workBook.SheetNames.forEach(function(y) {
  	var workSheet = workBook.Sheets[y];
  	var dataCSV = xlsx.utils.sheet_to_csv(workSheet);
		csv.parse(dataCSV, function(err, data){

			if (err) {
				return cb && cb(err);
			}

			var row = 4; // Start from 4, without title and description text
			var column = 0; // Start from 0 for monday


			while(data[row][column].length > 0) {
				var temp_row = row;
				var food = [];

				// Write down name of food and price
				while(data[temp_row + 1][column].length > 0 && !isNaN(data[temp_row + 1][column])) {
					food.push({name : data[temp_row + 1][column + 1] , price : data[temp_row + 1][column + 2]});
					temp_row++;
				}

				ret.push({ date : data[row][column], foodList : food });

				// Move on position of next day of week
				if(column === 0){
					column = 3;
				} else {
					row = temp_row + 2;
					column = 0;
				}
			}

			return cb && cb(null, ret);
		});
	});

};
