define(
['jquery-1', 'timeline/models/GraphicalTimelineEvent', 'vendor/EventEmitter', 'vendor/cmptbl', 'vendor/drgbl'],

function (
$,
GraphicalTimelineEvent,
EventEmitter,
Compatible,
Draggable) {

  var GraphicalTimeline = function (timelineModel, templates) {
      EventEmitter.apply(this);

      this.moveable = false;
      this.templates = templates;
      this.graphicalEvents = [];
      this.timelineModel = timelineModel;
      this.draggable = true;
      this.dragInProgress = false;
      this.lockToViewport = true;
      this.showPanels = true;
      this.timelineAttachSelector = '.timeline';

      this.view = function () {
        return {
          name: this.timelineModel.name,
          range: this.timelineModel.range,
          length: this.timelineModel.events.length + " Events"
        };
      };
      this.animationProperties = function (distance) {
        return {
          left: distance
        };
      };
      this.animationOptions = function (callback) {
        var graphicalTimeline = this;
        return {
          duration: 500,
          easing: 'swing',
          complete: function () {
            if (callback && typeof (callback) === "function") {
              graphicalTimeline.emit('refocussed');
              callback();
            }
          }
        };
      };
      this.eventListenersForGraphicalEvents = {};
      this.focusEventHandler = function () {
        if (!this.t.dragInProgress) {
          this.t.centerEvent(this.e);
          this.t.focusEvent(this.e);
        }
      };
      this.updateVisibilityCallback = function(){

      };
    };

  GraphicalTimeline.prototype = EventEmitter.extend();

  GraphicalTimeline.prototype.init = function ($container) {
    this.$container = $container;
    this.$timeline = this.$container.find(this.timelineAttachSelector);

    this.addEvents();

    if (this.draggable) {
      this.makeDraggable();
    }

    return this.$container;
  };

  GraphicalTimeline.prototype.reset = function () {
    if (this.graphicalEvents && !this.moveable) {
      this.centerEvent(this.graphicalEvents[0]);
      this.focusEvent(this.graphicalEvents[0]);
    }
    this.emit('reset');
  };

  GraphicalTimeline.prototype.hasTimelineEvent = function (timelineEvent) {
    for (var i = 0; i < this.graphicalEvents.length; i++) {
      if (this.graphicalEvents[i].timelineEvent === timelineEvent) {
        return this.graphicalEvents[i];
      }
    }
  };

  GraphicalTimeline.prototype.hasTimelineEventDOMElement = function (DOMElement) {
    for (var i = 0; i < this.graphicalEvents.length; i++) {
      if (this.graphicalEvents[i].$event && this.graphicalEvents[i].$event.get(0) === DOMElement) {

        return this.graphicalEvents[i];
      }
    }
  };

  GraphicalTimeline.prototype.addEvents = function () {
    for (var i = 0; i < this.timelineModel.length(); i++) {
      this.addEvent(this.timelineModel.events[i]);
    }
  };

  GraphicalTimeline.prototype.addEvent = function (timelineEvent) {
    var graphicalEvent = new GraphicalTimelineEvent(timelineEvent);
    var graphicalTimeline = this;

    for (var eventName in this.eventListenersForGraphicalEvents) {
      var e = graphicalTimeline.eventListenersForGraphicalEvents[eventName];
      var scope = {
        e: graphicalEvent,
        t: graphicalTimeline
      };
      graphicalEvent.on(eventName, e, scope);
      graphicalEvent.on('click',this.focusEventHandler,scope);
    }

    this.graphicalEvents.push(graphicalEvent);
  };

  GraphicalTimeline.prototype.length = function () {
    return this.graphicalEvents.length;
  };

  GraphicalTimeline.prototype.makeDraggable = function () {
    var self = this;

    var opts = {
      axis: 'x',
      bound: function(){
        var $lastElement = self.$timeline.find('li').last();
        var bottomBound = -($lastElement.position().left + $lastElement.width()  - self.viewportWidth()) ;
        var topBound = 0

        var currentPosition = $(this.element).position().left;

        if( currentPosition >= bottomBound &&
            currentPosition <= topBound){
            return true;
        }
      },
      callback: {
        dragging: function () {
          self.dragInProgress = true;
        },
        dragend: function () {
          if (self.dragInProgress) {
            self.dragInProgress = false;
            var centralEvent = self.centralEvent();
            self.centerEvent(centralEvent);
            self.focusEvent(centralEvent);
            self.emit('dragend');
          }
        }
      }
    };

    return new Draggable(this.$timeline.get(0), opts);
  };

  GraphicalTimeline.prototype.visibleEvents = function () {
    var visibleEvents = [];
    
    if (this.$container) {
      var timelineWidth = this.$container.width();
      var offSet = this.$timeline.position().left;

      var length = this.length();
      

      for (var i = 0; i < length; i++) {
        var eventWidth = this.graphicalEvents[i].$event.width();
        var eventLeftPos = offSet + this.graphicalEvents[i].$event.position().left;
        var eventRightPos = eventLeftPos + eventWidth;

        if (eventRightPos > 0 && eventLeftPos < timelineWidth) {
          visibleEvents.push(this.graphicalEvents[i]);
        }
      }
    }
    
    return visibleEvents;
  };

  GraphicalTimeline.prototype.focusOffset = function (graphicalEvent) {
    var focusIndex;
    var currentIndex;

    for (var i = 0; i < this.graphicalEvents.length; i++) {
      if (this.graphicalEvents[i].focus){
        focusIndex = i;
      }
      if (this.graphicalEvents[i] === graphicalEvent){
        currentIndex = i;
      }
    }

    if (focusIndex !== undefined && currentIndex !== undefined) {
      return Math.abs(focusIndex - currentIndex);
    }
  };

  GraphicalTimeline.prototype.centralEvent = function () {
    if (this.$container) {
      var timelineWidth = this.$container.width();
      var offSet = this.$timeline.position().left;
      var timelineCentre = this.$container.width() / 2;
      var visibleEvents = this.visibleEvents();
      var centralEvent = {
        distance: undefined,
        graphicalEvent: undefined
      };

      for (var i = 0; i < visibleEvents.length; i++) {
        var eventWidth = visibleEvents[i].$event.width();
        var eventLeftPos = offSet + visibleEvents[i].$event.position().left;
        var eventRightPos = eventLeftPos + eventWidth;

        var eventCenter = eventLeftPos + (eventWidth / 2);
        var centreOffset = Math.abs(timelineCentre - eventCenter);

        if (centralEvent.distance === undefined || centreOffset < centralEvent.distance) {
          centralEvent.distance = centreOffset;
          centralEvent.graphicalEvent = visibleEvents[i];
        }
      }

      return centralEvent.graphicalEvent;
    }
  };

  GraphicalTimeline.prototype.focussedEvent = function () {
    for (var i = 0; i < this.graphicalEvents.length; i++) {
      if (this.graphicalEvents[i].focus) {
        return this.graphicalEvents[i];
      }
    }
  };

  GraphicalTimeline.prototype.centerEvent = function (graphicalEvent) {
    if (graphicalEvent && graphicalEvent.$event && this.$timeline) {
      var moveDistance = ((graphicalEvent.$event.position().left) - (this.viewportWidth() / 2)) + ((graphicalEvent.$event.outerWidth()) / 2);
      var moveTo = -(moveDistance);

      this.moveTimeline(moveTo, this.updateVisibilityCallback);
    }
  };

  GraphicalTimeline.prototype.focusEvent = function (graphicalEvent) {
		for (var i = 0; i < this.graphicalEvents.length; i++) {
			this.graphicalEvents[i].emit('reset');
      this.graphicalEvents[i].setFocussed(false);
		}

    var tense = 'past';
    if (graphicalEvent && graphicalEvent.$event && this.$timeline) {
      for (var i = 0; i < this.graphicalEvents.length; i++) {
        if (this.graphicalEvents[i] === graphicalEvent) {
          tense = 'future';

					if(this.graphicalEvents[i-1]){
						this.graphicalEvents[i-1].emit('previous');
					}
					if(this.graphicalEvents[i+1]){
					  this.graphicalEvents[i+1].emit('next');
					}

        } else {
          this.graphicalEvents[i].emit(tense);
        }
      }
		}
    
    graphicalEvent.setFocussed(true);

    return false;
  };

  GraphicalTimeline.prototype.width = function () {
    if (this.$timeline) {
      var $lastElement = this.graphicalEvents[this.graphicalEvents.length - 1].$event;
      return $lastElement.position().left + $lastElement.outerWidth();
    } else {
      return undefined;
    }
  };

  GraphicalTimeline.prototype.viewportWidth = function () {
    if (this.$container) {
      return this.$container.outerWidth();
    } else {
      return undefined;
    }
  };

  GraphicalTimeline.prototype.moveTimeline = function (distance, callback) {
    if (this.moveable) { return; }

		var $lastTimelineItem = this.$timeline.find('li').last();
		var fullWidth = $lastTimelineItem.position().left + $lastTimelineItem.outerWidth();

    if (this.lockToViewport) {
      if (((-distance) + this.viewportWidth()) > fullWidth) {
        distance = -(fullWidth - this.viewportWidth());
      }
      if (distance > 0) {
        distance = 0;
      }
    }

    this.$timeline.clearQueue();
    this.$timeline.delay(200).animate(
    this.animationProperties(distance),
    this.animationOptions(callback));
  };

  return GraphicalTimeline;
}

);
