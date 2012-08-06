(function (exports) {

  function Draggable(element, opts) {
    if(Compatible){
      var draggable = this;

      Draggable.register(element);
      draggable.positioning = 'relative';
      draggable.events = Draggable.deviceEvents;
      draggable.axis = undefined;
      draggable.callback = {};
      draggable.element = element;
      draggable.bound = function (m) {
        return true;
      };
      draggable.options(opts);
      draggable.topz = '999999';

      element.draggableInstance = draggable;
      element.drgbl = true;

      Compatible.addListener(element, draggable.events.dragstart, Draggable.handleDragEvent);
    }
  }

  Draggable.register = function ( element ){
    var initialiseDraggableElements = function(){
      if ( Draggable.elements == undefined ){
        Draggable.elements = [];
      }
    }

    initialiseDraggableElements();
    Draggable.elements.push(element);
  }

  Draggable.prototype.options = function (opts) {
    var draggable = this;
    if (opts) {
      if (opts.axis == "x" || opts.axis == "y") {
        draggable.axis = opts.axis;
      }
      if (opts.callback) {
        draggable.callback = opts.callback;
      }
      if (opts.positioning) {
        draggable.positioning= opts.positioning;
      }
      if (opts.bound instanceof Function) {
        draggable.bound = opts.bound;
      }
    }
  }

  Draggable.prototype.before = function (e, name) {
    var target = Draggable.dragging || Draggable.draggableTarget(e);
    var draggable = target.draggableInstance;

    if (draggable && draggable.callback[name] instanceof Function) {
      draggable.callback[name].call(target, e);
    }
  }

  Draggable.prototype.dragstart = function (e) {
    var draggable = this.draggableInstance;

    this.style.position = draggable.positioning; 
    this.style.zIndex = draggable.topz;

    Compatible.addListener(document, draggable.events.dragging, Draggable.handleDragEvent);
    Compatible.addListener(document, draggable.events.dragend, Draggable.handleDragEvent);

    var startingPosition = Compatible.eventPosition(e);
    var currentTargetPosition = Draggable.draggableTargetPosition(e);

    draggable.offset = {
      x: currentTargetPosition.x - startingPosition.x,
      y: currentTargetPosition.y - startingPosition.y
    }

    Draggable.dragging = this;
  }

  Draggable.prototype.dragging = function (e) {

    var draggable = Draggable.dragging.draggableInstance;
    var inPixels = function (n) {
        return n + "px";
      }

    var currentMousePosition = Compatible.eventPosition(e);
    var movePosition = {
      x: currentMousePosition.x + draggable.offset.x,
      y: currentMousePosition.y + draggable.offset.y
    }

    if (draggable.bound(movePosition)) {

      if (draggable.axis == 'x' || draggable.axis == undefined) {
        Draggable.dragging.style.left = inPixels(movePosition.x);
      }
      if (draggable.axis == 'y' || draggable.axis == undefined) {
        Draggable.dragging.style.top = inPixels(movePosition.y);
      }

    }

  }

  Draggable.prototype.dragend = function (e) {
    var draggable = Draggable.dragging.draggableInstance;

    if (draggable) {
      Compatible.removeListener(
        document, 
	draggable.events.dragging, 
	Draggable.handleDragEvent);

      Compatible.removeListener(
        document, 
	draggable.events.dragend, 
	Draggable.handleDragEvent);

      Draggable.dragging = undefined;
    }
  }

  Draggable.deviceEvents = (function () {
    var isTouchDevice = !! ('ontouchstart' in window) ? 1 : 0;

    var touchEvents = {
      dragstart: 'touchstart',
      dragging: 'touchmove',
      dragend: 'touchend'
    }
    var mouseEvents = {
      dragstart: 'mousedown',
      dragging: 'mousemove',
      dragend: 'mouseup'
    }

    return (isTouchDevice ? touchEvents : mouseEvents);
  })()
  
  Draggable.draggableTargetPosition = function (e) {
    var target = Draggable.draggableTarget(e);
    return Compatible.positionFromStyle(target);
  }

  Draggable.draggableTarget = function (e) {
    var target = Compatible.target(e);
    var localTarget = target;

    while (localTarget.parentNode && localTarget.draggableInstance == undefined) {
      localTarget = localTarget.parentNode
    }
    if (localTarget.draggableInstance) target = localTarget;

    return target;
  }

  Draggable.handleDragEvent = function (e) {
    if (!e) e = window.event;
    var target = Draggable.draggableTarget(e);
    var draggable = target.draggableInstance || Draggable.dragging.draggableInstance;

    for (var eventName in draggable.events) {
      if (draggable.events[eventName] == e.type) {
        draggable.before(e, eventName);
        draggable[eventName].call(target, e);

        Compatible.preventDefault(e);
      }
    }
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Draggable;
    });
  }

  exports.Draggable = Draggable;

}(this));
