describe('TimelineEvent model', function () {

  it('should have an event name, date, summary, image URL, and resource URL', function () {
    TimelineEvent = js_require_modules['TimelineEvent'];

    var eventName = "New event";
    var date = "5th December 2012" 
    var summary = "Lorem ipsum dolorum set amet."
    var imageURL = "http://www.example.com/kittens.gif";
    var resourceURL = "http://www.example.com";

    var timelineEvent = new TimelineEvent(eventName,date,summary,imageURL,resourceURL);

    expect(timelineEvent.name).toEqual(eventName);
    expect(timelineEvent.date).toEqual(date);
    expect(timelineEvent.summary).toEqual(summary);
    expect(timelineEvent.imageURL).toEqual(imageURL);
    expect(timelineEvent.resourceURL).toEqual(resourceURL);

  });

});
