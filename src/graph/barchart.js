
var d3 = require('d3');
var mergeDeep = require('../util/mergeDeep.js').mergeDeep

const defaultConfig = {
  target: '#chart',
  width: 960,
  height: 600,
  margin: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  data: null,
  label: '未命名',
  axisX: {
    key: '',
    show: true
  },
  axisY: {
    show: true
  },
  type: 'Normal'
}
class BarChart {
  constructor(config) {
    this.set(config)
    this.init()
  }
  dimesions() {
    const { width, height, margin } = this
    return [width - margin.left - margin.right, height - margin.top - margin.bottom]
  }
  /**
   * set configuration
   * 
   * @param {any} config 
   * @memberof BarChart
   */
  set(config) {

    mergeDeep(this, defaultConfig, config)
    console.log(this)
  }
  init() {
    const { target, width, height, margin } = this
    const [w, h] = this.dimesions()
    var svg = d3.select(target)
      .attr('width', width)
      .attr('height', height)
    if (svg.empty()) {
      console.log(`no element with selector ${target}`);
      return
    }

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.right})`)

    this.chart = g
  }
  render(data) {
    if (!Array.isArray(data)) {
      console.log(`${data} must be an array`)
      return
    }
    this.prepareData(data)
    this.renderAxis(data)
    this.renderBar(data)
    this.renderLabel(this.label)
  }
  prepareData(data) {
    const { chart, axisX } = this
    const [w, h] = this.dimesions()
    var keys = Object.keys(data[0])

    keys.splice(keys.indexOf(axisX.key), 1)
    console.log(keys)
    this.keys = keys
    if (keys.length > 1) {
      this.isGroup = true;// 分组类型图表
      this.x = []
      const x0 = this.x[0] = d3.scaleBand()
        .rangeRound([0, w])
        .paddingInner(0.1)
      const x1 = this.x[1] = d3.scaleBand()
        .padding(0.05)
      const y = this.y = d3.scaleLinear().rangeRound([h, 0])
      this.z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      x0.domain(data.map(d => d[axisX.key]))
      x1.domain(keys).rangeRound([0, x0.bandwidth()])

      y.domain([0, d3.max(data, function (d) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();

    } else {
      const x = this.x = d3.scaleBand().rangeRound([0, w]).padding(0.1)
      const y = this.y = d3.scaleLinear().rangeRound([h, 0])

      x.domain(data.map(d => d.letter))// 适配
      y.domain([0, d3.max(data, function (d) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();
    }
  }
  renderAxis(data) {

    const { chart, axisX, x, y } = this
    const [w, h] = this.dimesions()
    const key = axisX.key
    var x0, x1
    if (Array.isArray(x)) {
      x0 = x[0]
      x1 = x[1]
    }
    chart.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x0))

    chart.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y))
  }
  renderBar(data) {
    const { chart, x, y, z, keys } = this
    const [w, h] = this.dimesions()
    var x0, x1
    if (this.isGroup) {
      x0 = x[0]
      x1 = x[1]
      chart.append('g')
        .selectAll('g')
        .data(data)
        .enter().append('g')
        .attr("transform", function (d) { return "translate(" + x0(d.State) + ",0)"; })
        .selectAll("rect")
        .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); })
        .enter().append("rect")
        .attr("x", function (d) { return x1(d.key); })
        .attr("y", function (d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function (d) { return h - y(d.value); })
        .attr("fill", function (d) { return z(d.key); });

    } else {
      chart.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.letter))
        .attr('y', d => y(d.frequency))
        .attr('width', x.bandwidth())
        .attr('height', d => h - y(d.frequency))
    }
  }
  renderLabel(label) {
    const { chart } = this
    chart.append('g')
      .attr('class', 'label')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('dy', '1em')
      .attr('text-anchor', 'end')
      .text(label)
  }
}
module.exports = BarChart;