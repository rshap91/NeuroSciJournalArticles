 
var svg2 = d3.select("#wordCounts").append('svg')
    .attr('width', '550px')
    .attr('height', '350px');




var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-30)) // internodal strength
    .force("link", d3.forceLink().id(function(d) { return d['']; }).distance(10).strength(0.5)) // creates a force connecting links. Id points to related id in nodes 
    .force("x", d3.forceX(200)) // pull towards location on x axis
    .force("y", d3.forceY(125)) // pull towards location on y axis
    .force("center", d3.forceCenter(225, 175));

window.sim = simulation

var color = d3.scaleOrdinal(d3.schemeCategory20b);


var topics = ['Dependency', 'Coding_Latex', 'Brain_Modelling', 'Stroke_Aneurysm_Damage', 
        'Memory', 'Attention', 'Psychiatric_Disorder', 'Cancer_Genetics', 
        'Depression_ADHD', 'Pain_MotorFunction','Neurons', 'Sleep','BrainMapping', 
        'Alzheimers_Dementia_Parkinson', 'Animal_Experiments']


function wordGraph(data){    
    console.log(data)
    window.data = data


    var nodes = data,
    links = [];
    
    data.forEach(function(w){
        curr_topic = w.topic
        filtered = data.filter(function(d){return d.topic == curr_topic})
        for (j=0; j < filtered.length; j++){
            if (filtered[j].word == w.word){continue}
            else {
                links.push({'source':w[''], 'target':filtered[j]['']})
            }
        }

    })

    console.log(links)


    var circleScale = d3.scalePow()
        .exponent(2)
        .domain(d3.extent(data.map(function(d){return d.count})))
        .range([15,40])
    

    var graph = {
    "nodes": nodes,
    "links": links 
    }

    
    console.log(graph)


    var link = svg2
        .selectAll("line")
        .data(graph.links)

    link.attr('class', 'line')

    link.exit().remove()


    link.enter().append("line")
        .attr('stroke','black')
        .attr('stroke-width', '3px')
        .merge(link);

    link.attr('stroke','black').attr('stroke-width','3px')


    var node = svg2
        .selectAll("circle")
        .data(graph.nodes)

    node.attr("class", function(d) { return 'node ' +  d.topic; })

    node.exit().remove()

    node.enter().append("circle")
        .attr('r', function(d){return d.count>0 ? circleScale(d.count) : 0})
        .style('stroke', '#EEE')
        .style('fill', '#EEE')
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseenter", function(d) {
            d3.select(this)
            .style("stroke-width", 1.5)
            .style("stroke-dasharray", 0)
            d3.select("#tooltip")
            .transition()
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text("Topic: " + d.topic + "\nCount: " + d.count)
        })
        .on('mouseleave', function(d){
            d3.select("#tooltip")
            .transition()
                .style('opacity',0)
        })
        .merge(node)

    node.attr('r', function(d){return d.count>0 ? circleScale(d.count) : 0})
        .style('stroke', '#EEE')
        .style('fill', '#EEE')
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseenter", function(d) {
            d3.select(this)
            .style("stroke-width", 1.5)
            .style("stroke-dasharray", 0)
            d3.select("#tooltip")
            .transition()
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text("Topic: " + d.topic + "\nCount: " + d.count)
        })
        .on('mouseleave', function(d){
            d3.select("#tooltip")
            .transition()
                .style('opacity',0)
        })


    var text = svg2
        .selectAll("text")
        .data(graph.nodes)

    text.attr('class', function(d){return 'text ' + d.topic})

    text.exit().remove()

    text.enter().append("text")
        .text(function(d, i) { return d.word; })
        .style('font-size', function(d){return d.count>0 ? circleScale(d.count):0})
        .style("fill", function(d) { return color(d.topic); })
        .style('fill-opacity', 1)
        .merge(text);

    text.text(function(d, i) { return d.word; })
        .style('font-size', function(d){return d.count>0 ? circleScale(d.count):0})
        .style("fill", function(d) { return color(d.topic); })
        .style('fill-opacity', 1);
    

    window.node = node
    window.link = link

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);


function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    text
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    }

}//END OF WORDGRAPH FUNC

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
