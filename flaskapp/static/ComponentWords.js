// SECOND SVG FOR WORD NODES 
var w2 = 650
var h2 = 350

var svg2 = d3.select(".wordCounts").append('svg')
    .attr('width', w2)
    .attr('height', h2);

// SUB G'S FOR NODE/LINKS/TEXT
var nodeg = svg2.append('g').attr('class','nodes_g')
var linkg = svg2.append('g').attr('class','links_g')
var textg = svg2.append('g').attr('class','text_g')


//COLOR SCALE FOR TOPICS
var color = d3.scaleOrdinal(d3.schemeCategory20b);


var topics = ['Sleep', 'Memory', "Genetics", 'Psychiatric_Disorder', 'Attention', 'ImmuneSystem_Cancer',
        'Neurons', 'Animal_Experiments', 'Alzheimers_Dementia_Parkinson',
        "Dependency", "Pain_MotorFunction", 'Stroke_Aneurysm_Damage', 'Developmental_Disorders', 
        'Brain_Mapping', 'Coding_Latex']


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

    console.log(links)

    // SIZE OF THE NODES WILL BE DETERMINED BY THE WORD COUNT IN THE DOCUMENT
    var circleScale = d3.scalePow()
        .exponent(2)
        .domain(d3.extent(data.map(function(d){return d.count})))
        .range([12,35])
    

    // JOINED NODES AND LINKS
    var graph = {
    "nodes": nodes,
    "links": links 
    }

    
    console.log(graph)

    // RENDER GRAPH

    var node = nodeg
        .selectAll('circle')
        .data(graph.nodes)
    
    //EXIT
    node.exit().remove()


    //UPDATE
    node
        .attr('r', function(d){return d.count>0 ? circleScale(d.count) : 0})
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))


    // ENTER (FOR FIRST TIME)
    node.enter().append('circle')
        .attr('r', function(d){return d.count>0 ? circleScale(d.count) : 0})
        .style('stroke', '#EEE')
        .style('fill', '#EEE')
        .on("mouseenter", function(d) {
            d3.select(".tooltip")
            .transition()
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text("Topic: " + d.topic + "\nCount: " + d.count)
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
        .merge(node)




    // SAME FOR TEXT

    var nodeText = textg
        .selectAll('text')
        .data(graph.nodes)

    //EXIT
    nodeText.exit().remove()

    // UPDATE

    nodeText
        .style('font-size', function(d){return d.count>0 ? circleScale(d.count):0})

    // ENTER
    nodeText
        .enter().append('text')
        .text(function(d){ return d.word})
        .style('font-size', function(d){return d.count>0 ? circleScale(d.count):0})
        .style("fill", function(d) { return color(d.topic); })
        .style('fill-opacity', 1)
        .merge(nodeText)



    // SAME FOR LINKS

    var link = linkg
        .selectAll('line')
        .data(graph.links)

    // EXIT

    link.exit().remove()

    // UPDATE
    //nada...

    //ENTER
    link
        .enter().append('line')
        .attr('stroke','white')
        .attr('stroke-width','0px')
        .merge(link)


    // START SIMULATION
    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-100)) // internodal strength
        .force("link", d3.forceLink().id(function(d){return d['word'];}).distance(75).strength(0.88)) // creates a force connecting links. Id points to related id in nodes
        .force("center", d3.forceCenter(225, 175))
        .force("x", d3.forceX(w2/2)) // pull towards location on x axis
        .force("y", d3.forceY(h2/2)) // pull towards location on y axis     
        .on("tick", ticked);
   


    window.node = node

function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node // CX AND CY LIMIT NODES TO BOUNDING BOX
        .attr("cx", function(d) { return d.x = Math.max(circleScale(d.count), Math.min(w2-circleScale(d.count)*2, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(circleScale(d.count), Math.min(h2-circleScale(d.count)*2, d.y)); });
    nodeText
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    }


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

// SYNC NODES AND LINKS TO SIMULATION
simulation
    .nodes(graph.nodes);

simulation.force("link")
    .links(graph.links);


}//END OF WORDGRAPH FUNC
