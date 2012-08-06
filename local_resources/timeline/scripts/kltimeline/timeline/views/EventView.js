define(
['jquery-1',
'vendor/mustache',
'vendor/icanhaz'],

function (
$,
Mustache,
ich) {

  var CarouselEventView = function(model){
    this.model = model;
    this.template = {
      event: ich.getTemplate('carousel-event')
    };
  };

  CarouselEventView.prototype.render = function(){
    var view = {
      name: this.timelineEvent.name,
      date: this.timelineEvent.date,
      summary: this.timelineEvent.summary,
      imageURL: this.timelineEvent.imageURL,
      resourceURL: this.timelineEvent.resourceURL
    };

    var output = Mustache.render(this.template, view);

    return output;
  };

  return CarouselEventView;

});
