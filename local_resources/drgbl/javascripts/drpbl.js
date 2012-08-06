(function ( exports ) {

	function Droppable ( element, events ) {
    if ( Draggable && Compatible && 
         element && events ){
      var droppable = this;

      Droppable.register(element);
      droppable.events = Droppable.deviceEvents;
      droppable.element = element;
      droppable.callback = events;

      element.droppableInstance = this;
      element.drpbl = true;

      Compatible.addListener(document, droppable.events.hover, Droppable.handleDropEvent);
      Compatible.addListener(document, droppable.events.dropped, Droppable.handleDropEvent);
		} 
	}

  Droppable.handleDropEvent = function (e) {
    var dragged = Draggable.dragging;

    if(dragged){
      var intersectingElements = Droppable.intersecting(dragged);
      for ( var i = 0; i < intersectingElements.length; i++){
        var droppable = intersectingElements[i].droppableInstance;

        for (var eventName in droppable.events) {
					if ( droppable.events[eventName] == e.type &&
							 droppable.callback[eventName] instanceof Function) {

            droppable.callback[eventName].call(dragged,intersectingElements[i]);
            Compatible.preventDefault(e);

          }
        }
      }
    }
  }

  Droppable.deviceEvents = (function () {
    var isTouchDevice = !! ('ontouchstart' in window) ? 1 : 0;

    var touchEvents = {
      hover: 'touchmove',
      dropped: 'touchend'
    }
    var mouseEvents = {
      hover: 'mousemove',
      dropped: 'mouseup'
    }

    return (isTouchDevice ? touchEvents : mouseEvents);
  })()

  Droppable.intersecting = function (element){
    var elements = [];
    for(var i = 0; i < Droppable.elements.length; i++){
      if(Droppable.intersect(Droppable.elements[i],element)){
        elements.push(Droppable.elements[i]);
      }
    }
    return elements;
  }

  Droppable.register = function ( element ){
    var initialiseDroppableElements = function(){
      if ( Droppable.elements == undefined ){
        Droppable.elements = [];
      }
    }

    initialiseDroppableElements();
    Droppable.elements.push(element);
  }

	Droppable.intersect = function(firstElement,secondElement){

  	var inRange = function(n,start,end){
			if(start <= n && end >= n){
				return true;
			}
			return false;
		}

		var edgeIntersect = function(firstEdge,secondEdge){
			if( inRange(firstEdge.e0,secondEdge.e0,secondEdge.e1) ||
          inRange(firstEdge.e1,secondEdge.e0,secondEdge.e1) ||
          inRange(secondEdge.e0,firstEdge.e0,firstEdge.e1) ||
          inRange(secondEdge.e1,firstEdge.e0,firstEdge.e1)){

						return true;
			}
			return false;
		}

		var topEdge = function(p,w){
			return {
				e0: p.x,
				e1: p.x + w
			}
		}

		var sideEdge = function(p,h){
			return {
				e0: p.y,
				e1: p.y + h
			}
		}
	
		var p1 = Compatible.positionFromOffset(firstElement);
		var p2 = Compatible.positionFromOffset(secondElement);
		var w1 = firstElement.offsetWidth;
		var w2 = secondElement.offsetWidth;
		var h1 = firstElement.offsetHeight;
		var h2 = secondElement.offsetHeight;

		if(edgeIntersect(
				topEdge(p1,w1),
				topEdge(p2,w2)) && 
			 edgeIntersect(
				sideEdge(p1,h1),
				sideEdge(p2,h2))){

				return true;
		}

		return false;

	}

	if ( typeof define === 'function' && 
		define.amd ) {

		define ( function () {
			return Droppable;
		});

	}

	exports.Droppable = Droppable;

}(this));
