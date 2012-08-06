define(
['jquery-1', 'timeline/models/GraphicalTimelineFactory', 'timeline/models/Parser', 'timeline/views/CarouselView', 'timeline/views/CarouselEventView', 'timeline/views/NavBarView', 'timeline/views/NavBarEventView', 'timeline/views/DragHandleView','timeline/models/Stats'],

function (
$,
GraphicalTimelineFactory,
Parser,
CarouselView,
CarouselEventView,
NavBarView,
NavBarEventView,
DragHandleView,
Stats) {

  return {
    init: function (config) {
      this.config = config;
      this.startLogger();

      // If we are in debug mode, make jQuery available outside require in the Debug object
      if(this.config.debug == true){
        document.Debug ={
          $: $
        }
      }

      if ($(this.config.targetSelector).length > 0) {
        var timelineData = this.getData(document, this.config.selectors);
        if (timelineData) {
          this.buildWidget(this.config.targetSelector, timelineData);
        }
      }
    },

    startLogger: function(){
      Stats.setKey('kltimeline');
      Stats.setWriter(this.config.logWriter);

      if(this.config.debug == true){
        Stats.useDebugWriter = true;
      }

			Stats.log('load.timeline.kltimeline');
    },

    getData: function (document, selectors) {
      var p = new Parser(selectors);
      p.parse(document);

      this.timelineData = p.getTimeline();

      return this.timelineData;
    },

    buildWidget: function (targetSelector, timelineModel) {

      // Create carousel & navbar
      var carousel = GraphicalTimelineFactory.create(timelineModel, this.config.carouselOptions);
      var navBar = GraphicalTimelineFactory.create(timelineModel, this.config.navBarOptions);

      // Create drag handle
			var dragHandleView = new DragHandleView(navBar,
				this.config.dragHandleOptions.apply(this, [carousel, navBar]));

      navBar.dragHandle = dragHandleView.render();

      // Add event listeners
      if (this.config.navBarEventListeners instanceof Function) {
        GraphicalTimelineFactory.addEventListeners(navBar,
        this.config.navBarEventListeners.apply(this, [carousel, navBar]));
      }
      if (this.config.navBarTimelineListeners instanceof Function){
        GraphicalTimelineFactory.addTimelineListeners(carousel,
        this.config.navBarTimelineListeners.apply(this, [carousel, navBar]));
      }
      if (this.config.carouselEventListeners instanceof Function) {
        GraphicalTimelineFactory.addEventListeners(carousel,
        this.config.carouselEventListeners.apply(this, [carousel, navBar]));
      }
      if (this.config.carouselTimelineListeners instanceof Function){
        GraphicalTimelineFactory.addTimelineListeners(carousel,
        this.config.carouselTimelineListeners.apply(this, [carousel, navBar]));
      }

      // Assemble timeline
      var addTimelineToPage = function (graphicalTimeline, TimelineView, EventView) {
          var timelineView = new TimelineView(graphicalTimeline);
          var $timeline = timelineView.render();

          graphicalTimeline.init($timeline);
          timelineView.append(targetSelector);

          for (var i = 0; i < graphicalTimeline.graphicalEvents.length; i++) {
            var timelineEventView = new EventView(graphicalTimeline.graphicalEvents[i]);
            var $event = timelineEventView.render();

            graphicalTimeline.graphicalEvents[i].init($event);
            timelineEventView.append($timeline);
          }
        };

        // Add all elements to page
      addTimelineToPage(carousel, CarouselView, CarouselEventView);
      addTimelineToPage(navBar, NavBarView, NavBarEventView);
      dragHandleView.append();

      carousel.$timeline.find('li.tl-event').first().addClass('tl-event-first');      
      carousel.$timeline.find('li.tl-event').last().addClass('tl-event-last');      

      // Go!
      carousel.reset();
      navBar.reset();
    }
  };
});
