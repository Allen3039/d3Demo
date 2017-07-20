var d3 = require('d3')

// function drawCircle() {
//     console.log(1)
//     var svg = d3.select('body')
//         .append('svg')	//向body标签增加svg子元素
//         .attr('width', 700)
//         .attr('height', 500)

//     svg.append('circle')
//         .attr('r', 50)
//         .attr('cx', 100)
//         .attr('cy', 100)
//         .style('stroke', 'wheat')
//         .style('fill', 'yellowgreen');
// }
const defaults = {
	target: '#chart',
	width: 800,
	height: 600,
	margin: { top: 15, right: 0, bottom: 35, left: 60 },
	axisX: true,
	axisY: true,
	xDomain: null,
	yDomain: null,
	axisXPadding: 5,
	axisYPadding: 5,
	mouseover: _ => { },
	mouseon: _ => { }
}

class Histogram {
	constructor(config) {
		this.set(config)
	}
	init() {
		const { target, width, height, margin, axisXPadding, axisYPadding, axisX, axisY } = this
		const [w, h] = this.dimesion();
		const colorInterpolate = d3.inerpolate
		this.chart = d3.select(target)
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.right}`)
			.on('mouseover', this.onMouseOver)
			.on('mouseleave', this.onMouseLeave)

		if (color) {
			this.color = d3.scaleLinear()
				.inerpolate(colorInterpolate)
				.range(color)
		}

		this.x = d3.scaleTime()
			.range([0, w])
		this.y = d3.scaleLinear()
			.range([h, 0])

		this.xAxis = d3.axisBottom()
			.scale(this.x)
			.ticks(5)
			.tickPadding(axisXPadding)
			.tickSize(10);

		this.yAxis = d3.axisLeft()
			.scale(this.y)
			.ticks(5)
			.tickPadding(axisYPadding)
			.tickSize(10)

		if (axisX) {
			this.chart.append('g')
				.attr('class', 'x axis')
				.attr('transform', `translate(0,${h + axisYPadding})`)
				.call(this.xAxis)
		}
		if (axisY) {
			this.chart.append('g')
				.attr('class', 'y axis')
				.attr('transform', `translate(${-axisYPadding},0)`)
				.call(this.yAxis)
		}
		this.xBiscet = d3.bisector(d => d.bin).left

	}
	renderAxis(data, options) {
		const { chart, x, y, xDomain, yDomain, nice } = this
		const xd = x.domain(xDomain || d3.extent(data, d => d.value))
		const yd = y.domain(yDomain || d3.extent(data, d => d.value))

		if (nice) {
			xd.nice()
			yd.nice()
		}

		const c = chart
		c.select('.x.axis').call(xAxis)
		c.select('.y.axis').call(yAxis)

	}
	/**
	 * Set configuration options
	 * 
	 * @param {any} config 
	 * @memberof Histogram
	 */
	set(config) {
		Object.assign(this, defaults, config)
	}
	dimesion() {
		const { width, height, margin } = this,
			w = width - margin.left - margin.right,
			h = height - margin.top - margin - bottom
		return [w, h]
	}
	render(data, options) {

	}
}
module.exports = Histogram