define(
['jquery-1', 'vendor/EventEmitter'],

function (
$,
EventEmitter) {

  var GraphicalTimelineEvent = function (timelineEvent) {
      EventEmitter.apply(this);

      this.proxyEvents = ['click', 'mouseenter', 'mouseleave'];
      this.timelineEvent = timelineEvent;
      this.visible = false;
      this.focus = false;
      this.past = false;
      this.future = false;
      this.clickAction = function(){
        window.location.href = this.timelineEvent.resourceURL;
      }

      this.eventListeners = {
				'reset': function(){
          this.$event.removeClass('timeline-item-next');
          this.$event.removeClass('timeline-item-previous');
          this.$event.removeClass('timeline-item-focussed');
          this.$event.removeClass('timeline-item-future');
          this.$event.removeClass('timeline-item-past');
				},
				'next': function () {
         this.$event.addClass('timeline-item-next');
        },
        'previous': function () {
          this.$event.addClass('timeline-item-previous');
        },
				'focus': function () {
          this.$event.addClass('timeline-item-focussed');
          this.$event.removeAttr('tabindex');
        },
        'blur': function () {

        },
        'past': function () {
          this.$event.addClass('timeline-item-past');
        },
        'future': function () {
          this.$event.addClass('timeline-item-future');
        }
      };
    };

  GraphicalTimelineEvent.prototype = EventEmitter.extend();

  GraphicalTimelineEvent.prototype.init = function ($event) {
    this.$event = $event;

    var graphicalTimelineEvent = this;

    for (var event in this.eventListeners) {
      graphicalTimelineEvent.on(event, this.eventListeners[event]);
    }

    // Proxy events from jquery to EventEmitter
    for (var i = 0; i < this.proxyEvents.length; i++) {
      var proxiedEvent = graphicalTimelineEvent.proxyEvents[i];

      this.$event.bind(proxiedEvent, function (e) {
        e.preventDefault();
        e.stopPropagation();  

        graphicalTimelineEvent.emit(e.type);
      });
    }

    // Pass focus event as click
    this.$event.find('a').focus({
      event: this
    }, function (e) {
      e.data.event.emit('click');
      e.preventDefault();
    });

    return this.$event;
  };

  GraphicalTimelineEvent.prototype.setFocussed = function (focus) {
		var previousFocus = this.focus;
    this.focus = focus;

		if(!previousFocus && focus) this.emit('focus'); 
		if(previousFocus && !focus) this.emit('blur');
  };

  GraphicalTimelineEvent.prototype.width = function () {
    return this.$event.width();
  };

  return GraphicalTimelineEvent;
});
