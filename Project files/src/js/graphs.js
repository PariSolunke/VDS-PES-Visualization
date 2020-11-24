$(function() 
{
document.getElementById("selYear").addEventListener("change", filterOnSelectedYear);


var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#genderPES")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "plottedSvg");


// append the svg object to the body of the page
var region_svg = d3.select("#regionPES")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "plottedSvg");

// append the svg object to the body of the page
var race_svg = d3.select("#racePES")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// append the svg object to the body of the page
var edu_svg = d3.select("#eduLevelPES")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          
filterOnSelectedYear();

function filterOnSelectedYear(){
  document.querySelector('#genderPES svg').remove()
  document.querySelector('#regionPES svg').remove()
  document.querySelector('#racePES svg').remove()
  document.querySelector('#eduLevelPES svg').remove()
 

  var gender_svg = d3.select("#genderPES")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "plottedSvg");


  var region_svg = d3.select("#regionPES")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "plottedSvg");

  // append the svg object to the body of the page
  var race_svg = d3.select("#racePES")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // append the svg object to the body of the page
  var edu_svg = d3.select("#eduLevelPES")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var selectedYear = document.querySelector('#selYear').value;


  // Read the data and compute summary statistics for each selected year
  d3.csv("/../../PESscores.csv").then(function(data) {
    data = data.filter(d => d.year==selectedYear);
  
  
  //div for tooltip
  var div = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


  precarity_scores = []
    for (const i in data){
        precarity_scores.push(data[i]['precarity_age'])
  }

  //finding the max value
  var max = 0;

  for(key in precarity_scores){
      if (precarity_scores[key] > max){
      max = precarity_scores[key]
      }

  }
  

  //finding the min value
  var min = precarity_scores[0];

  for(key in precarity_scores){
      if (precarity_scores[key] < min){
      min = precarity_scores[key]
      }

  }

  // Build and Show the Y scale
  //decided to start at -1 since the min was -0.04 and it would make the graph look unpleasant
  var y = d3.scaleLinear()
    .domain([-1, max])          // Note that here the Y scale is set manually
    .range([height, 0])
  gender_svg.append("g").call(d3.axisLeft(y).ticks(9).tickFormat(function(d) {
 
    if(d == 8) return "Nojob";
    else
    return d;
  
   }))
  region_svg.append("g").call(d3.axisLeft(y).ticks(9).tickFormat(function(d) {
    
    if(d == 8) return "Nojob";
    else
    return d;
  
   }))
  race_svg.append("g").call(d3.axisLeft(y).ticks(9).tickFormat(function(d) {

    if(d == 8) return "Nojob";
    else
    return d;
  
   }))
  edu_svg.append("g").call(d3.axisLeft(y).ticks(9).tickFormat(function(d) {
    
    if(d == 8) return "Nojob";
    else
    return d;
  
   }))
  


  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["0", "1"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.

  gender_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(2).tickFormat(function(d) {
      if(d == "0") return "Male";
      else return "Female";
     }))

  // Build and Show the X scale for region this time. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var reg_x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["1", "2", "3", "4"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  region_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(reg_x).ticks(4).tickFormat(function(d) {
      if(d == "1") return "South";
      else if(d=="2") return "Northeast";
      else if(d == "3") return "Midwest";
      else return "West";
     }))

  // Build and Show the X scale for region this time. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var race_x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["1", "2", "3", "4"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  race_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(race_x).ticks(4).tickFormat(function(d) {
      if(d == "1") return "Non-Hispanic White";
      else if(d=="2") return "Hispanic";
      else if(d == "3") return "Non-Hispanic Black";
      else return "Other";
     }))


  // Build and Show the X scale for region this time. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var edu_x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["1", "2", "3", "4"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  edu_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(edu_x).ticks(4).tickFormat(function(d) {
      if(d == "1") return "Primary";
      else if(d=="2") return "High School";
      else if(d == "3") return "College";
      else return "Graduate";
     }))



  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)


  // Compute the binning for each group of the dataset
  var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.female;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

  // Compute the binning for each group of the dataset (this time for region)
  var sumstat2 = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.region;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

  // Compute the binning for each group of the dataset (this time for race)
  var sumstat3 = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.race;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)


  // edulevel: Compute the binning for each group of the dataset (this time for race)
  var sumstat4 = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.edulevel;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum = 0
  for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return a.length;})
    longuest = d3.max(lengths)
    if (longuest > maxNum) { maxNum = longuest }
  }

  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum2 = 0
  for ( i in sumstat2 ){
    allBins2 = sumstat2[i].value
    lengths = allBins2.map(function(a){return a.length;})
    longuest2 = d3.max(lengths)
    if (longuest2 > maxNum2) { maxNum2 = longuest2 }
  }


  // race: What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum3 = 0
  for ( i in sumstat3 ){
    allBins3 = sumstat3[i].value
    lengths = allBins3.map(function(a){return a.length;})
    longuest3 = d3.max(lengths)
    if (longuest3 > maxNum3) { maxNum3 = longuest3 }
  }

  // edulevel: What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum4 = 0
  for ( i in sumstat4 ){
    allBins4 = sumstat4[i].value
    lengths = allBins4.map(function(a){return a.length;})
    longuest4 = d3.max(lengths)
    if (longuest4 > maxNum4) { maxNum4 = longuest4 }
  }

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum2 = d3.scaleLinear()
    .range([0, reg_x.bandwidth()])
    .domain([-maxNum2,maxNum2])


  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum3 = d3.scaleLinear()
    .range([0, race_x.bandwidth()])
    .domain([-maxNum3,maxNum3])


  //edulevel: The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum4 = d3.scaleLinear()
    .range([0, edu_x.bandwidth()])
    .domain([-maxNum4,maxNum4])

  // Add the shape to this svg!
  gender_svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )
        .on("mouseover", function(d) {
          var sum = 0;
          var counter = 0;
          var mean = 0;
          var i;
          var j;
          for (i =0; i<d.length; i++ ){
            for (j =0; j<d[i].length - 1; j++ ) //-1 to not get x0 and x1
            sum += parseInt(d[i][j]);
            counter += d[i].length -2 ; // if I add 1, it'll give i, but we need i * j for the total counter, therefore d[i].length times i (-2 to not get x0 and x1)

          }
         
          mean = sum/counter;
          
          div.transition()
         .duration(200)
         .style("opacity", .8);
         div.text("mean: " + mean)// this will appear
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
})
            // fade out tooltip on mouse out
  .on("mouseout", function(d) {
      div.transition()
         .duration(500)
         .style("opacity", 0);
  });
  // Add the shape to this svg!
  region_svg
    .selectAll("myViolin")
    .data(sumstat2)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + reg_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum2(-d.length)) } )
            .x1(function(d){ return(xNum2(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        ).on("mouseover", function(d) {
          var sum = 0;
          var counter = 0;
          var mean = 0;
          var i;
          var j;
          for (i =0; i<d.length; i++ ){
            for (j =0; j<d[i].length - 1; j++ ) //-1 to not get x0 and x1
            sum += parseInt(d[i][j]);
            counter += d[i].length -2 ; // if I add 1, it'll give i, but we need i * j for the total counter, therefore d[i].length times i (-2 to not get x0 and x1)

          }
          mean = sum/counter;
          div.transition()
         .duration(200)
         .style("opacity", .9);
         div.text("mean: " + mean)// this will appear
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
     })
// fade out tooltip on mouse out
.on("mouseout", function(d) {
  div.transition()
     .duration(500)
     .style("opacity", 0);
});


  // Add the shape to this svg!
  race_svg
    .selectAll("myViolin")
    .data(sumstat3)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + race_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum3(-d.length)) } )
            .x1(function(d){ return(xNum3(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        ) .on("mouseover", function(d) {
          var sum = 0;
          var counter = 0;
          var mean = 0;
          var i;
          var j;
          for (i =0; i<d.length; i++ ){
            for (j =0; j<d[i].length - 1; j++ ) //-1 to not get x0 and x1
            sum += parseInt(d[i][j]);
            counter += d[i].length -2 ; // if I add 1, it'll give i, but we need i * j for the total counter, therefore d[i].length times i (-2 to not get x0 and x1)

          }
          mean = sum/counter;
          div.transition()
         .duration(200)
         .style("opacity", .9);
         div.text("mean: " + mean)// this will appear
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
     })
// fade out tooltip on mouse out
.on("mouseout", function(d) {
  div.transition()
     .duration(500)
     .style("opacity", 0);
});

  // Add the shape to this svg!
  edu_svg
    .selectAll("myViolin")
    .data(sumstat4)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + edu_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum4(-d.length)) } )
            .x1(function(d){ return(xNum4(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )  .on("mouseover", function(d) {
          var sum = 0;
          var counter = 0;
          var mean = 0;
          var i;
          var j;
          for (i =0; i<d.length; i++ ){
            for (j =0; j<d[i].length - 1; j++ ) //-1 to not get x0 and x1
            sum += parseInt(d[i][j]);
            counter += d[i].length -2 ; // if I add 1, it'll give i, but we need i * j for the total counter, therefore d[i].length times i (-2 to not get x0 and x1)

          }
          mean = sum/counter;
          div.transition()
         .duration(200)
         .style("opacity", .9);
         div.text("mean: " + mean)// this will appear
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
     })
// fade out tooltip on mouse out
.on("mouseout", function(d) {
  div.transition()
     .duration(500)
     .style("opacity", 0);
});



})


}








});