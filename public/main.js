let socket = io();

let glob = {};
let colorQueue = [];
let musicQueue = [];
var song_in;

let transitionGoing = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const changeSource = url => {
  const video = document.getElementById('video');
  video.src = url;
};

async function newMusic(query) {
  const mySecret = process.env['KEY']
  const url = `https://www.googleapis.com/youtube/v3/search?key=${mySecret}&type=video&part=snippet&q=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  //console.log(data.items[0].id.videoId);
  //console.log(data.items[0].snippet.title);
  changeSource(
    `https://www.youtube.com/embed/${data.items[0].id.videoId}?autoplay=1`
  );
  console.log(
    `https://www.youtube.com/embed/${data.items[0].id.videoId}?autoplay=1`
  );
  const songNote = document.getElementById('song-note');
  songNote.textContent = `Currently Playing: ${data.items[0].snippet.title}`;
}

$(document).ready(() => {
  // transitions background colors
  glob.processColorTransition = color => {
    if (document.body.style.backgroundColor == color) {
      return;
    }
    transitionGoing = true;
    document.body.style.backgroundColor = color;
  };
  glob.processMusicTransition = music => {
    //newMusic('hotel california');
    console.log(song_in);
    newMusic(song_in);
  };

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
    ];

    const inputText = color.split(',');
    let color_in = inputText[0];
    song_in = inputText[1];
    //console.log(color_in, song_in);

    fixedColor = color_in
      .toLowerCase()
      .split(' ')
      .join('');

    match = colors.includes(fixedColor);

    if (match) {
      colorQueue.push(fixedColor);
      musicQueue.push(song_in);
      return fixedColor;
    }
    return null;
  };

  // adds message
	/*
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
  */

  // set transition flag to false when a transition stops
  $('body').on('transitionend', function(e) {
    transitionGoing = false;
  });

  // every 50 milliseconds, if the transition is done, process the color queue
  setInterval(() => {
    const sleep2 = ms => new Promise(r => setTimeout(r, 10000));
    if (!transitionGoing && colorQueue[0] != null) {
      let latestColor = colorQueue[0];
      let latestMusic = musicQueue[0];
      colorQueue.shift();
      musicQueue.shift();

      glob.processColorTransition(latestColor);
      glob.processMusicTransition(latestMusic);
    }
    //}, 50);
    const sleep = ms => new Promise(r => setTimeout(r, 10000));
  }, 10000);

  // every 100 milliseconds, clear the messages
  setInterval(() => {
    let children = $('.messages')
      .children()
      .toArray();
    let numberOfChildren = children.length;

    // if there are messages
    if (numberOfChildren > 0) {
      children.forEach(child => {
        let jqChild = $(child);
        // do nothing if it has been processed
        if (
          !jqChild
            .attr('class')
            .split(/\s+/)
            .includes('processed')
        ) {
          // make it go away
          setTimeout(function() {
            jqChild.addClass('animated fadeOutLeft processed');
          }, 1500);

          // make it go away permanently
          setTimeout(function() {
            jqChild.remove();
          }, 2000);
        }
      });
    }
  }, 100);

  glob.processText = message => {
    let processedColor = glob.addToQueue(message.body);
    if (processedColor) {
      console.log(processedColor);
      glob.addMessage(processedColor, message.from);
    }
  };

  socket.on('message', message => {
    glob.processText(message);
  });
});
