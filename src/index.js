
var barchart = require('./graph/barchart');
var d3 = require('d3')

const dataMap = {
  'simple': 'data.tsv',
  'groupbar': 'data_group.tsv'
}
var dataOrigin = dataMap.simple

// d3.tsv(dataOrigin, function (d) {
//   d.frequency = +d.frequency;
//   return d;
// }, function (error, data) {
//   if (error) throw error;
//   console.log(data);
//   (new barchart({
//     target: '.chart',
//     label: 'nima',

//   })).render(data)

// })
d3.csv("data_group.tsv", function (d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function (error, data) {
  console.log(data)
  if (error) throw error;
  (new barchart({
    target: '.chart',
    label: 'nima',
    axisX: {
      key: 'State'
    }
  })).render(data)

})





