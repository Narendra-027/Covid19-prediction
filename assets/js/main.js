/*
	Miniport by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('#nav a, .scrolly').scrolly({
			speed: 1000,
			offset: function() { return $nav.height(); }
		});

})(jQuery);

var loadFile = function (event) {
	var image = document.getElementById("image");
	image.src = URL.createObjectURL(event.target.files[0]);
	document.getElementById("image").style.display="block";
	};

	tf.loadLayersModel("VGG19/model.json").then(function(model) {
	window.model = model;
	console.log("my model loaded");
	});

	 function predict() {

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var img = document.getElementById('image');

		canvas.width = 224;
		canvas.height = 224;
		context.drawImage(img, 0, 0 );

		var myData = context.getImageData(0, 0, 224, 224).data;
		var normalArray = Array.from(myData);

		var input = [];
		for(var i = 0; i < myData.length; i += 4) {
		input.push(myData[i]);
		}

		var input2=[input,input,input];
		var inputrray = Array.from(input2);

		window.model.predict([tf.tensor(input).reshape([1, 224, 224, 1])]).array().then(function(scores){
			scores = scores[0];
			predicted = scores.indexOf(Math.max(...scores));

			var chart = new CanvasJS.Chart("chartContainer3", {
				theme: "light2", // "light1", "light2", "dark1", "dark2"
				exportEnabled: true,
				animationEnabled: true,
				data: [{
					type: "pie",
					startAngle: 25,
					toolTipContent: "<b>{label}</b>: {y}%",
					showInLegend: "true",
					legendText: "{label}",
					indexLabelFontSize: 16,
					indexLabel: "{label} - {y}%",
					dataPoints: [
					{ y: scores[0], label: "Non-Covid" },
					{ y: scores[1], label: "Covid" },
					]
				}]
			});
			document.getElementById('covidLikelihood').innerHTML = 'Likelihood of Covid + is ' + scores[1].toFixed(2).toString();
			document.getElementById('nonCovidLikelihood').innerHTML = 'Likelihood of Covid - is ' + scores[0].toFixed(2).toString();

			chart.render();

			var chart2 = new CanvasJS.Chart("chartContainer2", {
				exportEnabled: true,
				animationEnabled: true,
				theme: "light2", // "light1", "light2", "dark1", "dark2"
				axisY: {
				title: "Likelihood"
				},
				data: [{        
					type: "column",  
					showInLegend: true, 
					legendMarkerColor: "grey",
					legendText: "Covid vs NonCovid",
					dataPoints: [      
					{ y: scores[0], label: "Non Covid" },
					{ y: scores[1], label: "Covid" },
					]
					}]
				});
			chart2.render();
			});
		}
