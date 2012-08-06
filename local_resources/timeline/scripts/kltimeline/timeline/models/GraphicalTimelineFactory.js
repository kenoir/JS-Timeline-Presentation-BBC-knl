define(['timeline/models/GraphicalTimeline'], function (GraphicalTimeline) {

  var GraphicalTimelineFactory = function () {

    };

  GraphicalTimelineFactory.create = function (timeline, opts) {
    var graphicalTimeline = new GraphicalTimeline(timeline);

    for (var property in opts) {
      if (property !== 'eventListenersForGraphicalEvents') {
        graphicalTimeline[property] = opts[property];
      }
    }

    return graphicalTimeline;
  };

  GraphicalTimelineFactory.addTimelineListeners = function(graphicalTimeline, eventListeners) {
    for (var listener in eventListeners) {
      if(eventListeners[listener] instanceof Function){
        graphicalTimeline.on(listener,eventListeners[listener]);
      }
    }
  }

  GraphicalTimelineFactory.addEventListeners = function (graphicalTimeline, eventListeners) {
    var appendEventListener = function (listener, action) {
        graphicalTimeline.eventListenersForGraphicalEvents[listener] = action;
      };

    for (var listener in eventListeners) {
      appendEventListener(listener, eventListeners[listener]);
    }
  };

  return GraphicalTimelineFactory;

});
