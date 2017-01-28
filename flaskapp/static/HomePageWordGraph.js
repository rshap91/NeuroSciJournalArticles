// SECOND SVG FOR WORD NODES 
var w2 = $('div.wordCounts').width()
var h2 = 650

var svg2 = d3.select(".wordCounts").append('svg')
    .attr('width', w2)
    .attr('height', h2);


//COLOR SCALE FOR TOPICS
var color = d3.scaleOrdinal(d3.schemeCategory20b);



var topics =['Psychiatric_Disorder', 'Cell_Biology', 'Aneurysms', 'Neurons',
       'Peripheral_Nervous_System', 'Stroke', 'Epilepsy', 'Latex',
       'Sclerosis', 'Sleep', 'Cancer', 'Migraine_&_IBS',
       'Procedural_Learning', 'Alzheimers_Dementia', 'Parkinsons']



// FUNCTION THAT WILL GET CALLED WHEN NEW DOCUMENT GETS SENT THROUGH WHICH PARSES AND RENDERS WORD COUNTS ON FORCE GRAPH
function wordGraph(data){    
    window.data = data

    // NODES ARE ALREADY FORMATED IN DATA AS IS
    var nodes = data,
    links = [];
    
    // GENERATE LINK ARRAY WITH SOURCE AND TARGETS USING "WORD" AS THE IDENTIFYER
    data.forEach(function(w){
        curr_topic = w.topic
        filtered = data.filter(function(d){return d.topic == curr_topic})
        for (j=0; j < filtered.length; j++){
            if (filtered[j].word == w.word){continue}
            else {
                links.push({'source':w.word, 'target':filtered[j]['word']})
            }
        }

    })


    // SIZE OF THE NODES WILL BE DETERMINED BY THE WORD COUNT IN THE DOCUMENT
    var circleScale = d3.scalePow()
        .exponent(2)
        .domain(d3.extent(data.map(function(d){return d.count})))
        .range([15,30])
    

    // JOINED NODES AND LINKS
    var graph = {
    "nodes": nodes,
    "links": links 
    }

    
    console.log(graph)

    // RENDER GRAPH
    var simulation = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-300))
        .force("link", d3.forceLink(graph.links).id(function(d){return d['word'];}).distance(100).strength(0.88))
        .force("x", d3.forceX(w2/2)) // pull towards location on x axis
        .force("y", d3.forceY(h2/2)) // pull towards location on y axis     
        .alphaTarget(0.1)
        .on("tick", ticked);

    var g = svg2.append("g"),
        link = g.selectAll(".link"),
        node = g.selectAll(".node");
        nodeText = g.selectAll(".node");

    restart();

    function restart() {

        // Apply the general update pattern to the nodes.
        node = node.data(graph.nodes);
        node.exit().remove();
        node = node.enter().append("circle")
          .attr('r', function(d){return d.count>0 ? circleScale(d.count) : 0})
          .attr("fill", function(d) { return color(d.id); })
          .style('stroke', '#EEE')
          .style('fill', '#EEE')
          .on("mouseenter", function(d) {
              d3.select(".tooltip")
              .transition()
                  .style("opacity", 1)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY) + "px")
                  .text("Topic: " + d.topic)
          })
          .on('mouseleave', function(d){
              d3.select(".tooltip")
              .transition()
                  .style('opacity',0)
          })
          .call(d3.drag()
              .on('start', dragstarted)
              .on('drag', dragged)
              .on('end', dragended))
          .merge(node); 

        nodeText = nodeText.data(graph.nodes)
        nodeText.exit().remove();
        nodeText = nodeText.enter().append("text")
            .text(function(d){ return d.word})
            .style('font-size', function(d){return d.count>0 ? circleScale(d.count):0})
            .style("fill", function(d) { return color(d.topic); })
            .style('fill-opacity', 1)
            .merge(nodeText)

        // Apply the general update pattern to the links.
        link = link.data(graph.links, function(d) { return d.source.id + "-" + d.target.id; });
        link.exit().remove();
        link = link.enter().append("line")
          .attr('stroke','white')
          .attr('stroke-width','0px')
          .merge(link); 
        // Update and restart the simulation.
        simulation.nodes(graph.nodes);
        simulation.force("link").links(graph.links);
        simulation.alpha(1).restart();
    }

    function ticked() {
        node // CX AND CY LIMIT NODES TO BOUNDING BOX
            .attr("cx", function(d) { return d.x = Math.max(circleScale(d.count), Math.min(w2-circleScale(d.count)*2, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(circleScale(d.count), Math.min(h2-circleScale(d.count)*2, d.y)); });

        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })

        nodeText
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.25).restart();
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



}//END OF WORDGRAPH FUNC








