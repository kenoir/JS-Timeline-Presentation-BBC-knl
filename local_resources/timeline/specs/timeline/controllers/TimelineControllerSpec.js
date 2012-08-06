describe('TimelineController', function () {

  beforeEach( function() {
    loadFixtures('timeline.html');
    frontController = js_require_modules['TimelineController'];

    Parser = js_require_modules['Parser'];
  });

  var selectors =  {
    timeline: {
      name: { selector: '.tl-header-title' },
      summary: { selector: '.tl-header-summary' },
      start: {selector: '.tl-header-start-date' },
      end: {selector: '.tl-header-end-date' },
      selector: '.kl-timeline',
    },
    event: {
      name: { selector: '.tl-event-title' },
      date: { selector: '.tl-event-date' },
      imageURL: { selector: 'img' },
      resourceURL: { selector: 'a' },
      summary: { selector: '.tl-event-summary' },
      selector: '.tl-event'
    }
  };

  describe('init',function(){
    it('should call getData if the targetSelector length is > 0',function(){
      spyOn(frontController,"getData");

      var dummyConfig = {
        selectors : {},
        targetSelector : '.kl-timeline',
        logWriter: {log:function(){}} 
      };

      frontController.init(dummyConfig);

      expect(frontController.getData).toHaveBeenCalledWith(document,dummyConfig.selectors);
    });

    it('should not call getData if the targetSelector length is 0',function(){
      spyOn(frontController,"getData");

      var dummyConfig = {
        selectors : {},
        targetSelector : '.not-kl-timeline',
        logWriter: {log:function(){}} 
      };

      frontController.init(dummyConfig);

      expect(frontController.getData).wasNotCalled();
    });

    it('should call buildWidget with the target selector, and the output from getTimeline on the Parser instance',function(){
      spyOn(frontController,"buildWidget");

      var dummyConfig = {
        selectors:  {
          timeline: {
            name: { selector: '.tl-header-title' },
            summary: { selector: '.tl-header-summary' },
            start: {selector: '.tl-header-start-date' },
            end: {selector: '.tl-header-end-date' },
            selector: '.kl-timeline',
          },
          event: {
            name: { selector: '.tl-event-title' },
            date: { selector: '.tl-event-date' },
            imageURL: { selector: 'img' },
            resourceURL: { selector: 'a' },
            summary: { selector: '.tl-event-summary' },
            selector: '.tl-event'

          }
        },
        targetSelector: ".kl-timeline",
        logWriter: {log:function(){}} 
      };

      frontController.init(dummyConfig);

      expect(frontController.buildWidget).toHaveBeenCalledWith(
        dummyConfig.targetSelector,
        frontController.timelineData);
    });

  });

  describe('getData',function(){
     it('should instantiate a copy of Parser and call parse on the current document',function(){
       spyOn(Parser.prototype,'parse');
       var dummySelectors = {};

       frontController.getData(document,dummySelectors);

       expect(Parser.prototype.parse).toHaveBeenCalledWith(document);
    });

    it('should call getTimeline on an instance of Parse',function(){
      spyOn(Parser.prototype,'getTimeline');

      frontController.getData(document,selectors);

      expect(Parser.prototype.getTimeline).toHaveBeenCalled();
    });
  });
});

