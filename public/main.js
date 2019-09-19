let socket = io()

let glob = {}
let colorQueue = []

let transitionGoing = false

$(document).ready(() => {
	// transitions background colors
	glob.processColorTransition = color => {
		if (document.body.style.backgroundColor == color) {
			return
		}
		transitionGoing = true
		document.body.style.backgroundColor = color
	}

	// adds color to color queue
	glob.addToQueue = color => {
		colors = [
			'aliceblue',
			'antiquewhite',
			'aqua',
			'aquamarine',
			'azure',
			'beige',
			'bisque',
			'black',
			'blanchedalmond',
			'blue',
			'blueviolet',
			'brown',
			'burlywood',
			'cadetblue',
			'chartreuse',
			'chocolate',
			'coral',
			'cornflowerblue',
			'cornsilk',
			'crimson',
			'cyan',
			'darkblue',
			'darkcyan',
			'darkgoldenrod',
			'darkgray',
			'darkgreen',
			'darkgrey',
			'darkkhaki',
			'darkmagenta',
			'darkolivegreen',
			'darkorange',
			'darkorchid',
			'darkred',
			'darksalmon',
			'darkseagreen',
			'darkslateblue',
			'darkslategray',
			'darkslategrey',
			'darkturquoise',
			'darkviolet',
			'deeppink',
			'deepskyblue',
			'dimgray',
			'dimgrey',
			'dodgerblue',
			'firebrick',
			'floralwhite',
			'forestgreen',
			'fuchsia',
			'gainsboro',
			'ghostwhite',
			'goldenrod',
			'gold',
			'gray',
			'green',
			'greenyellow',
			'grey',
			'honeydew',
			'hotpink',
			'indianred',
			'indigo',
			'ivory',
			'khaki',
			'lavenderblush',
			'lavender',
			'lawngreen',
			'lemonchiffon',
			'lightblue',
			'lightcoral',
			'lightcyan',
			'lightgoldenrodyellow',
			'lightgray',
			'lightgreen',
			'lightgrey',
			'lightpink',
			'lightsalmon',
			'lightseagreen',
			'lightskyblue',
			'lightslategray',
			'lightslategrey',
			'lightsteelblue',
			'lightyellow',
			'lime',
			'limegreen',
			'linen',
			'magenta',
			'maroon',
			'mediumaquamarine',
			'mediumblue',
			'mediumorchid',
			'mediumpurple',
			'mediumseagreen',
			'mediumslateblue',
			'mediumspringgreen',
			'mediumturquoise',
			'mediumvioletred',
			'midnightblue',
			'mintcream',
			'mistyrose',
			'moccasin',
			'navajowhite',
			'navy',
			'oldlace',
			'olive',
			'olivedrab',
			'orange',
			'orangered',
			'orchid',
			'palegoldenrod',
			'palegreen',
			'paleturquoise',
			'palevioletred',
			'papayawhip',
			'peachpuff',
			'peru',
			'pink',
			'plum',
			'powderblue',
			'purple',
			'rebeccapurple',
			'red',
			'rosybrown',
			'royalblue',
			'saddlebrown',
			'salmon',
			'sandybrown',
			'seagreen',
			'seashell',
			'sienna',
			'silver',
			'skyblue',
			'slateblue',
			'slategray',
			'slategrey',
			'snow',
			'springgreen',
			'steelblue',
			'tan',
			'teal',
			'thistle',
			'tomato',
			'turquoise',
			'violet',
			'wheat',
			'whitesmoke',
			'yellow',
			'yellowgreen'
		]
		fixedColor = color
			.toLowerCase()
			.split(' ')
			.join('')

		match = colors.includes(fixedColor)

		if (match) {
			colorQueue.push(fixedColor)
			return fixedColor
		}
		return null
	}

	// adds message
	glob.addMessage = (color, from) => {
		var cleanNumber = from.substring(-1, 10).replace('+1', '') + 'xx'
		var finished = `${cleanNumber.substring(0, 3)}-${cleanNumber.substring(
			3,
			6
		)}-${cleanNumber.substring(6, 10)}`

		$('.messages').append(
			'<p class="message">- "' + color + '" from ' + finished
		)
	}

	// set transition flag to false when a transition stops
	$('body').on('transitionend', function(e) {
		transitionGoing = false
	})

	// every 50 milliseconds, if the transition is done, process the color queue
	setInterval(() => {
		if (!transitionGoing && colorQueue[0] != null) {
			let latestColor = colorQueue[0]
			colorQueue.shift()

			glob.processColorTransition(latestColor)
		}
	}, 50)

	// every 100 milliseconds, clear the messages
	setInterval(() => {
		let children = $('.messages')
			.children()
			.toArray()
		let numberOfChildren = children.length

		// if there are messages
		if (numberOfChildren > 0) {
			children.forEach(child => {
				let jqChild = $(child)
				// do nothing if it has been processed
				if (
					!jqChild
						.attr('class')
						.split(/\s+/)
						.includes('processed')
				) {
					// make it go away
					setTimeout(function() {
						jqChild.addClass('animated fadeOutLeft processed')
					}, 1500)

					// make it go away permanently
					setTimeout(function() {
						jqChild.remove()
					}, 2000)
				}
			})
		}
	}, 100)

	glob.processText = message => {
		let processedColor = glob.addToQueue(message.body)
		if (processedColor) {
			glob.addMessage(processedColor, message.from)
		}
	}

	socket.on('message', message => {
		glob.processText(message)
	})
})
