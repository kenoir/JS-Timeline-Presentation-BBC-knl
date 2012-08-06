define([], function () {

  TimelineEvent = function (name, date, summary, imageURL, resourceURL) {
    this.name = name;
    this.date = date;
    this.summary = summary;
    this.imageURL = imageURL;
    this.resourceURL = resourceURL;
  };

  return TimelineEvent;

});