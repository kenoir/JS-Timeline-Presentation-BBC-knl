define(
['jquery-1',
'vendor/mustache',
'vendor/icanhaz',
'vendor/modernizr.custom'],

function (
$,
Mustache,
ich) {

	var CarouselView = function(model){
		this.model = model;
		this.template = {
      timeline: ich.getTemplate('carousel'), 
			event: ich.getTemplate('carousel-event'), 
			timelinePanel: ich.getTemplate('carousel-panel') 
		};
	};

	CarouselView.prototype.append = function(targetSelector){
			var $carousel = this.$element;

			if(Modernizr.csstransforms)
				$carousel.addClass('allow-transforms');				

			if(Modernizr.csstransitions)
				$carousel.addClass('allow-transitionis');				

			$(targetSelector).replaceWith($carousel); 
	};

	CarouselView.prototype.render = function (){
    var view = {
      name: this.model.timelineModel.name,
      range: this.model.timelineModel.range,
      length: this.model.timelineModel.events.length + " Events",
      summary: this.model.timelineModel.summary 
    };
    view.range = this.model.timelineModel.start + ' - ' + this.model.timelineModel.end;

    var renderedTimeline = Mustache.render(this.template.timeline, view);

    $container = $(renderedTimeline);
    $timeline = $container.find(this.model.timelineAttachSelector); 

    if (this.model.showPanels) {
			view.panelClass = "begin-panel";
      var renderedStartPanel = Mustache.render(this.template.timelinePanel, view);
      var startPanel = $(renderedStartPanel);

			view.panelClass = "end-panel";
      var renderedEndPanel = Mustache.render(this.template.timelinePanel, view);
      var endPanel = $(renderedEndPanel);

      $timeline.prepend(startPanel);
      $timeline.append(endPanel);
    }
		
		this.$element = $container;
    return $container; 
	};

  return CarouselView; 

});
