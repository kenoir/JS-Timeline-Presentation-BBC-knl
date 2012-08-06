$(document).ready(function() {
  beforeEach(function () {

    this.addMatchers({
      toHaveEventListeners: function (expected) {

        var checkEventListener = function (actual,expected,eventName) {
          var actualEvents = actual._events[eventName];
          var foundEventListener = false;

	  for(var i = 0;i < actualEvents.length;i++){
	    if(actualEvents[i].listener == expected[eventName]){
	      foundEventListener = true;
            }
          }   
          return foundEventListener == true;
        }

	var missingEventListener = false;
	for(var eventName in expected){
          if(!checkEventListener(this.actual,expected,eventName)){
	    missingEventListener = true;
            break;
	  }
 	}
        return missingEventListener == false;
      }
    });

    this.addMatchers({
      toHaveCount: function (expected) {
        this.actual = this.actual.length;      
        return this.actual == expected;
      }
    });

    this.addMatchers({
      toBeAnInstanceOf: function (expected) {
        return this.actual instanceof expected;
      }
    });

    this.addMatchers({
      toBeJqueryObject: function (expected) {
        return this.actual.jquery != undefined
      }
    });

  });
});

function dummyTimeline(){
    var TimelineView = window.js_require_modules['TimelineView'];
    var EventView = window.js_require_modules['EventView'];
    var Parser = window.js_require_modules['Parser'];

    loadFixtures('templates.html','timeline.html');

    // Make sure icanhaz templates
    ich.grabTemplates();
    ich.setLogging(false);

      var dummyConfig = {
        selectors: {
          timeline: {
            name: { selector: '.tl-header-title' },
            summary: { selector: '.tl-header-summary' },
            start: {selector: '.tl-header-start-date' },
            end: {selector: '.tl-header-end-date' },
            selector: '.kl-timeline',
          },
          event: {
            name: { selector: '.tl-event-title' },
            date: { selector: '.tl-event-date' },
            imageURL: { selector: 'img' },
            resourceURL: { selector: 'a' },
            summary: { selector: '.tl-event-summary' },
            selector: '.tl-event'
          }
       },
        targetSelector: ".kl-timeline",
        logWriter: function(){}
      };

    var p = new Parser(dummyConfig.selectors);
    p.parse(document);

    var timelineData = p.getTimeline(); 

    var setDummyEventsWidthAndOffset = function($events,width){
	    $events.each(function(index,value) {
		    $(this).width(width);
		    $(this).height(100);
		    $(this).offset({left:index*width});
		  });
	  } 

    var graphicalTimeline = new GraphicalTimeline(timelineData);

    var timelineView = new TimelineView(graphicalTimeline);
    var $timeline = timelineView.render();

    graphicalTimeline.init($timeline);
    timelineView.append(dummyConfig.targetSelector);

    for(var i = 0; i < graphicalTimeline.graphicalEvents.length; i++){
      var timelineEventView = new EventView(graphicalTimeline.graphicalEvents[i]);
      var $event = timelineEventView.render();

    graphicalTimeline.graphicalEvents[i].init($event);
      timelineEventView.append($timeline);
    }

    var $container = graphicalTimeline.$container;

    $container.width(620);
    setDummyEventsWidthAndOffset($container.find('li'),220);

    window.clock.tick(510);

    return graphicalTimeline;
  } 


function dummyTimelineEvent(){

  var eventName = "New event";
  var date = "5th December 2012" 
  var summary = "Lorem ipsum dolorum set amet."
  var imageURL = "http://www.example.com/kittens.gif";
  var resourceURL = "http://www.example.com";

  var dummyTimelineEvent = new TimelineEvent(eventName,date,summary,imageURL,resourceURL);
	var $dummyJqueryElement = $('<li><div class="tl_title"><a href="/event">Event Title</a></div></li>');

	$dummyJqueryElement.width(100);

	var graphicalTimelineEvent = new GraphicalTimelineEvent(dummyTimelineEvent);
	graphicalTimelineEvent.init($dummyJqueryElement); 

	return graphicalTimelineEvent; 
}


