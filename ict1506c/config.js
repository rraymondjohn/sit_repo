/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirrorÂ² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "SG Holidays",
			position: "top_left",
			config: {
				coloredText: true,
				coloredBorder: false,
				coloredSymbol: true,
				coloredBackground: false,
				calendars: [
					{
						fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
						url: "https://www.officeholidays.com/ics-all/singapore"
					}
				]
			}
		},
		{
			module: "compliments",
			position: "bottom_bar"
		},
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 1.29,
				lon: 103.86
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				weatherProvider: "openmeteo",
				type: "forecast",
				lat: 1.29,
				lon: 103.86
			}
		},
		{
			module: "newsfeed",
			position: "top_right",
			config: {
				feeds: [
					{
						title: "Global News",
						url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
				showDescription: true
			}
		},
		// Extra 3rd party modules for my own personalisation
		{
		    	module: 'MMM-Binance',
		    	position: "top_right",
		    	header: "Binance Cryptocurrencies",
		    	config: {
		        	currencies: ['btcusdt','ethusdt','xrpusdt','adausdt'],
		        	decimalPlaces: 4,        
		    	}
		},
		{
		      	module: "MMM-Carousel",
		      	position: "bottom_bar", // Required to draw in position
		      	config: {
				transitionInterval: 0,
				showPageIndicators: true,
				showPageControls: false,
				ignoreModules: ["clock", "alert", "calendar", "updatenotification", "MMM-GestureCam", "MMM-SystemStats"],
				mode: "slides",
				slides: {
				  main: ["compliments", "weather"],
				  "Slide 2": ["MMM-Binance", "MMM-AVStock"],
				  "Slide 3": ["newsfeed"]
				}
		      	}
		},
		{
		  	//disabled:true,
		  	module: "MMM-AVStock",
		  	position: "top_center",
		  	config: {
		    		symbols : ["PLTR", "NVDA", "AMD", "TSLA", "VOO"],
		    		alias: ["Palantir", "Nvidia", "AMD", "Tesla", "Vanguard S&P 500"],
				chartType: "candlestick",
				width: "800",
				direction: "column"
		  	}
		},
		{
		  module: "MMM-Remote-Control",
		  position: "upper_third", // Optional, can be any position
		  config: {
			apiKey: "12341234"
		  }
		},
		{
		  module: "MMM-GestureCam",
		  position: "bottom_right", // Adjust as needed
		  config: {
			width: 320,
			height: 240,
			streamUrl: "http://localhost:5000/video_feed"
		  }
		},
		{
			module: 'MMM-SystemStats',
			position: 'bottom_left', // This can be any of the regions.
			// classes: 'small dimmed', // Add your own styling. OPTIONAL.
			// header: 'System Stats', // Set the header text OPTIONAL
			config: {
				updateInterval: 10000, // every 10 seconds
				align: 'right', // align labels
				//header: 'System Stats', // This is optional
				units: 'metric', // default, metric, imperial
				view: 'textAndIcon',
			},
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
