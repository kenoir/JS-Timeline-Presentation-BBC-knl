describe('GraphicalTimelineEvent model', function () {

  beforeEach(function(){
    GraphicalTimelineEvent = js_require_modules['GraphicalTimelineEvent'];
  });

  it('should have a visible property which defaults to false', function() {
    var graphicalTimelineEvent = new GraphicalTimelineEvent();
    expect(graphicalTimelineEvent.visible).toEqual(false);
  }); 

  it('should have a focus property which defaults to false', function() {
    var graphicalTimelineEvent = new GraphicalTimelineEvent();
    expect(graphicalTimelineEvent.focus).toEqual(false);
  }); 

  describe('init',function(){
    it('should add the list of default eventListeners to itself',function(){
      var graphicalTimelineEvent = new GraphicalTimelineEvent();

      var dummyFunction = function(){};
      var dummyEventListeners = { 'event' : dummyFunction };
      var dummyJQueryElement = $('<div/>');

      graphicalTimelineEvent.eventListeners = dummyEventListeners; 
      graphicalTimelineEvent.init(dummyJQueryElement);

      expect(graphicalTimelineEvent).toHaveEventListeners(dummyEventListeners);   
    });

    it('should proxy the focus event on any anchor tags to the click event',function(){
      var graphicalTimelineEvent = dummyTimelineEvent(); 
      spyOn(graphicalTimelineEvent,'emit');

      graphicalTimelineEvent.$event.find('a').focus();

      expect(graphicalTimelineEvent.emit).toHaveBeenCalledWith('click');
 
    });

  });

  describe('setFocussed',function(){
    it('should change the focussed property',function(){
      var graphicalTimelineEvent = dummyTimelineEvent(); 

      graphicalTimelineEvent.setFocussed(true);
      expect(graphicalTimelineEvent.focus).toEqual(true);
    });

    it('should emit the "focus" event when called with true',function(){
      var graphicalTimelineEvent = dummyTimelineEvent(); 
      spyOn(graphicalTimelineEvent,'emit');

      graphicalTimelineEvent.setFocussed(true);
      expect(graphicalTimelineEvent.emit).toHaveBeenCalledWith('focus');
    });

    it('should emit the "blur" event when called with false on a focussed event',function(){
      var graphicalTimelineEvent = dummyTimelineEvent(); 
      spyOn(graphicalTimelineEvent,'emit');

      graphicalTimelineEvent.setFocussed(true);
      graphicalTimelineEvent.setFocussed(false);
      expect(graphicalTimelineEvent.emit).toHaveBeenCalledWith('blur');
    });
 

  });

  describe('width', function() {
    it('should report its width', function(){
      var graphicalTimelineEvent = dummyTimelineEvent(); 

      expect(graphicalTimelineEvent.width()).toEqual(100);
    })
  })


});
