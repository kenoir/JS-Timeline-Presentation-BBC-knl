define(
['jquery',
'vendor/mustache',
'vendor/icanhaz'],

function (
$,
Mustache,
ich) {

	var TimelineView = function(model){
		this.model = model;
		this.template = {
      timeline: ich.getTemplate('carousel'), 
			event: ich.getTemplate('carousel-event'), 
			timelinePanel: ich.getTemplate('carousel-panel') 
		};
	}

	TimelineView.prototype.append = function(targetSelector){
		$(targetSelector).replaceWith(this.$element);
	}

	TimelineView.prototype.render = function (){
    var view = {
      name: this.model.timelineModel.name,
      range: this.model.timelineModel.range,
      length: this.model.timelineModel.events.length + " Events"
    }

    var renderedTimeline = Mustache.render(this.template.timeline, view);

    $container = $(renderedTimeline);
    $timeline = $container.find(this.model.timelineAttachSelector); 

    if (this.model.showPanels) {
      var renderedPanel = Mustache.render(this.template.timelinePanel, view);

      var startPanel = $(renderedPanel);
      var endPanel = $(renderedPanel);

      $timeline.prepend(startPanel);
      $timeline.append(endPanel);
    }
		
		this.$element = $container;
    return $container; 
	}

  return TimelineView; 

});
