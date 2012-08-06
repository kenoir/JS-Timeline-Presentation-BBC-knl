define(
['jquery',
'vendor/mustache',
'vendor/icanhaz'],

function (
$,
Mustache,
ich) {

	var EventView = function(model){
		this.model = model;
		this.template = {
			event: ich.getTemplate('carousel-event'), 
		};
	}

  EventView.prototype.append = function(appendTo){
    $timeline = appendTo.find('.timeline')
    $panels = $timeline.find('li.tl-panel');
    if($panels){
      $timeline.find('li.tl-panel').last().before(this.$element);
    } else {
      $timeline.append(this.model.$event);
    }
  }

	EventView.prototype.render = function (){
    var view = {
      name: this.model.timelineEvent.name,
      date: this.model.timelineEvent.date,
      summary: this.model.timelineEvent.summary,
      imageURL: this.model.timelineEvent.imageURL,
      resourceURL: this.model.timelineEvent.resourceURL,
    };

    var output = Mustache.render(this.template.event, view);
    var $container = $(output);

    this.$element = $container;

    return $container; 
	}

  return EventView; 

});
