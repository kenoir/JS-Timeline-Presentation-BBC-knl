describe('Parser model', function () {

  var selectors =  {
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
    };

  beforeEach(function () {
    loadFixtures('timeline.html');
    Parser = js_require_modules['Parser'];
  });

  it('should take an object when constructed which is then set on the property selectors', function () {
    var parser = new Parser(selectors);
    expect(parser.selectors).toEqual(selectors);
  });

  describe('getDOMTimelineElement',function(){
    it('should get all the elements from the DOM that match the selector passed',function(){
      var parser = new Parser(selectors);
      parser.$timeline = $(selectors.timeline.selector);

      var expectedCount = $(selectors.event.selector).length;
      var actualCount = parser.getDOMTimelineElements(selectors.event.selector).length;

      expect(expectedCount).toEqual(actualCount);
    });
  });

  describe('parse',function(){
    it('should call getDOMTimeline && getDOMTimelineElements with selectors.timeline.event.selector',function(){
      var parser = new Parser(selectors);
      
      spyOn(parser,'getDOMTimeline');
      spyOn(parser,'getDOMTimelineElements');

      parser.parse(document);

      expect(parser.getDOMTimeline).toHaveBeenCalled();
      expect(parser.getDOMTimelineElements).toHaveBeenCalledWith(selectors.event.selector);
    });

    it('should set the $timeline and $events properties',function(){
      var parser = new Parser(selectors);

      var actualTimeline = $(selectors.timeline.selector);
      var actualEvents = $(selectors.event.selector);

      parser.parse(document);

      expect(actualTimeline.html()).toEqual(parser.$timeline.html());
      expect(actualEvents.html()).toEqual(parser.$events.html());
    });
  });

  describe('getDOMTimeline',function(){
    it('should get timeline element from the DOM that match the selector in selectors.timeline.selector',function(){
      var parser = new Parser(selectors);

      var expected = $(selectors.timeline.selector);
      var actual = parser.getDOMTimeline(document);

      expect(expected.get(0)).toEqual(actual.get(0));
    });
  });

  describe('getTimeline',function(){
    
    it('should return a timeline object',function(){
      var parser = new Parser(selectors);
      parser.parse(document);

      var timeline = parser.getTimeline();

      expect(timeline).toBeAnInstanceOf(Timeline);
    });

    it('should return a timeline with the correct name, summary, start date, end date, and length', function(){
      var parser = new Parser(selectors);
      parser.parse(document);

      var timeline = parser.getTimeline();

      expect(timeline.name).toEqual('Timeline Header');
      expect(timeline.summary).toEqual('Timeline Summary');
      expect(timeline.start).toEqual('1900');
      expect(timeline.end).toEqual('2000');
      expect(timeline.length()).toEqual(5);
    });

  });

  describe('getEvent',function(){

    it('should return an event object',function(){
      var parser = new Parser(selectors);
      parser.parse(document);

      var DOMTimelineEvent = $(selectors.event.selector)[0];
      var event = parser.getEvent(DOMTimelineEvent);

      expect(event).toBeAnInstanceOf(TimelineEvent);
    });

    it('should return an event with the correct image, url, name, date and summary',function(){
      var parser = new Parser(selectors);
      parser.parse(document);

      var expectedSummaryText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

      var $event = $(selectors.event.selector)[0];
      var event = parser.getEvent($event);

      expect(event.name).toEqual('Placeholder title');
      expect(event.summary).toEqual(expectedSummaryText);
      expect(event.date).toEqual("January 12th, 2012");
      expect(event.imageURL).toEqual('img/timeline-placeholder.png');
      expect(event.resourceURL).toEqual('http://www.example.com');
    });

  });

});
