console.log('hello')

var topics = ['Sleep', 'Memory', "Genetics", 'Psychiatric_Disorder', 'Attention', 'ImmuneSystem_Cancer',
        'Neurons', 'Animal_Experiments', 'Alzheimers_Dementia_Parkinson',
        "Dependency", "Pain_MotorFunction", 'Stroke_Aneurysm_Damage', 'Developmental_Disorders', 
        'Brain_Mapping', 'Coding_Latex']




var MaxTopicKeys = ['Max_Topic_Name','Max_Topic_Val']


// MARGIN CONVENTION
// 1) def margins (all 40 or 20 for top bottom 10 for left right)
var margin = {top:10, right:10, bottom:40, left:150}
// 2) def width/height with margins subtracted
var width = 600 - margin.right - margin.left
var height = 350 - margin.top - margin.bottom



// 3) define svg and give it a 'g' tag that translates by the top & left margin
svg = d3.select('.barchart').append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom) ///... seems redundant
    .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('class','barchart_g')


// AXIS CONVENTION
// 1) create scales
var xScale = d3.scaleLinear()
    .range([0,width])
    // specify domain in draw function

var yScale = d3.scaleBand()
    .domain(topics)
    .range([margin.top, height], 0.2)


// 2) create axis functions...

var xAxis = d3.axisBottom(xScale)
    .tickSize(-height+margin.top)

var yAxis = d3.axisLeft(yScale)
    .tickSize(-width)

// 3) create containers for the axes that .call them
var xAx = svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'x axis')
    .call(xAxis)
   
var yAx = svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .selectAll('text')
        .style("text-anchor", "end")
        // .attr("dx", "-.8em")
        //.attr("dy", "-.03em")


// ------------------------------------------------------------------------------ //
// Draw Function that will render the chart with passed data

function draw_barchart(obj){
    
    var topicData =[]
    for (t=0; t<topics.length; t++ ) {  
        topicData.push({'topic':topics[t], 'value':obj[topics[t]]})
    }
    console.log(topicData)

    var svg = d3.select('.barchart_g')

    // 1) set xScale domain to data

    xScale.domain(d3.extent(topicData.map(function(d){return d.value})))
    svg.select('.x').transition().duration(850).call(xAxis)

    var rects = svg.selectAll('rect').data(topicData)
        
    rects.attr('class', 'topic_bars')

    rects.exit().remove()

    rects
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', function(d){return yScale(d.topic)})
        .attr('width', 1)
        .attr('height', 20)
        .style('fill', function(d){return color(d.topic)})
        .style('opacity', 0)
        .transition()
            .attr('width', function(d){return xScale(d.value)})
            .style('opacity', 0.88)
            .duration(1250)

    rects.transition()
        .duration(600)
        .attr('x', 0)
        .attr('y', function(d){return yScale(d.topic)})
        .attr('width', 0)
        .attr('height', 20)
        .style('fill', function(d){return color(d.topic)})
        .style('opacity', 0)
        .transition()
            .attr('width', function(d){return xScale(d.value)})
            .style('opacity', 0.88)
            .duration(1250)


    var x_axLine = svg.append('line')
        .attr('x1',0)
        .attr('x2', width)
        .attr('y1', height-2)
        .attr('y2', height-2)
        .attr('stroke', 'black')
        .attr('stroke-width', '6px')

    var y_axLine = svg.append('line')
        .attr('x1',0)
        .attr('x2', 0)
        .attr('y1', margin.top)
        .attr('y2', height)
        .attr('stroke', 'black')
        .attr('stroke-width', '6px')

}// END DRAW FUNCTION



