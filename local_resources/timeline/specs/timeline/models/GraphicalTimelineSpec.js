describe('GraphicalTimeline model', function () {

  beforeEach(function(){
    GraphicalTimeline = js_require_modules['GraphicalTimeline'];
    GraphicalTimelineEvent = js_require_modules['GraphicalTimelineEvent'];
    window.clock = sinon.useFakeTimers();
  });	  

  afterEach(function () {
    window.clock.restore();
  });

  it('should have the property lockToViewport which defaults to true', function(){
    var graphicalTimeline = new GraphicalTimeline();
    expect(graphicalTimeline.lockToViewport).toEqual(true);
  });

  it('should have the property dragInProgress which defaults to false', function(){
    var graphicalTimeline = new GraphicalTimeline()
    expect(graphicalTimeline.dragInProgress).toEqual(false);
  });

  it('should have the property draggable which defaults to true', function(){
    var graphicalTimeline = new GraphicalTimeline()
    expect(graphicalTimeline.draggable).toEqual(true);
  });
 
  describe('init',function(){

    it('should call addEvent for each graphicalEvent',function(){
      var spy = jasmine.createSpy('addEvent');
      var originalCall = GraphicalTimeline.prototype.addEvent
      GraphicalTimeline.prototype.addEvent = spy;

      spy.plan = originalCall;
      var graphicalTimeline = dummyTimeline();

      expect(spy.callCount).toEqual(graphicalTimeline.graphicalEvents.length);
    });

    it('should call makeDraggable if draggable is set to true',function(){
      spyOn(GraphicalTimeline.prototype, "makeDraggable");
      var graphicalTimeline = dummyTimeline(); 

      expect(graphicalTimeline.makeDraggable).toHaveBeenCalled();
    });
  });

  describe('makeDraggable',function(){
    it('should return a new Draggable object that is also appended as a property to the timeline dom element',function(){
      var graphicalTimeline = dummyTimeline(); 
      var draggableInstance = graphicalTimeline.makeDraggable();
      var draggableInstanceOnTimeline = graphicalTimeline.$timeline.get(0).draggableInstance;

      expect(draggableInstance).toBeAnInstanceOf(Draggable);
      expect(draggableInstance).toEqual(draggableInstanceOnTimeline);
    });	

    it('should set dragInProgress to true when dragging is in progress',function(){
      var graphicalTimeline = dummyTimeline(); 
      var fireEvent = function(element,event){
        var e = document.createEvent("HTMLEvents");
        e.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(e);
      }

      var timelineElement = graphicalTimeline.$timeline.get(0);
      fireEvent(timelineElement,'mousedown');
      fireEvent(timelineElement,'mousemove');

      expect(graphicalTimeline.dragInProgress).toEqual(true);    
    });
  });

  describe('addEvent',function(){
     
     it('should add a graphicalEvent to the ' +
	'GraphicalTimelineEvents array on graphicalTimeline', function(){

      var graphicalEvent = dummyTimelineEvent();
      var graphicalTimeline = dummyTimeline();
      var expectedCount = graphicalTimeline.graphicalEvents.length + 1;

      graphicalTimeline.addEvent(graphicalEvent);

      expect(graphicalTimeline.graphicalEvents).toHaveCount(expectedCount);
    });

    it('should add the events listed in eventListenersForGraphicalEvents ' +
       'to the graphicalEvent passed',function(){
      var timelineEvent = new TimelineEvent(); 
      var graphicalTimeline = dummyTimeline();

      var indexOfCreatedGraphicalEvent = 
        graphicalTimeline.graphicalEvents.length;

      var expectedEventListeners = graphicalTimeline.eventListenersForGraphicalEvents;
      graphicalTimeline.addEvent(timelineEvent);

      var graphicalEvent = graphicalTimeline.graphicalEvents[indexOfCreatedGraphicalEvent];

      expect(graphicalEvent).toHaveEventListeners(expectedEventListeners);

    });
  });

  describe('width', function(){
    it('should report the width of the timeline including margins', function(){
      var graphicalTimeline = dummyTimeline();

      var $lastElement = $(graphicalTimeline.$timeline.find('li.tl-event').last());
      var expectedWidth = $lastElement.position().left + $lastElement.outerWidth();

      expect(expectedWidth).toEqual(graphicalTimeline.width());
    });
  });

  describe('viewportWidth', function(){
    it('should report the width of the viewport the events are displayed inside', function(){
      var graphicalTimeline = dummyTimeline();
      var expectedWidth = graphicalTimeline.$container.width();

      expect(expectedWidth).toEqual(graphicalTimeline.viewportWidth());
    });
  });

  describe('moveTimeline',function(){
    it('if lockToViewport is true should not move the timeline ' +
       'beyond the bounds of the viewport', function(){

      var dummyCallback = function(){}
      var graphicalTimeline = dummyTimeline(); 
      graphicalTimeline.animationOptions = function(){};
      expect(graphicalTimeline.lockToViewport).toEqual(true);

      // Set spy
      spyOn(graphicalTimeline.$timeline, "animate");

      var moveDistance = 300;
      graphicalTimeline.moveTimeline(moveDistance,dummyCallback);

      var expectedMoveProperties = graphicalTimeline.animationProperties(0); 
      expect(graphicalTimeline.$timeline.animate).toHaveBeenCalledWith(
	      expectedMoveProperties,undefined);

      // Reset spy
      graphicalTimeline.$timeline.animate.reset();

      var moveDistance = -5000;
      graphicalTimeline.moveTimeline(moveDistance,dummyCallback);

      var expectedMoveProperties = graphicalTimeline.animationProperties(-915);
      expect(graphicalTimeline.$timeline.animate).toHaveBeenCalledWith(
	      expectedMoveProperties,undefined);

    });

    it('should call the animate function on the contained ' +
       'jquery element with the distance specified when called', function(){

      var graphicalTimeline = dummyTimeline(); 
      var dummyCallback = function(){}
      var moveDistance = -300;
      var expectedMoveProperties = graphicalTimeline.animationProperties(moveDistance); 
      graphicalTimeline.animationOptions = function(){};

      spyOn(graphicalTimeline.$timeline, "animate");
      graphicalTimeline.moveTimeline(moveDistance,dummyCallback);

      expect(graphicalTimeline.$timeline.animate).toHaveBeenCalledWith(
	      expectedMoveProperties,undefined);
    });
  });

  describe('centerEvent' , function(){
      it('should call moveTimeline with the correct left distance, ' + 
	 'and this.updateEventVisibility as a callback', function () {	    

      var graphicalTimeline = dummyTimeline(); 
      spyOn(graphicalTimeline,"moveTimeline");

      var targetGraphicalEvent = graphicalTimeline.graphicalEvents[2];
      graphicalTimeline.centerEvent(targetGraphicalEvent);

      expect(graphicalTimeline.moveTimeline).toHaveBeenCalledWith(
        -447,graphicalTimeline.updateVisibilityCallback);
    });

  });

  describe('centralEvent',function(){
    it('should return the event closest to the center of the viewport', function(){
      var graphicalTimeline = dummyTimeline(); 
      var targetGraphicalEvent = graphicalTimeline.graphicalEvents[0];

      expect(graphicalTimeline.centralEvent()).toEqual(targetGraphicalEvent);
    });	
  });

  describe('viewportWidth',function(){
    it('should return the correct width of the viewport',function(){
      var graphicalTimeline = dummyTimeline(); 
      
      expect(graphicalTimeline.viewportWidth()).toEqual(620);
    });
  });

  describe('focusEvent' , function(){
    it('should call setFocussed on the graphicalEvent passed to it',function(){
      var graphicalTimeline = dummyTimeline(); 
      var targetGraphicalEvent = graphicalTimeline.graphicalEvents[4];

      spyOn(targetGraphicalEvent,"setFocussed");
      graphicalTimeline.focusEvent(targetGraphicalEvent);

      expect(targetGraphicalEvent.setFocussed).toHaveBeenCalled();
    });
  });

  describe('length' , function(){
    it('should report the correct length of its event array', function () {	    
      var graphicalTimeline = dummyTimeline(); 
      expect(graphicalTimeline.length()).toEqual(5);
    });
  });

  describe('visibleEvents', function(){
    it('should return the events visible within the viewport', function(){
      var graphicalTimeline = dummyTimeline();

      var visibleEvents = graphicalTimeline.visibleEvents();

      expect(visibleEvents).toHaveCount(2);
    });
  });

});
