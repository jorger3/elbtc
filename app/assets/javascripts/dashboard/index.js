//= require plugins/morris/morris
//= require plugins/raphael/raphael
var data;
var Index = {
  init: function(){
	var that = this;
	that.fill();
	that.bind();
	that.content();
	

	},
	fill: function(){
		var that = this;
		$.ajax({
			type: 'GET',
			url: '/api/btc/last5.json',
			data: data,
			async: false,
			beforeSend: function (xhr) {
			  if (xhr && xhr.overrideMimeType) {
				xhr.overrideMimeType('application/json;charset=utf-8');
			  }
			},
			dataType: 'json',
			success: function (response) {
			  //Do stuff with the JSON data
			  data = response
			}
		  });
	
	},
	bind: function(){
		var that = this;
		//create a callback function
		$(document).ready(function(){
			new Morris.Line({
				// ID of the element in which to draw the chart.
				element: 'myfirstchart',
				// Chart data records -- each entry in this array corresponds to a point on
				// the chart.
				data: data['price'],
				// The name of the data record attribute that contains x-values.
				xkey: 'date',
				// A list of names of data record attributes that contain y-values.
				ykeys: ['usd'],
				// Labels for the ykeys -- will be displayed when you hover over the
				// chart.
				labels: ['USD'],
				ymax: data['max'][0]['usd'],
				ymin: data['min'][0]['usd']
			  });
		});
	},
	content: function(){
		var that = this;

	},

	
};

Index.init();