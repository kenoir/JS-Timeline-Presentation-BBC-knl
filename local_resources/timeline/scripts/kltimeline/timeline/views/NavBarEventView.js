define(
['jquery-1',
'vendor/mustache',
'vendor/icanhaz'],

function (
$,
Mustache,
ich) {

	var NavBarEventView = function(model){
		this.model = model;
		this.template = {
			event: ich.getTemplate('navbar-event')
		};
	};

  NavBarEventView.prototype.append = function(appendTo){
    $timeline = appendTo.find('.navbar');
    $timeline.append(this.$element);
  };

	NavBarEventView.prototype.render = function (){
    var view = {
      name: this.model.timelineEvent.name
    };

    var output = Mustache.render(this.template.event, view);
    var $container = $(output);

    this.$element = $container;
    return $container; 
	};

  return NavBarEventView; 

});
