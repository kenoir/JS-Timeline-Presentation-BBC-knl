describe('Timeline model', function () {
  beforeEach(function () {
    Timeline = js_require_modules['Timeline'];
    TimelineEvent = js_require_modules['TimelineEvent'];
  });

    function dummyEvent(){
      var eventName = "New event";
      var startDate = Date("October 13, 1975 11:13:00");
      var endDate = Date("October 13, 1982 11:13:00");
      var url = "http://www.example.com";

      return new TimelineEvent(eventName,startDate,endDate,url); 
    }


  it('should have an timeline name, summary, start, end and event list', function () {
    var name = "Timeline";
    var summary = "Summary";
    var start = "1990";
    var end = "2000";
    var events = [];

    var timeline = new Timeline(name,summary,start,end,events);

    expect(timeline.name).toEqual(name);
    expect(timeline.summary).toEqual(summary);
    expect(timeline.start).toEqual(start);
    expect(timeline.end).toEqual(end);
    expect(timeline.events).toEqual(events);

  });

  describe('addEvent',function(){
    it('should allow us to add an event', function (){
      var timelineEvent = new TimelineEvent;
      var timeline = new Timeline();

      timeline.addEvent(dummyEvent());

      expect(timeline.events).toHaveCount(1);
    });
  });

  describe('length',function(){
    it('should return the count of contained events',function(){
      var timelineEvent = new TimelineEvent;
      var timeline = new Timeline();

      timeline.addEvent(dummyEvent());

      expect(timeline.length()).toEqual(1);
    });
  });

});
