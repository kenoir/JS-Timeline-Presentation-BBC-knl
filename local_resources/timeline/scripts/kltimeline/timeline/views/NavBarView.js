define(
['jquery-1',
'vendor/mustache',
'vendor/icanhaz',
'vendor/modernizr.custom'],

function (
$,
Mustache,
ich) {

	var NavBarView = function(model){
		this.model = model;
		this.template = {
      timeline: ich.getTemplate('navbar')
		};
	};

  NavBarView.prototype.append = function(targetSelector){
		var $navBar = this.$element;

		if(Modernizr.csstransforms)
			$navBar.addClass('allow-transforms');				

		if(Modernizr.csstransitions)
			$navBar.addClass('allow-transitions');				

		$(targetSelector).append($navBar);
  };

	NavBarView.prototype.render = function (){
    var view = {
      beginDate: this.model.timelineModel.start,
      endDate: this.model.timelineModel.end
    };

    var renderedTimeline = Mustache.render(this.template.timeline, view);
    $container = $(renderedTimeline);

    this.$element = $container;
    return $container; 
	};

  return NavBarView; 

});
