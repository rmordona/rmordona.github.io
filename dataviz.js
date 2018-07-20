
	var myFullpage = new fullpage('#fullpage', {
		sectionsColor: ['#f2f2f2', '#ffffff', '#f2f2f2', 'whitesmoke', '#ccddff', '#ffffff']
	});

  function about_visualization() {
			pop('opaqueWindow')
	}

	function close_about_visualization() {
			hide('opaqueWindow')
	}

	var page_location = 0

	function down_page() {
    var up = document.getElementById("up_button")
		fullpage_api.moveSectionDown();
	//	if (page_location < 5) page_location ++;
	//	up.style.display = "block"
	}

	function up_page() {
    var up = document.getElementById("up_button")
		fullpage_api.moveSectionUp();
	//	page_location --;
	//	if (!page_location) {
	//		up.style.display = "none"
	//	}
	}

	function pop(div) {
	    document.getElementById(div).style.display = 'block';
			fullpage_api.setAllowScrolling(false)
	}

	function hide(div) {
	    document.getElementById(div).style.display = 'none';
			fullpage_api.setAllowScrolling(true)
	}

	//To detect escape button
	document.onkeydown = function (evt) {
	    evt = evt || window.event;
	    if (evt.keyCode == 27) {
	        hide('popDiv');
	    }
	};

  var io_workload, user_activities, no_active_sessions, db_time_spent;


  d3.csv("./Number_of_Active_DB_Sessions_summary.csv", function( data) {

			 handle_Active_DB_Sessions(data)
  });

	d3.csv("./User_Activities_summary.csv", function( data) {

			 handle_User_Activities(data)
  });

	d3.csv("./IO_workload_summary.csv", function( data) {

			 handle_IO_workload(data)
  });

	d3.csv("./Db_Time_Spent_summary.csv", function( data) {

			 handle_DB_Time_Spent(data)
  });

  // Citation/Reference:
  // https://blog.tompawlak.org/number-currency-formatting-javascript
	function formatNumber (num) {
	    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
	}


	function handle_IO_workload(data) {

				 io_workload = []

				 data.forEach( function(d) {

					 io_workload.push( {
	 						//date:   new Date(d["Month of Date"] + " " + d["Day of Date"] + " " + d["Year of Date"]),
	 						name: d["Measure Names"],
	 						value: (d["Measure Values"] - 0).toFixed(2),
							servers: d["Servers"]
	 					}
					)

					 // console.log(d["Servers"] + "/" + d["Measure Names"] + "/" + d["Measure Values"])
				 })


				 var margin = { top: 20, right: 20, bottom: 50, left: 50},
				     width = 960 - margin.left - margin.right,
						 height = 500 - margin.top - margin.bottom;

  			// Citation/Reference:
				// http://bl.ocks.org/binaworks/9dce0a385915e8953a45cc6be7fbde42
				// Margin Convention
				var svg = d3.select("#svg_IOworkload")
				 		.attr("width",width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)

				var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var x = d3.scaleBand().range([0, width]).padding(0.1);

		//		var y = d3.scaleLinear().domain([0, max_value ]).range([ height , 0]);

							var y = d3.scaleLinear().range([height, 0]);

			  x.domain(io_workload.map( function(d) {	return  "Srv " + d.servers ; }));


				// y.domain(d3.extent(io_workload, function(d) { return d.value; }));
				 y.domain([0, d3.max(io_workload, function(d) {  return d.value / 2; })]);

				var yAxis = d3.axisLeft(y);


				var p = g.selectAll("rect")
						p.data(io_workload)
							.enter()
							.append("rect")
						  .attr("class", "bar")
							// rect attributes
							.attr("y", function(d) { return  y(d.value / 2)  } )
							.attr("x", function(d,i) {
								if (d.name == "PhysWrite/Txn") {
									return  ( i * width/24 + 25 ) + "px"
								} else {
									return  ( i * width/24 + 1 ) + "px"
								}
							 } )
							.attr("style", function(d) {
								  var fill = "fill: dodgerblue;stroke-width:1;stroke: black; opacity: 0.8"
								  if (d.name == "PhysWrite/Txn") {
										 fill = "fill: darkorange;stroke-width:1;stroke: black; opacity: 0.8"
								   }
									 return fill;
								})
								.attr("height", function (d) {	return height- y(d.value / 2 )   })
								.attr("width", function(d) { return 25 + "px" })
								.on("mouseover", function(d,i) {
												 var isFirefox = typeof InstallTrigger !== 'undefined';
												 var x, y;
												 if (isFirefox) {
												 	  var coordinates = [0, 0];
												 	  coordinates = d3.mouse(this);
												   	x = parseInt(coordinates[0], 10);
													  y = 300
												  } else {
													  x =  parseInt( d3.select(this).style("x"), 10)
												    y =  parseInt( d3.select(this).style("y"), 10)
												  }
												 if (x < 30) x = 50; else
												 if (x >= 766 ) x = x - 200; else x = x + 25
												 tooltip.attr("transform", "translate(" + x + "," + y + ")");
												 tooltip.style("display", null);
		  								 	 tooltip.select("#metric_name").text("Name: " + d.name);
												 tooltip.select("#metric_value").text("Value: " + (d.value / 2).toFixed(2) );

												 var fill = "fill:red;stroke-width:1;stroke: black; opacity: 0.8"
												 d3.select(this).attr("style", fill);

												})
					      .on("mouseout", function(d,i) {
												 tooltip.style("display", "none")
												 var fill = "fill: dodgerblue;stroke-width:1;stroke: black; opacity: 0.8"
												 if (d.name == "PhysWrite/Txn") {
														fill = "fill: darkorange;stroke-width:1;stroke: black; opacity: 0.8"
												 }
								         d3.select(this).attr("style", fill);
								        })


				 g.append("g").call(yAxis)
						 .append("text")
							 .attr("fill", "#000")
							 .attr("transform", "rotate(-90)")
							 .attr("y", 6)
							 .attr("dy", "0.71em")
							 .attr("text-anchor", "end")
							 .text("IO Workload (x2 scaled)");
				 g.append("g")
								.attr("class", "axis")
						      .attr("transform", "translate(0," + height + ")")
						      .call(d3.axisBottom(x))
								.selectAll("text")
									.style("text-anchor", "end")
									.attr("dx", "-.8em")
									.attr("dy", ".15em")
									.attr("transform", "rotate(-65)");


				/*
	 		     This section highlights simple technique in creating grid layout
	 				 as additional guide in the chart and be able to show alignments
					 of value to the x and y axis.
	 		 */

  			// Citation/Reference:
				// http://blockbuilder.org/35degrees/23873a64ceec2390c400694b6a8b57d9
				// Layout Grid
				g.append("g")
			  		.attr("class","grid")
			  		.attr("transform","translate(0," + height + ")")
			  		.style("stroke-dasharray",("3,3"))
			  		.call(make_x_gridlines()
			            .tickSize(-height)
			            .tickFormat("")
			         )
			  g.append("g")
			  		.attr("class","grid")
			  		.style("stroke-dasharray",("3,3"))
			  		.call(make_y_gridlines()
			            .tickSize(-width)
			            .tickFormat("")
			         )

			 function make_x_gridlines() {
			     return d3.axisBottom(x)
			     	.ticks(8)
			   }
			   function make_y_gridlines() {
			     return d3.axisLeft(y)
			     	.ticks(5)
			   }

				 var annotation = g.append("g")
			     .attr("class","annotation")
			     .attr("transform","translate(80,10)")
			     .style("font-size","12px")


				 /* Now let's do annotation */
				 annotation.append('rect')
				     .attr('width', 300)
				     .attr('height', 30)
				     .style('fill', "white")
				     .style('stroke', "#800")
						 .style('stroke-width', 2)

				 annotation.append('text')
				     .attr('x', 20)
				     .attr('y', 20)
						 .style('fill', '#800')
						 .attr("font-family", "sans-serif")
						 .attr("font-size", "14px")
				     .text(function(d) { return "High Physical Read Observed on Server 1."; });

				 g.append('line')
				     .style('stroke', "#800")
						 .style('stroke-width', 2)
				     .attr('x1', 63)
						 .attr('y1', 25)
						 .attr('x2', 80)
						 .attr('y2', 25)

			 /*
			     This section highlights simple technique in creating legends
					 to explain the meaning of the colors chosen for the bars in
					 the chart.
			 */

		   var legend = g.append("g")
		     .attr("class","legend")
		     .attr("transform","translate(680,10)")
		     .style("font-size","12px")


			 legend.append('rect')
			     .attr('width', 200)
			     .attr('height', 50)
			     .style('fill', "white")
			     .style('stroke', "black");

			 legend.append('circle')
			 			.attr('cx', 25)
			 			.attr('cy', 15)
			     .style('fill', "dodgerblue")
			     .style('stroke', "black")
					 .attr("r", 8)

			 legend.append('circle')
			     .attr('cx', 25)
			     .attr('cy', 35)
			     .style('fill', "darkorange")
			     .style('stroke', "black")
					 .attr("r", 8)

			 legend.append('text')
			     .attr('x', 50)
			     .attr('y', 20)
			     .text(function(d) { return "PhysRead/Txn"; });


			 legend.append('text')
			     .attr('x', 50)
			     .attr('y', 40)
			     .text(function(d) { return "PhysWrite/Txn"; });


			 /*
			     This section highlights simple technique in creating tooltips
					 to inform user of the value of each bars in the chart.
			 */

			 var tooltip = g.append("g")
					 .attr("class", "focus")
					 .style("display", "none");

			 //Adds text to focus point on line
			 tooltip.append('rect')
			 .attr("width", "170px" )
			 .attr("height", "50px" )
			 .style("stroke", "white")
			 .style("fill", "black")
			 .attr("x", "9px")
			 .attr("y", "-9px")

			 tooltip.append("text")
					 .attr("x", 19)
					 .attr("y", 5)
					 .attr("dy", ".35em")
					 .attr("fill", "#fff")
					 .style('position', 'absolute')
					 .style('opacity', 1)
					 .style('pointer-events', 'all')
					 .style('fill', 'white')
					 .attr("id", "metric_name")

			 tooltip.append("text")
					 .attr("x", 19)
					 .attr("y", 25)
					 .attr("dy", ".35em")
					 .attr("fill", "#fff")
					 .style('position', 'absolute')
					 .style('opacity', 1)
					 .style('pointer-events', 'all')
					 .style('fill', 'white')
					 .attr("id", "metric_value")


		}


	function handle_Active_DB_Sessions(data) {

		  no_active_sessions = [] // data


			var parseTime = d3.timeParse("%B %d %Y");

		  data.forEach( function(d) {

				no_active_sessions.push( {
						//date:   new Date(d["Month of Date"] + " " + d["Day of Date"] + " " + d["Year of Date"]),
						date: parseTime( d["Month of Date"] + " " + d["Day of Date"] + " " + d["Year of Date"] ),
						sessions: d["Sessions"] - 0
					}
				)
			 //	console.log(no_active_sessions[rows - 1].sessions +  "/" + no_active_sessions[rows -1].date)
		  })


		  var margin = { top: 20, right: 20, bottom: 30, left: 50},
		     width = 960 - margin.left - margin.right,
				 height = 500 - margin.top - margin.bottom;

  			// Citation/Reference:
			// http://bl.ocks.org/binaworks/9dce0a385915e8953a45cc6be7fbde42
			// Margin Convention
			var svg = d3.select("#svg_DBSession")
			 		.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)

			var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// set the ranges
			var x = d3.scaleTime().range([0, width]);
			var y = d3.scaleLinear().range([height, 0]);

			var dline = d3.line()
			    .x(function(d,i) { return x(d.date);})
			    .y(function(d) {	return y(d.sessions); }
					);

			var darea = d3.area()
					    .x(function(d,i) { return x(d.date);})
							.y0(height)
					    .y1(function(d) {	return y(d.sessions); }
							);

			x.domain(d3.extent(no_active_sessions, function(d) {  return d.date; }));
		  y.domain(d3.extent(no_active_sessions, function(d) { return d.sessions; }));
  		// y.domain([0, d3.max(no_active_sessions, function(d) {  return d.sessions; })]);
			// x.domain(no_active_sessions.map( function(d) { return d.date; }));

		  g.append("g")
		      .attr("transform", "translate(0," + height + ")")
		      .call(
							// d3.axisBottom(x).ticks(25).tickFormat(d3.timeFormat("%b %d"))
							d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%B"))
				   );


		  g.append("g")
		      .call(d3.axisLeft(y))
		    .append("text")
		      .attr("fill", "#000")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", "0.71em")
		      .attr("text-anchor", "end")
		      .text("Number of Sessions");

  			// Citation/Reference:
			// http://www.d3noob.org/2013/01/filling-area-under-graph.html
			// render area chart first before the line chart
			 g.append("g")
				 		.append("path")
			      .attr("fill", "dodgerblue")
						.attr("opacity", .2)
			      .attr("d", darea(no_active_sessions))

  			// Citation/Reference:
				// https://stackoverflow.com/questions/30485750/d3-line-chart-using-path-is-not-showing-anything
			 g.append("g")
			 		.append("path")
		      .attr("fill", "none")
		      .attr("stroke", "steelblue")
		      .attr("stroke-linejoin", "round")
		      .attr("stroke-linecap", "round")
		      .attr("stroke-width", 2)
		      .attr("d", dline(no_active_sessions))



					/*
		 		     This section highlights simple technique in creating grid layout
		 				 as additional guide in the chart and be able to show alignments
						 of value to the x and y axis.
		 		 */

  			// Citation/Reference:
				// http://blockbuilder.org/35degrees/23873a64ceec2390c400694b6a8b57d9
				// Layout Grid

				g.append("g")
			  		.attr("class","grid")
			  		.attr("transform","translate(0," + height + ")")
			  		.style("stroke-dasharray",("3,3"))
			  		.call(make_x_gridlines()
			            .tickSize(-height)
			            .tickFormat("")
			         )
			  g.append("g")
			  		.attr("class","grid")
			  		.style("stroke-dasharray",("3,3"))
			  		.call(make_y_gridlines()
			            .tickSize(-width)
			            .tickFormat("")
			         )

				 function make_x_gridlines() {
			     return d3.axisBottom(x)
			     	.ticks(8)
			   }
			   function make_y_gridlines() {
			     return d3.axisLeft(y)
			     	.ticks(5)
			   }


				 /*  Now handle annotations */

				 var annotation = g.append("g")
					.attr("class","annotation")
					.attr("transform","translate(80,10)")
					.style("font-size","12px")


				annotation.append('rect')
						.attr('width', 260)
						.attr('height', 60)
						.style('fill', "white")
						.style('stroke', "#800")
						.style('stroke-width', 2)

				annotation.append('text')
						.attr('x', 20)
						.attr('y', 20)
						.style('fill', '#800')
						.attr("font-family", "sans-serif")
						.attr("font-size", "14px")
						.text(function(d) { return "There is an observed increase in"; });

				annotation.append('text')
						.attr('x', 20)
						.attr('y', 40)
						.style('fill', '#800')
						.attr("font-family", "sans-serif")
						.attr("font-size", "14px")
						.text(function(d) { return "sessions in March all through May."; });

				g.append('line')
						.style('stroke', "#800")
						.style('stroke-width', 2)
						.attr('x1', 200)
						.attr('y1', 70)
						.attr('x2', 390)
						.attr('y2', 300)


  			// Citation/Reference:
					//Tooltips
				//	http://bl.ocks.org/jadiehm/311fcceab8425ddf1944
				// http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

				//Divides date for tooltip placement
				// See explanation of bisector: https://stackoverflow.com/questions/26882631/d3-what-is-a-bisector
				var bisectDate = d3.bisector(function(d) { return d.date; }).left;

				/*
	 		     This section highlights simple technique in creating tooltips
	 				 to inform user of the value of each bars in the chart.
	 		 */

			  var tooltip = g.append("g")
			      .attr("class", "focus")
			      .style("display", "none");
		    tooltip.append("circle")
				    .style("stroke", "red")
						.style("fill", "red")
		        .attr("r", 6)

			  //Adds text to focus point on line
				tooltip.append('rect')
				.attr("width", 170 )
				.attr("height", 50 )
				.style("stroke", "white")
				.style("fill", "black")
				.attr("x", 9)
				.attr("y", -9)

			  tooltip.append("text")
			      .attr("x", 19)
						.attr("y", 5)
			      .attr("dy", ".35em")
						.attr("fill", "#000")
						.style('position', 'absolute')
						.style('opacity', 1)
						.style('pointer-events', 'all')
						.style('fill', 'white')
						.attr("id", "date")

				tooltip.append("text")
			      .attr("x", 19)
						.attr("y", 25)
			      .attr("dy", ".35em")
						.attr("fill", "#000")
						.style('position', 'absolute')
						.style('opacity', 1)
						.style('pointer-events', 'all')
						.style('fill', 'white')
						.attr("id", "session")

				// append the x line
		     tooltip.append("line")
		         .attr("class", "x")
		         .style("stroke", "blue")
		         .style("stroke-dasharray", "3,3")
		         .style("opacity", 0.5)
		         .attr("y1", 0)
		         .attr("y2", height);

		     // append the y line
		     tooltip.append("line")
		         .attr("class", "y")
		         .style("stroke", "blue")
		         .style("stroke-dasharray", "3,3")
		         .style("opacity", 0.5)
		         .attr("x1", -width)
		         .attr("x2", 0);


				// Create scope of mouse movement
			  g.append("rect")
			      .attr("class", "overlay")
			      .attr("width", width)
			      .attr("height", height)
			      .on("mouseover", function() { tooltip.style("display", null); })
			      .on("mouseout", function() { tooltip.style("display", "none"); })
			      .on("mousemove", mousemove);

			  //Tooltip mouseovers
			  function mousemove() {
			    var x0 = x.invert(d3.mouse(this)[0]),
			        i = bisectDate(no_active_sessions, x0, 1),
			        d0 = no_active_sessions[i - 1],
			        d1 = no_active_sessions[i], d;
							if (typeof(d0) != "undefined" && typeof(d1) != "undefined") {
			        	d = x0 - d0.date > d1.date - x0 ? d1 : d0;
								var monthNames = [ "January", "February", "March", "April", "May", "June",
								    "July", "August", "September", "October", "November", "December" ];

			    			tooltip.attr("transform", "translate(" + x(d.date) + "," + y(d.sessions) + ")");
			    			tooltip.select("#session").text("Sessions: " + formatNumber(d.sessions ));
			    			tooltip.select("#date").text("Date: " +
										monthNames[d.date.getMonth()] + " " + d.date.getDate() + " " + d.date.getFullYear());
							}
			  };



				console.log('zLoaded')
	}

	function handle_DB_Time_Spent(data) {

			db_time_spent = data

			db_time_spent.forEach( function(d) {
							d["JAVA Execs"] = ( d["JAVA Execs"] / 1000000 ).toFixed(2)
							d["PLSQL Execs"] = ( d["PLSQL Execs"] / 1000000 ).toFixed(2)
							d["SQL Execs"] = ( d["SQL Execs"] / 1000000 ).toFixed(2)
							d["DB Time"] = ( d["DB Time"] / 1000000 ).toFixed(2)
			})

	 		var margin = { top: 20, right: 20, bottom: 50, left: 50},
 			     width = 960 - margin.left - margin.right,
 					 height = 500 - margin.top - margin.bottom;

			 // Citation/Reference:
 			// http://bl.ocks.org/binaworks/9dce0a385915e8953a45cc6be7fbde42
 			// Margin Convention
 			var svg = d3.select("#svg_DBTimeSpent")
 			 		.attr("width", width + margin.left + margin.right)
 					.attr("height", height + margin.top + margin.bottom)

 			var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var x1 = d3.scaleBand()
			    .rangeRound([0, width])
			    .paddingInner(0.1);

			var x2 = d3.scaleBand()
			    .padding(0.05);

			var y = d3.scaleLinear()
			    .rangeRound([height, 0]);

			var z = d3.scaleOrdinal()
			    .range(["#1f77b4","#ff7f0e","#d62728","#2ca02c"]);

			var keys = data.columns.slice(1);

			console.log(keys)

			// Citation/Reference:
			// https://bl.ocks.org/mbostock/3887051
	    x1.domain(data.map(function(d) { return d["Months"]; }));
	    x2.domain(keys).rangeRound([0, x1.bandwidth()]);
	    y.domain([0, d3.max(db_time_spent, function(d) { return d3.max(keys, function(key) { return d[key]; }); })])


			g.append("g")
				.selectAll("g")
		    .data(db_time_spent)
		    .enter().append("g")
		      .attr("transform", function(d) { return "translate(" + x1(d["Months"]) + ",0)"; })
		    .selectAll("rect")
		    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
		    .enter().append("rect")
		      .attr("x", function(d) { return x2(d.key); })
		      .attr("y", function(d) { return y(d.value); })
		      .attr("width", x2.bandwidth())
		      .attr("height", function(d) { return height - y(d.value); })
		      .attr("fill", function(d) { return z(d.key); })
					//.data(db_time_spent)
					.on("mouseover", function(d,i) {
							 // var x = parseInt( d3.select(this).style("x"), 10)
							 // var y = parseInt( d3.select(this).style("y"), 10)


							 var isFirefox = typeof InstallTrigger !== 'undefined';
							 var x, y;
							 if (isFirefox) {
									var coordinates = [0, 0];
									coordinates = d3.mouse(this);
									x = parseInt(coordinates[0], 10);
									y = 300
								} else {
									x =  parseInt( d3.select(this).style("x"), 10)
									y =  parseInt( d3.select(this).style("y"), 10)
								}


							 var w = this.parentNode.transform.baseVal.consolidate().matrix
							 x = w.e + x
							 if (x > 710) x = x - 180; else x = x + 30

							 console.log( x, x, y)

							 tooltip.attr("transform", "translate(" + x + "," + y + ")");
							 tooltip.style("display", null);


							 tooltip.select("#metric_name").text("Name: " + d.key );
						 	 tooltip.select("#metric_value").text("Value: " + d.value );

							 var fill = "fill:red;stroke-width:1;stroke: black; opacity: 0.8";
							 d3.select(this).attr("style", fill);
					})
					.on("mouseout", function(d,i) {
							 tooltip.style("display", "none")
							 var color = "red"
							 switch (i) {
											case 0: color = "#1f77b4"; break
											case 1: color = "#ff7f0e"; break
											case 2:  color = "#d62728"; break
											case 3: color = "#2ca02c"; break
							}
							 var fill = "fill:" + color + ";stroke-width:1;stroke: black; opacity: 0.8";
								 d3.select(this).attr("style", fill);
					})

					// Citation/Reference:
					// http://blockbuilder.org/35degrees/23873a64ceec2390c400694b6a8b57d9
					// Layout Grid
					g.append("g")
				  		.attr("class","grid")
				  		.attr("transform","translate(90," + height + ")")
				  		.style("stroke-dasharray",("3,3"))
				  		.call(make_x_gridlines()
				            .tickSize(-height)
				            .tickFormat("")
				         )
				  g.append("g")
				  		.attr("class","grid")
				  		.style("stroke-dasharray",("3,3"))
				  		.call(make_y_gridlines()
				            .tickSize(-width)
				            .tickFormat("")
				         )

				 function make_x_gridlines() {
				     return d3.axisBottom(x1)
				     	.ticks(8)
				   }
				   function make_y_gridlines() {
				     return d3.axisLeft(y)
				     	.ticks(5)
				   }


					 var annotation = g.append("g")
				     .attr("class","annotation")
				     .attr("transform","translate(500,10)")
				     .style("font-size","12px")


					 /* Now let's do annotation */
					 annotation.append('rect')
					     .attr('width', 300)
					     .attr('height', 30)
					     .style('fill', "white")
					     .style('stroke', "#800")
							 .style('stroke-width', 2)

					 annotation.append('text')
					     .attr('x', 20)
					     .attr('y', 20)
							 .style('fill', '#800')
							 .attr("font-family", "sans-serif")
							 .attr("font-size", "14px")
					     .text(function(d) { return "High Accumulated overall DB time in May."; });

					 g.append('line')
					     .style('stroke', "#800")
							 .style('stroke-width', 2)
					     .attr('x1', 800)
							 .attr('y1', 25)
							 .attr('x2', 850)
							 .attr('y2', 25)


			g.append("g")
		      .attr("class", "axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(d3.axisBottom(x1));

		  g.append("g")
		      .attr("class", "axis")
		      .call(d3.axisLeft(y).ticks(null, "s"))
		    .append("text")
		      .attr("x", 2)
		      .attr("y", y(y.ticks().pop()) + 0.5)
		      .attr("dy", "0.32em")
					.attr("fill", "#000")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", "0.71em")
		      .attr("text-anchor", "end")
		      .text("DB Time Spent (in Millions)");

					/*
		 		     This section highlights simple technique in creating legends
		 				 to explain the meaning of the colors chosen for the bars in
		 				 the chart.
		 		 */

		 	   var legend = g.append("g")
		 	     .attr("class","legend")
		 	     .attr("transform","translate(30,5)")
		 	     .style("font-size","12px")

	        legend.append('rect')
	            .attr('width', 200)
	            .attr('height', 100)
	            .style('fill', "white")
	            .style('stroke', "black");

	        legend.append('circle')
               .attr('cx', 25)
               .attr('cy', 15)
	            .style('fill', "#1f77b4")
	            .style('stroke', "black")
	                        .attr("r", 8)

	        legend.append('circle')
	            .attr('cx', 25)
	            .attr('cy', 35)
	            .style('fill', "#ff7f0e")
	            .style('stroke', "black")
	                        .attr("r", 8)


	        legend.append('circle')
	            .attr('cx', 25)
	            .attr('cy', 55)
	            .style('fill', "#d62728")
	            .style('stroke', "black")
	                        .attr("r", 8)

	        legend.append('circle')
	            .attr('cx', 25)
	            .attr('cy', 75)
	            .style('fill', "#2ca02c")
	            .style('stroke', "black")
	                        .attr("r", 8)

	        legend.append('text')
	            .attr('x', 50)
	            .attr('y', 20)
	            .text(function(d) { return "SQL Execs"; });

	        legend.append('text')
	            .attr('x', 50)
	            .attr('y', 40)
	            .text(function(d) { return "PLSQL Execs"; });

	        legend.append('text')
	            .attr('x', 50)
	            .attr('y', 60)
	            .text(function(d) { return "JAVA Execs"; });

	        legend.append('text')
	            .attr('x', 50)
	            .attr('y', 80)
	            .text(function(d) { return "DB Time"; });

					/*
							This section highlights simple technique in creating tooltips
													to inform user of the value of each bars in the chart.
					*/

					var tooltip = g.append("g").data(db_time_spent)
													.attr("class", "focus")
													.style("display", "none");

					//Adds text to focus point on line
					tooltip.append('rect')
					.attr("width", 170 )
					.attr("height", 50 )
					.style("stroke", "white")
					.style("fill", "black")
					.attr("x", 9)
					.attr("y", -9)

					tooltip.append("text")
													.attr("x", 19)
													.attr("y", 5)
													.attr("dy", ".35em")
													.attr("fill", "#fff")
													.style('position', 'absolute')
													.style('opacity', 1)
													.style('pointer-events', 'all')
													.style('fill', 'white')
													.attr("id", "metric_name")

					tooltip.append("text")
													.attr("x", 19)
													.attr("y", 25)
													.attr("dy", ".35em")
													.attr("fill", "#fff")
													.style('position', 'absolute')
													.style('opacity', 1)
													.style('pointer-events', 'all')
													.style('fill', 'white')
													.attr("id", "metric_value")


				console.log('bLoaded')
	}


	function handle_User_Activities(data) {

		 user_activities = data

		 user_activities.forEach( function(d) {
						 d["January"] = ( d["January"] - 0).toFixed(2)
						 d["February"] = ( d["February"] - 0 ).toFixed(2)
						 d["March"] = ( d["March"] - 0).toFixed(2)
						 d["April"] = ( d["April"] - 0).toFixed(2)
						 d["May"] = ( d["May"] - 0).toFixed(2)
		 })

		// console.log(user_activites)

		 var margin = { top: 20, right: 20, bottom: 50, left: 50},
						width = 960 - margin.left - margin.right,
						height = 500 - margin.top - margin.bottom;

				// Citation/Reference:
			 // http://bl.ocks.org/binaworks/9dce0a385915e8953a45cc6be7fbde42
			 // Margin Convention
			 var svg = d3.select("#svg_UserActivities")
					 .attr("width", width + margin.left + margin.right)
					 .attr("height", height + margin.top + margin.bottom)

			 var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			 var x1 = d3.scaleBand()
					 .rangeRound([0, width])
					 .paddingInner(0.1);

			 var x2 = d3.scaleBand()
					 .padding(0.05);

			 var y = d3.scaleLinear()
					 .rangeRound([height, 0]);

			 var z = d3.scaleOrdinal()
					 .range(["#1f77b4","#ff7f0e","#d62728","#2ca02c", "#aec7e8"]);

			 var keys = user_activities.columns.slice(1);

			 console.log(keys)

			 // Citation/Reference:
			 // https://bl.ocks.org/mbostock/3887051
			 x1.domain(data.map(function(d) { return d["Calls"]; }));
			 x2.domain(keys).rangeRound([0, x1.bandwidth()]);
			 y.domain([0, d3.max(user_activities, function(d) {
				  p =  d3.max(keys, function(key) { return d[key]; });
					return p  / 10
				})  ])


		 g.append("g")
			 .selectAll("g")
			 .data(user_activities)
			 .enter().append("g")
				 .attr("transform", function(d) { return "translate(" + x1(d["Calls"]) + ",0)"; })
			 .selectAll("rect")
			 .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
			 .enter().append("rect")
				 .attr("x", function(d) { return x2(d.key); })
				 .attr("y", function(d) {
					 	return y( d.value / 10 );	})
				 .attr("width", x2.bandwidth())
				 .attr("height", function(d) { return height - y(d.value / 10 )   ;	})
				 .attr("fill", function(d) { return z(d.key); })
				 //.data(db_time_spent)
				 .on("mouseover", function(d,i) {
							// var x = parseInt( d3.select(this).style("x"), 10)
							// var y = parseInt( d3.select(this).style("y"), 10)


							var isFirefox = typeof InstallTrigger !== 'undefined';
							var x, y;
							if (isFirefox) {
								 var coordinates = [0, 0];
								 coordinates = d3.mouse(this);
								 x = parseInt(coordinates[0], 10);
								 y = 300
							 } else {
								 x =  parseInt( d3.select(this).style("x"), 10)
								 y =  parseInt( d3.select(this).style("y"), 10)
							 }

							var w = this.parentNode.transform.baseVal.consolidate().matrix
							x = w.e + x
							if (x > 710) x = x - 180; else x = x + 30

							console.log( x, x, y)

							tooltip.attr("transform", "translate(" + x + "," + y + ")");
							tooltip.style("display", null);


							tooltip.select("#metric_name").text("Month: " + d.key );
							tooltip.select("#metric_value").text("Activities: " +
										formatNumber( (d.value / 10 ).toFixed(2)) );

							var fill = "fill:red;stroke-width:1;stroke: black; opacity: 0.8";
							d3.select(this).attr("style", fill);
				 })
				 .on("mouseout", function(d,i) {
							tooltip.style("display", "none")
							var color = "red"
							switch (i) {
										 case 0: color = "#1f77b4"; break
										 case 1: color = "#ff7f0e"; break
										 case 2:  color = "#d62728"; break
										 case 3: color = "#2ca02c"; break
										 case 4: color = "#aec7e8"; break
						 }

							var fill = "fill:" + color + ";stroke-width:1;stroke: black; opacity: 0.8";
								d3.select(this).attr("style", fill);
				 })

				 g.append("g")
 						.attr("class", "axis")
 						.attr("transform", "translate(0," + height + ")")
 						.call(d3.axisBottom(x1));

 				g.append("g")
 						.attr("class", "axis")
 						.call(d3.axisLeft(y).ticks(null, "s"))
 					.append("text")
 						.attr("x", 2)
 						.attr("y", y(y.ticks().pop()) + 0.5)
 						.attr("dy", "0.32em")
 						.attr("fill", "#000")
 						.attr("transform", "rotate(-90)")
 						.attr("y", 6)
 						.attr("dy", "0.71em")
 						.attr("text-anchor", "end")
 						.text("User Activities (x10 Scaled)");

					// Citation/Reference:
				 // http://blockbuilder.org/35degrees/23873a64ceec2390c400694b6a8b57d9
				 // Layout Grid
				 g.append("g")
						 .attr("class","grid")
						 .attr("transform","translate(105," + height + ")")
						 .style("stroke-dasharray",("3,3"))
						 .call(d3.axisBottom(x1)
						 			 .ticks(8)
									 .tickSize(-height)
									 .tickFormat("")
								)
				 g.append("g")
						 .attr("class","grid")
						 .style("stroke-dasharray",("3,3"))
						 .call(d3.axisLeft(y)
						 		   .ticks(5)
									 .tickSize(-width)
									 .tickFormat("")
								)

				function make_x_gridlines() {
						return d3.axisBottom(x1)
						 .ticks(8)
					}
					function make_y_gridlines() {
						return d3.axisLeft(y)
						 .ticks(5)
					}


					/*  Now handle annotations */

 				 var annotation = g.append("g")
 					.attr("class","annotation")
 					.attr("transform","translate(80,150)")
 					.style("font-size","12px")


 				annotation.append('rect')
 						.attr('width', 260)
 						.attr('height', 60)
 						.style('fill', "white")
 						.style('stroke', "#800")
 						.style('stroke-width', 2)

 				annotation.append('text')
 						.attr('x', 20)
 						.attr('y', 20)
 						.style('fill', '#800')
 						.attr("font-family", "sans-serif")
 						.attr("font-size", "14px")
 						.text(function(d) { return "It can be observed that"; });

 				annotation.append('text')
 						.attr('x', 20)
 						.attr('y', 40)
 						.style('fill', '#800')
 						.attr("font-family", "sans-serif")
 						.attr("font-size", "14px")
 						.text(function(d) { return "SQL executions are top activities."; });

 				g.append('line')
 						.style('stroke', "#800")
 						.style('stroke-width', 2)
 						.attr('x1', 340)
 						.attr('y1', 180)
 						.attr('x2', 460)
 						.attr('y2', 180)


					/*
						 This section highlights simple technique in creating legends
						 to explain the meaning of the colors chosen for the bars in
						 the chart.
				 */


				 var legend = g.append("g")
					 .attr("class","legend")
					 .attr("transform","translate(30,5)")
					 .style("font-size","12px")

					legend.append('rect')
							.attr('width', 200)
							.attr('height', 120)
							.style('fill', "white")
							.style('stroke', "black");

					legend.append('circle')
								.attr('cx', 25)
								.attr('cy', 15)
							.style('fill', "#1f77b4")
							.style('stroke', "black")
													.attr("r", 8)

					legend.append('circle')
							.attr('cx', 25)
							.attr('cy', 35)
							.style('fill', "#ff7f0e")
							.style('stroke', "black")
													.attr("r", 8)


					legend.append('circle')
							.attr('cx', 25)
							.attr('cy', 55)
							.style('fill', "#d62728")
							.style('stroke', "black")
													.attr("r", 8)

					legend.append('circle')
							.attr('cx', 25)
							.attr('cy', 75)
							.style('fill', "#2ca02c")
							.style('stroke', "black")
													.attr("r", 8)

					legend.append('circle')
							.attr('cx', 25)
							.attr('cy', 95)
							.style('fill', "#aec7e8")
							.style('stroke', "black")
													.attr("r", 8)

					legend.append('text')
							.attr('x', 50)
							.attr('y', 20)
							.text(function(d) { return "January"; });

					legend.append('text')
							.attr('x', 50)
							.attr('y', 40)
							.text(function(d) { return "February"; });

					legend.append('text')
							.attr('x', 50)
							.attr('y', 60)
							.text(function(d) { return "March"; });

					legend.append('text')
							.attr('x', 50)
							.attr('y', 80)
							.text(function(d) { return "April"; });

					legend.append('text')
							.attr('x', 50)
							.attr('y', 100)
							.text(function(d) { return "May"; });

					/*
							This section highlights simple technique in creating tooltips
													to inform user of the value of each bars in the chart.
					*/

					var tooltip = g.append("g").data(user_activities)
													.attr("class", "focus")
													.style("display", "none");

					//Adds text to focus point on line
					tooltip.append('rect')
					.attr("width", 170 )
					.attr("height", 50 )
					.style("stroke", "white")
					.style("fill", "black")
					.attr("x", 9)
					.attr("y", -9)

					tooltip.append("text")
													.attr("x", 19)
													.attr("y", 5)
													.attr("dy", ".35em")
													.attr("fill", "#fff")
													.style('position', 'absolute')
													.style('opacity', 1)
													.style('pointer-events', 'all')
													.style('fill', 'white')
													.attr("id", "metric_name")

					tooltip.append("text")
													.attr("x", 19)
													.attr("y", 25)
													.attr("dy", ".35em")
													.attr("fill", "#fff")
													.style('position', 'absolute')
													.style('opacity', 1)
													.style('pointer-events', 'all')
													.style('fill', 'white')
													.attr("id", "metric_value")


	       console.log('xLoaded')
	  }
