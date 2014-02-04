d3.starPlot = function() {
  var width = 200,
      margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      labelMargin = 20,
      includeGuidelines = true,
      includeLabels = true,
      properties = [],
      scales = [],
      labels = [],
      title = nop,

      g,
      datum,
      radius = width / 2,
      origin = [radius, radius],
      radii = properties.length,
      radians = 2 * Math.PI / radii,
      scale = d3.scale.linear()
        .domain([0, 100])
        .range([0, radius])

  function chart(selection) {
    datum = selection.datum();
    g = selection
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    if (includeGuidelines) {
      drawGuidelines();
    }
    if (includeLabels) {
      drawLabels();
    }

    drawChart();
  }

  function drawGuidelines() {
    var r = 0;
    properties.forEach(function(d, i) {
      var l, x, y;

      l = radius;
      x = l * Math.cos(r);
      y = l * Math.sin(r);
      g.append('line')
        .attr('class', 'star-axis')
        .attr('x1', origin[0])
        .attr('y1', origin[1])
        .attr('x2', origin[0] + x)
        .attr('y2', origin[1] + y)

      r += radians;
    })
  }

  function drawLabels() {
    var r = 0;
    properties.forEach(function(d, i) {
      var l, x, y;

      l = radius;
      x = (l + labelMargin) * Math.cos(r);
      y = (l + labelMargin) * Math.sin(r);
      g.append('text')
        .attr('class', 'star-label')
        .attr('x', origin[0] + x)
        .attr('y', origin[1] + y)
        .text(labels[i])
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'central')

      r += radians;
    })
  }

  function drawChart() {
    g.append('circle')
      .attr('class', 'star-origin')
      .attr('cx', origin[0])
      .attr('cy', origin[1])
      .attr('r', 2)

    var path = d3.svg.line.radial()

    var pathData = [];
    var r = Math.PI / 2;
    properties.forEach(function(d, i) {
      var userScale = scales[i] || scales[0];
      pathData.push([
        scale(userScale(datum[d])),
        r
      ])
      r += radians;
    });

    g.append('path')
      .attr('class', 'star-path')
      .attr('transform', chart.transform())
      .attr('d', path(pathData) + 'Z');

    g.append('text')
      .attr('class', 'star-title')
      .attr('x', origin[0])
      .attr('y', -(margin.top / 2))
      .text(title(datum))
      .style('text-anchor', 'middle')
  }

  function drawInteraction() {
    var path = d3.svg.line.radial();

    // `*Interaction` variables are used to build the interaction layer.
    // `*Extent` variables are used to compute (and return) the x,y
    // positioning of the attribute extents. `*Value` variables are used
    // for the attribute values.
    var rInteraction = Math.PI / 2;
    var rExtent = 0;
    properties.forEach(function(d, i) {
      var lInteraction, xInteraction, yInteraction;
      var lExtent, xExtent, yExtent;

      lInteraction = radius;
      xInteraction = lInteraction * Math.cos(rInteraction);
      yInteraction = lInteraction * Math.sin(rInteraction);

      lExtent = radius + labelMargin;
      xExtent = lExtent * Math.cos(rExtent);
      yExtent = lExtent * Math.sin(rExtent);

      var userScale = scales[i] || scales[0];
      lValue = scale(userScale(datum[d]));
      x = lValue * Math.cos(rExtent);
      y = lValue * Math.sin(rExtent);

      var halfRadians = radians / 2;
      var pathData = [
        [0, rInteraction - halfRadians],
        [lInteraction, rInteraction - halfRadians],
        [lInteraction, rInteraction + halfRadians]
      ];

      // TODO Return the x,y from the corner of the svg so that users can
      // use div's or svg to handle interaction
      var datumToBind = {
        xExtent: xExtent,
        yExtent: yExtent,
        x: x,
        y: y,
        key: properties[i],
        value: datum[properties[i]]
      };

      g.append('path')
        .datum(datumToBind)
        .attr('class', 'star-interaction')
        .attr('transform', chart.transform())
        .attr('d', path(pathData) + 'Z');

      rInteraction += radians;
      rExtent += radians;
    })
  }

  function nop() {
    return;
  }

  chart.transform = function() {
    return 'translate(' + origin[0] + ',' + origin[1] + ')';
  };

  chart.interaction = function(selection) {
    datum = selection.datum();
    g = selection
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    drawInteraction();
  };

  chart.properties = function(_) {
    if (!arguments.length) return properties;
    properties = _;
    radii = properties.length;
    radians = 2 * Math.PI / radii;
    return chart;
  };

  chart.scales = function(_) {
    if (!arguments.length) return scales;
    if (Array.isArray(_)) {
      scales = _;
    } else {
      scales = [_];
    }
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    radius = width / 2;
    origin = [radius, radius];
    scale.range([0, radius])
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    origin = [radius, radius];
    return chart;
  };

  chart.labelMargin = function(_) {
    if (!arguments.length) return labelMargin;
    labelMargin = _;
    return chart;
  };

  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };

  chart.labels = function(_) {
    if (!arguments.length) return labels;
    labels = _;
    return chart;
  };

  chart.includeGuidelines = function(_) {
    if (!arguments.length) return includeGuidelines;
    includeGuidelines = _;
    return chart;
  };

  chart.includeLabels = function(_) {
    if (!arguments.length) return includeLabels;
    includeLabels = _;
    return chart;
  };

  return chart;
}

