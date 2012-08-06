define(['timeline/models/TimelineEvent'], function (TimelineEvent) {

  Timeline = function (name, summary, start, end, events) {
    this.name = name;
    this.summary = summary;
    this.start = start;
    this.end = end;
    this.events = [];
  };

  Timeline.prototype.length = function () {
    return this.events.length;
  };

  Timeline.prototype.addEvent = function (timelineEvent) {
    this.events.push(timelineEvent);
  };

  return Timeline;

});
