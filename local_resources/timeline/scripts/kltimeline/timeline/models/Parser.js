define(
['jquery-1', 'timeline/models/TimelineEvent', 'timeline/models/Timeline'],

function ($, TimelineEvent, Timeline) {

  var Parser = function (selectors) {
    this.selectors = selectors;
    this.$timeline = undefined;
    this.$events = undefined;
  };

  Parser.prototype.parse = function (doc) {
    this.$timeline = this.getDOMTimeline(doc);
    this.$events = this.getDOMTimelineElements(this.selectors.event.selector);
  };

  Parser.prototype.getDOMTimeline = function (doc) {
    var $timeline;
    $timeline = $(doc).find(this.selectors.timeline.selector);
    return $timeline;
  };

  Parser.prototype.getDOMTimelineElements = function (selector) {
    var $elements;
    
    if (this.$timeline) {
      $elements = this.$timeline.find(selector);
    }
    return $elements;
  };

  Parser.prototype.getTimeline = function () {
    var timeline;

    if (this.$timeline) {
      var $timelineHeaderName = this.$timeline.find(this.selectors.timeline.name.selector);
      var $timelineHeaderSummary = this.$timeline.find(this.selectors.timeline.summary.selector);
      var $timelineHeaderStartDate = this.$timeline.find(this.selectors.timeline.start.selector);
      var $timelineHeaderEndDate = this.$timeline.find(this.selectors.timeline.end.selector);

      var name = $.trim($timelineHeaderName.text());
      var summary = $.trim($timelineHeaderSummary.text());
      var start = $.trim($timelineHeaderStartDate.text());
      var end = $.trim($timelineHeaderEndDate.text());

      timeline = new Timeline(name, summary, start, end);

      for (var n = 0; n < this.$events.length; n++) {
        var timelineEvent = this.getEvent(this.$events[n]);
        timeline.addEvent(timelineEvent);
      }

    }

    return timeline;
  };

  Parser.prototype.getEvent = function (DOMTimelineEvent) {
    var event;

    if (DOMTimelineEvent) {
      var $eventName = $(DOMTimelineEvent).find(this.selectors.event.name.selector);
      var $summary = $(DOMTimelineEvent).find(this.selectors.event.summary.selector);
      var $date = $(DOMTimelineEvent).find(this.selectors.event.date.selector);
      var $imageURL = $(DOMTimelineEvent).find(this.selectors.event.imageURL.selector);
      var $resourceURL = $(DOMTimelineEvent).find(this.selectors.event.resourceURL.selector);

      var name = $.trim($eventName.text());
      var summary = $.trim($summary.text());
      var date = $.trim($date.text());
      var imageURL = $imageURL.attr('src');
      var resourceURL = $resourceURL.attr('href');

      event = new TimelineEvent(name, date, summary, imageURL, resourceURL);
    }

    return event;
  };

  return Parser;
});
