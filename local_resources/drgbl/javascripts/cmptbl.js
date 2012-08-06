(function (exports) {

	function Compatible(){

	}

  Compatible.preventDefault = function (e) {
    if (e && e.preventDefault instanceof Function) {
      e.preventDefault();
    }
    e.returnValue = false;
  }

  Compatible.eventPosition = function (e) {
    var posx = 0;
    var posy = 0;
    if (!e) var e = window.event;

    if (e.changedTouches && e.changedTouches[0]) {
      posx = e.changedTouches[0].pageX;
      posy = e.changedTouches[0].pageY;
    } else if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    };
  }

  Compatible.positionFromStyle = function (target) {
   var extractInt = function (value) {
      var n = parseInt(value);
      return n == null || isNaN(n) ? 0 : n;
    }
    return {
      x: extractInt(target.style.left),
      y: extractInt(target.style.top)
    }
  }

  Compatible.addListener = function (target, eventName, callback) {

    if (target.addEventListener) {
      target.addEventListener(eventName, callback, false);
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventName, callback);
    }
  }

  Compatible.removeListener = function (target, eventName, callback) {
    if (target.removeEventListener) {
      target.removeEventListener(eventName, callback, false);
    } else if (target.detachEvent) {
      target.detachEvent('on' + eventName, callback);
    }
  }

  // Shamelessly copied from Prototype.js source ...
  Compatible.positionFromOffset = function(t) {
    var element = t;
    var valueT = 0, valueL = 0, docBody = document.body;

    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      // Safari fix
      if (element.offsetParent == docBody &&
        element.style.position == 'absolute') break;
    } while (element = element.offsetParent);

    element = t;
    do {
      // Opera < 9.5 sets scrollTop/Left on both HTML and BODY elements.
      // Other browsers set it only on the HTML element. The BODY element
      // can be skipped since its scrollTop/Left should always be 0.
      if (element != docBody) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);    

    return { x: valueL, y:valueT };
  }

  Compatible.target = function (e) {
    return e.target || e.srcElement;
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Compatible;
    });
  }

  exports.Compatible = Compatible;

}(this));
