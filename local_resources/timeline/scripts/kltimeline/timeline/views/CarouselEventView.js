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

  CarouselEventView.prototype.append = function(appendTo){
    $timeline = appendTo.find('.timeline');
    $panels = $timeline.find('li.tl-panel');

    if($panels){
      $timeline.find('li.tl-panel').last().before(this.$element);
    } else {
      $timeline.append(this.model.$event);
    }
  };

	CarouselEventView.prototype.render = function (){
    var view = {
      name: this.model.timelineEvent.name,
      date: this.model.timelineEvent.date,
      summary: this.model.timelineEvent.summary,
      imageURL: this.model.timelineEvent.imageURL,
      resourceURL: this.model.timelineEvent.resourceURL
    };

    var output = Mustache.render(this.template.event, view);
    var $container = $(output);

    var $li = this.$element = $container;

    $li.css('backgroundColor','#D3D3D3');
		$li.find('img').css('display','none');
		$li.find('img').load(function(e){
      $li.css('backgroundColor','#FFFFFF');
			$(e.target).fadeIn(500,function(){
        $(this).removeAttr("style");
      });
		});
    return $container; 
	};

  return CarouselEventView; 

});
