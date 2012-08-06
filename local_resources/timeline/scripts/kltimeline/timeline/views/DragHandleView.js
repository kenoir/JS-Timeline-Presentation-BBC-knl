define(
['jquery-1',
'vendor/mustache',
'vendor/icanhaz',
'vendor/drgbl'],

function (
$,
Mustache,
ich,
Draggable) {

	var DragHandleView = function(model,opts){
		this.model = model;
		this.opts = opts;
		this.template = {
			handle: ich.getTemplate('drag-handle') 
		};
	};

  DragHandleView.prototype.append = function(){
    this.model.$container.find('li').last().after(this.$element);
    new Draggable(this.$element.get(0),this.opts);
  };

	DragHandleView.prototype.render = function (){
		var view = {};

	var output = Mustache.render(this.template.handle, view);
    var $container = $(output);

    this.$element = $container;

    return $container; 

	};

  return DragHandleView; 

});
