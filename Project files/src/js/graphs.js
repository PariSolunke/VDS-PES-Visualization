$(function() 
{
document.getElementById("selYear").addEventListener("change", filterOnSelectedYear);

//click listeners for each graph to pin it
$(".pesgraphs").click(function (e) {
  console.log(e);
  document.getElementById("PinnedPES").innerHTML="<div style='margin-left:49%; font-weight:bold;'>"+document.querySelector('#selYear').value+"</div>";
  document.getElementById("PinnedPES").innerHTML+= document.getElementById(e.currentTarget.id).innerHTML;
});


var width=document.getElementById("graphs").clientWidth/3;

var margin = {top: 35, right: 30, bottom: 10, left: 40},
height = 400 - margin.top - margin.bottom;
width = width - margin.left - margin.right;


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
    .range([0, height])
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
    .call(d3.axisTop(x).ticks(2).tickFormat(function(d) {
      if(d == "0") return "Male";
      else return "Female";
     }))
     gender_svg.append("text")           // text label for the x axis
       .attr("x", (width/2) )
       .attr("y",   0-margin.top+5)
   .attr("dy", ".71em")
       .style("text-anchor", "middle")
   .style("font-size", "12px") 
       .text("Gender");  


  // Build and Show the X scale for region this time. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var reg_x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["1", "2", "3", "4"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  region_svg.append("g")
    .call(d3.axisTop(reg_x).ticks(4).tickFormat(function(d) {
      if(d == "1") return "South";
      else if(d=="2") return "Northeast";
      else if(d == "3") return "Midwest";
      else return "West";
     }))

     region_svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x",0 - (height / 2))
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("PES Value");

  region_svg.append("text")           // text label for the x axis
       .attr("x", (width/2) )
       .attr("y",   0-margin.top+5)
   .attr("dy", ".71em")
       .style("text-anchor", "middle")
   .style("font-size", "12px") 
       .text("Region");  


  // Build and Show the X scale for region this time. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var race_x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["1", "2", "3"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  race_svg.append("g")
    
    .call(d3.axisTop(race_x).ticks(3).tickFormat(function(d) {
      if(d == "1") return "White";
      else if(d=="2") return "Hispanic";
      else if(d == "3") return "Black";
     }))

     

  race_svg.append("text")           // text label for the x axis
       .attr("x", (width/2) )
       .attr("y",   0-margin.top+5)
   .attr("dy", ".71em")
       .style("text-anchor", "middle")
   .style("font-size", "12px") 
       .text("Race");  


  // Build and Show the X scale for region this time. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var edu_x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["1", "2", "3", "4"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  edu_svg.append("g")

    .call(d3.axisTop(edu_x).ticks(4).tickFormat(function(d) {
      if(d == "1") return "Primary";
      else if(d=="2") return "High School";
      else if(d == "3") return "College";
      else return "Graduate";
     }))

     edu_svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x",0 - (height / 2))
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("PES Value");


     edu_svg.append("text")           // text label for the x axis
       .attr("x", (width/2) )
       .attr("y",   0-margin.top+5)
   .attr("dy", ".71em")
       .style("text-anchor", "middle")
   .style("font-size", "12px") 
       .text("Education");   



  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)


  // Compute the binning for each group of the dataset
  
  var sumstat1a = d3.nest()  // nest function allows to group the calculation per level of a factor
  .key(function(d) { if (d.female==1){return d.female;}})
  .rollup(function(d) {   // For each key..
    input = d.map(function(g) { if (g.female==1){ return g.precarity_age;}})    // Keep the variable called precarity_age
  
    bins = histogram(input)   // And compute the binning on it.
    return(bins)
  })
  .entries(data)


  var sumstat1b = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { if (d.female!=1){return d.female;}})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { if (g.female!=1){ return g.precarity_age;}})    // Keep the variable called precarity_age
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)



  // Compute the binning for each group of the dataset (this time for region)
  var sumstat2a = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) {if (d.region==1) return d.region;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if (g.region==1) return g.precarity_age;})    // Keep the variable called precarity_age
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

    var sumstat2b = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) {if (d.region==2) return d.region;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if (g.region==2) return g.precarity_age;})    // Keep the variable called precarity_age
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

  var sumstat2c = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) {if (d.region==3) return d.region;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if (g.region==3) return g.precarity_age;})    // Keep the variable called precarity_age
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

   var sumstat2d = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) {if (d.region==4) return d.region;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if (g.region==4) return g.precarity_age;})    // Keep the variable called precarity_age
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

  // Compute the binning for each group of the dataset (this time for race)
  var sumstat3a = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { if(d.race==1) return d.race;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if(g.race==1) return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

    var sumstat3b = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { if(d.race==2) return d.race;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if(g.race==2) return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

    var sumstat3c = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { if(d.race==3) return d.race;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if(g.race==3) return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

 


  // edulevel: Compute the binning for each group of the dataset (this time for race)
  var sumstat4a = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { if(d.edulevel==1) return d.edulevel;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if(g.edulevel==1) return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)


    var sumstat4b = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { if(d.edulevel==2) return d.edulevel;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if(g.edulevel==2) return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)


    var sumstat4c = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { if(d.edulevel==3) return d.edulevel;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if(g.edulevel==3) return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)


    var sumstat4d = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { if(d.edulevel==4) return d.edulevel;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) {if(g.edulevel==4) return g.precarity_age;})    // Keep the variable called precarity_age

      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

    
   
  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum1 = [];
  allBins = sumstat1a[0].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum1[0] = d3.max(lengths)
  if(maxNum1[0]==0) 
  {
    allBins = sumstat1a[1].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum1[0] = d3.max(lengths)
  }
  allBins = sumstat1b[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum1[1] = d3.max(lengths)  
  if(maxNum1[1]==0) 
  {
    allBins = sumstat1b[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum1[1] = d3.max(lengths)
  }

 // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum2 = [];
  allBins = sumstat2a[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum2[0] = d3.max(lengths)
  if(maxNum2[0]==0) 
  {
    allBins = sumstat2a[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum2[0] = d3.max(lengths)
  }

  allBins = sumstat2b[0].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum2[1] = d3.max(lengths)  
  if(maxNum2[1]==0) 
  {
    allBins = sumstat2b[1].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum2[1] = d3.max(lengths)
  }

  allBins = sumstat2c[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum2[2] = d3.max(lengths)
  if(maxNum2[2]==0) 
  {
    allBins = sumstat2c[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum2[2] = d3.max(lengths)
  }


  allBins = sumstat2d[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum2[3] = d3.max(lengths)  
  if(maxNum2[3]==0) 
  {
    allBins = sumstat2d[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum2[3] = d3.max(lengths)
  }

    
  // race: What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  
  var maxNum3 = [];
  allBins = sumstat3a[0].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum3[0] = d3.max(lengths)
  if(maxNum3[0]==0) 
  {
    allBins = sumstat3a[1].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum3[0] = d3.max(lengths)
  }


  allBins = sumstat3b[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum3[1] = d3.max(lengths)  
  if(maxNum3[1]==0) 
  {
    allBins = sumstat3b[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum3[1] = d3.max(lengths)
  }

  allBins = sumstat3c[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum3[2] = d3.max(lengths)
  if(maxNum3[2]==0) 
  {
    allBins = sumstat3c[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum3[2] = d3.max(lengths)
  }

    // education: What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.

  var maxNum4 = [];
  allBins = sumstat4a[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum4[0] = d3.max(lengths)
  if(maxNum4[0]==0) 
  {
    allBins = sumstat4a[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum4[0] = d3.max(lengths)
  }

  allBins = sumstat4b[0].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum4[1] = d3.max(lengths)  
  if(maxNum4[1]==0) 
  {
    allBins = sumstat4b[1].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum4[1] = d3.max(lengths)
  }

  allBins = sumstat4c[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum4[2] = d3.max(lengths)
  if(maxNum4[2]==0) 
  {
    allBins = sumstat4c[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum4[2] = d3.max(lengths)
  }


  allBins = sumstat4d[1].value
  lengths = allBins.map(function(a){return a.length;})
  maxNum4[3] = d3.max(lengths)
  if(maxNum4[3]==0) 
  {
    allBins = sumstat4d[0].value
    lengths = allBins.map(function(a){return a.length;})
    maxNum4[3] = d3.max(lengths)
  }
  
  
  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group (each individual variable corresponds to 1 violin)
  var xNum1a = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum1[0],maxNum1[0]])

  var xNum1b = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum1[1],maxNum1[1]])

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum2a = d3.scaleLinear()
    .range([0, reg_x.bandwidth()])
    .domain([-maxNum2[0],maxNum2[0]])

    var xNum2b = d3.scaleLinear()
    .range([0, reg_x.bandwidth()])
    .domain([-maxNum2[1],maxNum2[1]])

    var xNum2c = d3.scaleLinear()
    .range([0, reg_x.bandwidth()])
    .domain([-maxNum2[2],maxNum2[2]])

    var xNum2d = d3.scaleLinear()
    .range([0, reg_x.bandwidth()])
    .domain([-maxNum2[3],maxNum2[3]])

// The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum3a = d3.scaleLinear()
  .range([0, race_x.bandwidth()])
  .domain([-maxNum3[0],maxNum3[0]])

  var xNum3b = d3.scaleLinear()
  .range([0, race_x.bandwidth()])
  .domain([-maxNum3[1],maxNum3[1]])

  var xNum3c = d3.scaleLinear()
  .range([0, race_x.bandwidth()])
  .domain([-maxNum3[2],maxNum3[2]])


  //edulevel: The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum4a = d3.scaleLinear()
    .range([0, edu_x.bandwidth()])
    .domain([-maxNum4[0],maxNum4[0]])

    var xNum4b = d3.scaleLinear()
    .range([0, edu_x.bandwidth()])
    .domain([-maxNum4[1],maxNum4[1]])

    var xNum4c = d3.scaleLinear()
    .range([0, edu_x.bandwidth()])
    .domain([-maxNum4[2],maxNum4[2]])

    var xNum4d = d3.scaleLinear()
    .range([0, edu_x.bandwidth()])
    .domain([-maxNum4[3],maxNum4[3]])

  // Add the shape to this svg!
  gender_svg
    .selectAll("myViolin")
    .data(sumstat1a)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .attr("d", d3.area()
            .x0(function(d){ return(xNum1a(-d.length)) } )
            .x1(function(d){ return(xNum1a(d.length)) } )
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

  gender_svg
  .selectAll("myViolin")
        .data(sumstat1b)
        .enter()        // So now we are working group per group
        .append("g")
          .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
        .append("path")
            .datum(function(d){ return(d.value)})     // So now we are working bin per bin
            .style("stroke", "none")
            .style("fill","#69b3a2")
            .attr("d", d3.area()
                .x0(function(d){ return(xNum1b(-d.length)) } )
                .x1(function(d){ return(xNum1b(d.length)) } )
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
    .data(sumstat2a)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + reg_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum2a(-d.length)) } )
            .x1(function(d){ return(xNum2a(d.length)) } )
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


  region_svg
    .selectAll("myViolin")
    .data(sumstat2b)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + reg_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum2b(-d.length)) } )
            .x1(function(d){ return(xNum2b(d.length)) } )
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


  region_svg
    .selectAll("myViolin")
    .data(sumstat2c)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + reg_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum2c(-d.length)) } )
            .x1(function(d){ return(xNum2c(d.length)) } )
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

  region_svg
    .selectAll("myViolin")
    .data(sumstat2d)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + reg_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum2d(-d.length)) } )
            .x1(function(d){ return(xNum2d(d.length)) } )
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
    .data(sumstat3a)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + race_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum3a(-d.length)) } )
            .x1(function(d){ return(xNum3a(d.length)) } )
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

        race_svg
        .selectAll("myViolin")
        .data(sumstat3b)
        .enter()        // So now we are working group per group
        .append("g")
          .attr("transform", function(d){ return("translate(" + race_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
        .append("path")
            .datum(function(d){ return(d.value)})     // So now we are working bin per bin
            .style("stroke", "none")
            .style("fill","#69b3a2")
            .style("opacity", 1)
            .attr("d", d3.area()
                .x0(function(d){ return(xNum3b(-d.length)) } )
                .x1(function(d){ return(xNum3b(d.length)) } )
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


        race_svg
        .selectAll("myViolin")
        .data(sumstat3c)
        .enter()        // So now we are working group per group
        .append("g")
          .attr("transform", function(d){ return("translate(" + race_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
        .append("path")
            .datum(function(d){ return(d.value)})     // So now we are working bin per bin
            .style("stroke", "none")
            .style("fill","#69b3a2")
            .style("opacity", 1)
            .attr("d", d3.area()
                .x0(function(d){ return(xNum3c(-d.length)) } )
                .x1(function(d){ return(xNum3c(d.length)) } )
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
    .data(sumstat4a)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + edu_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .style("opacity", 1)
        .attr("d", d3.area()
            .x0(function(d){ return(xNum4a(-d.length)) } )
            .x1(function(d){ return(xNum4a(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )  ;

          edu_svg
          .selectAll("myViolin")
          .data(sumstat4b)
          .enter()        // So now we are working group per group
          .append("g")
            .attr("transform", function(d){ return("translate(" + edu_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
          .append("path")
              .datum(function(d){ return(d.value)})     // So now we are working bin per bin
              .style("stroke", "none")
              .style("fill","#69b3a2")
              .style("opacity", 1)
              .attr("d", d3.area()
                  .x0(function(d){ return(xNum4b(-d.length)) } )
                  .x1(function(d){ return(xNum4b(d.length)) } )
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

          edu_svg
          .selectAll("myViolin")
          .data(sumstat4c)
          .enter()        // So now we are working group per group
          .append("g")
            .attr("transform", function(d){ return("translate(" + edu_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
          .append("path")
              .datum(function(d){ return(d.value)})     // So now we are working bin per bin
              .style("stroke", "none")
              .style("fill","#69b3a2")
              .style("opacity", 1)
              .attr("d", d3.area()
                  .x0(function(d){ return(xNum4c(-d.length)) } )
                  .x1(function(d){ return(xNum4c(d.length)) } )
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

          edu_svg
          .selectAll("myViolin")
          .data(sumstat4d)
          .enter()        // So now we are working group per group
          .append("g")
            .attr("transform", function(d){ return("translate(" + edu_x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
          .append("path")
              .datum(function(d){ return(d.value)})     // So now we are working bin per bin
              .style("stroke", "none")
              .style("fill","#69b3a2")
              .style("opacity", 1)
              .attr("d", d3.area()
                  .x0(function(d){ return(xNum4d(-d.length)) } )
                  .x1(function(d){ return(xNum4d(d.length)) } )
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

//data for radar plot
var data = {
  '1988' :[
     [
  {axis:"Material Rewards",value:0.5604},
  {axis:"Working Time Arrangements",value:0.5414},
  {axis:"Stability",value:0.5510},
  {axis:"Workers' Rights",value:0.5916},
  {axis:"Collective Organization",value:0.9804},
  {axis:"Interpersonal Relations",value:0.7413},
  {axis:"Training",value:0.8689}			
  ]
  ],
   '1990' :[
     [
  {axis:"Material Rewards",value:0.5619},
  {axis:"Working Time Arrangements",value:0.6266},
  {axis:"Stability",value:0.5279},
  {axis:"Workers' Rights",value:0.5572},
  {axis:"Collective Organization",value:0.9780},
  {axis:"Interpersonal Relations",value:0.7172},
  {axis:"Training",value:0.8260}			
  ]
  ],
  '1992' :[
     [
  {axis:"Material Rewards",value:0.6159},
  {axis:"Working Time Arrangements",value:0.6408},
  {axis:"Stability",value:0.5514},
  {axis:"Workers' Rights",value:0.5887},
  {axis:"Collective Organization",value:1.0123},
  {axis:"Interpersonal Relations",value:0.7434},
  {axis:"Training",value:0.8409}			
  ]
  ],
  '1994' :[
     [
  {axis:"Material Rewards",value:0.6359},
  {axis:"Working Time Arrangements",value:0.6707},
  {axis:"Stability",value:0.5743},
  {axis:"Workers' Rights",value:0.6315},
  {axis:"Collective Organization",value:1.0450},
  {axis:"Interpersonal Relations",value:0.7635},
  {axis:"Training",value:0.9071}			
  ]
  ],

'1996' :[
     [
  {axis:"Material Rewards",value:0.5938},
  {axis:"Working Time Arrangements",value:0.6160},
  {axis:"Stability",value:0.5066},
  {axis:"Workers' Rights",value:0.5530},
  {axis:"Collective Organization",value:1.0073},
  {axis:"Interpersonal Relations",value:0.6783},
  {axis:"Training",value:0.8381}			
  ]
  ],

'1998' :[
     [
  {axis:"Material Rewards",value:0.6023},
  {axis:"Working Time Arrangements",value:0.6036},
  {axis:"Stability",value:0.5045},
  {axis:"Workers' Rights",value:0.5318},
  {axis:"Collective Organization",value:1.0152},
  {axis:"Interpersonal Relations",value:0.6673},
  {axis:"Training",value:0.8200}			
  ]
  ],

  '2000' :[
     [
  {axis:"Material Rewards",value:0.6031},
  {axis:"Working Time Arrangements",value:0.6068},
  {axis:"Stability",value:0.4694},
  {axis:"Workers' Rights",value:0.5048},
  {axis:"Collective Organization",value:1.0161},
  {axis:"Interpersonal Relations",value:0.6403},
  {axis:"Training",value:0.8015}			
  ]
  ],

  '2002' :[
     [
  {axis:"Material Rewards",value:0.6464},
  {axis:"Working Time Arrangements",value:0.6029},
  {axis:"Stability",value:0.5000},
  {axis:"Workers' Rights",value:0.5140},
  {axis:"Collective Organization",value:1.0434},
  {axis:"Interpersonal Relations",value:0.6552},
  {axis:"Training",value:0.8279}			
  ]
  ],

  '2004' :[
     [
  {axis:"Material Rewards",value:0.6822},
  {axis:"Working Time Arrangements",value:0.6349},
  {axis:"Stability",value:0.5366},
  {axis:"Workers' Rights",value:0.5479},
  {axis:"Collective Organization",value:1.0680},
  {axis:"Interpersonal Relations",value:0.6756},
  {axis:"Training",value:0.8634}			
  ]
  ],

  '2006' :[
     [
  {axis:"Material Rewards",value:0.7171},
  {axis:"Working Time Arrangements",value:0.6714},
  {axis:"Stability",value:0.5867},
  {axis:"Workers' Rights",value:0.5810},
  {axis:"Collective Organization",value:1.1013},
  {axis:"Interpersonal Relations",value:0.7028},
  {axis:"Training",value:0.8813}			
  ]
  ],

 '2008' :[
     [
  {axis:"Material Rewards",value:0.7437},
  {axis:"Working Time Arrangements",value:0.6991},
  {axis:"Stability",value:0.6203},
  {axis:"Workers' Rights",value:0.6131},
  {axis:"Collective Organization",value:1.1383},
  {axis:"Interpersonal Relations",value:0.7256},
  {axis:"Training",value:0.9042}			
  ]
  ],

  '2010' :[
     [
  {axis:"Material Rewards",value:0.7666},
  {axis:"Working Time Arrangements",value:0.7251},
  {axis:"Stability",value:0.6390},
  {axis:"Workers' Rights",value:0.6431},
  {axis:"Collective Organization",value:1.1519},
  {axis:"Interpersonal Relations",value:0.7348},
  {axis:"Training",value:0.9464}			
  ]
  ],


'2012' :[
     [
  {axis:"Material Rewards",value:0.8236},
  {axis:"Working Time Arrangements",value:0.7847},
  {axis:"Stability",value:0.6709},
  {axis:"Workers' Rights",value:0.6913},
  {axis:"Collective Organization",value:1.203},
  {axis:"Interpersonal Relations",value:0.7677},
  {axis:"Training",value:0.9775}			
  ]
  ],

'2014' :[
     [
  {axis:"Material Rewards",value:0.8680},
  {axis:"Working Time Arrangements",value:0.8360},
  {axis:"Stability",value:0.7203},
  {axis:"Workers' Rights",value:0.7422},
  {axis:"Collective Organization",value:1.2463},
  {axis:"Interpersonal Relations",value:0.8072},
  {axis:"Training",value:1.0259}			
  ]
  ],

'2016' :[
     [
  {axis:"Material Rewards",value:0.9397},
  {axis:"Working Time Arrangements",value:0.8441},
  {axis:"Stability",value:0.7194},
  {axis:"Workers' Rights",value:0.7427},
  {axis:"Collective Organization",value:1.2570},
  {axis:"Interpersonal Relations",value:0.7866},
  {axis:"Training",value:1.0188}			
  ]
  ]

};

// Draw the Chart 
var width2=document.getElementById("graphs").clientWidth/3;

var margin2 = {top: 40, right: 50, bottom: 0, left: 60},
height2 = 400 - margin2.top - margin2.bottom;
width2 = width2 - margin2.left - margin2.right;

var colorscale = d3.scaleOrdinal()
.range(["#CC333F","#EDC951","#00A0B0"]);


var radarChartOptions = {
w: width2,
h: height2,
margin: margin2,
maxValue: 1.3,
levels: 5,
roundStrokes: true,
color: colorscale
};
//Call function to draw the Radar chart
RadarChart("#RadarPES",  data[selectedYear], radarChartOptions,width2);



}


function RadarChart(id, data, options,wd) {
	var cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 5,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.2, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scaleOrdinal(d3.schemeCategory10)   //Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
	

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
  //Append a g element		
  
  svg.append("text")           // text label 
      .attr("x", (wd*3/4) )
      .attr("y",   15)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .style("font-size", "14px") 
       .text("Precarity Scores of PES Domains"); 

	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Math.round((maxValue*(5-i)/5) * 10) / 10  });

	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);


	
  //The radial line function
  
  var radarLine= d3.lineRadial()
  .curve(d3.curveLinearClosed)
  .radius(function(d) { return rScale(d.value); })
  .angle(function(d,i) {	return i*angleSlice; });
        

	 
		
		
	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed);
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);

	
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "blue")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(d.value)
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
	


	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}
	
}








});