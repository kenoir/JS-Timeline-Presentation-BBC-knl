define(['jquery-1','istats-1','timeline/models/Stats','vendor/modernizr.custom'], function ($,istats,Stats) {

  var ConfigurationLoader = function () {

  };

  ConfigurationLoader.load = function () {
			

    var config = {

			logWriter: istats, 
      navBarEventListeners: function (carousel, navBar) {

        return {
					click: function(){
						var logData = { 'eventResourceURL' : this.e.timelineEvent.resourceURL };
						Stats.log('click.event.navbar.kltimeline',logData);
					},
					mouseenter: function(){
						var tooltip = this.e.$event.find('.navbar-tooltip');
						tooltip.hide();
						tooltip.css('left','-95px');
						tooltip.fadeIn();
					},
					mouseleave: function(){
						var tooltip = this.e.$event.find('.navbar-tooltip');
						tooltip.css('left','-10000px');
					},
          focus: function () {
            var carouselEvent = carousel.hasTimelineEvent(this.e.timelineEvent);

            if (!carouselEvent.focus && !Draggable.dragging) {
              carousel.centerEvent(carouselEvent);
              carousel.focusEvent(carouselEvent);
            }

						var $dragHandle = navBar.dragHandle; 
						if (!Draggable.dragging ||
								Draggable.dragging.draggableInstance !== $dragHandle.get(0).draggableInstance) {
		
              var focussedEvent = this.t.focussedEvent();

              $dragHandle.clearQueue();
              $dragHandle.animate({
                left: focussedEvent.$event.position().left + 5
              });
            }
          }
        };	
			},
			carouselTimelineListeners: function(carousel, navbar){
				return {
					refocussed: function(){ 
        		carousel.$timeline.find('li a').attr('tabindex','-1');
        		carousel.$timeline.find('li.timeline-item-next a').removeAttr('tabindex');
        		carousel.$timeline.find('li.timeline-item-previous a').removeAttr('tabindex');
						carousel.$timeline.find('li.timeline-item-focussed a').removeAttr('tabindex');
					},
					dragend: function(){
						var logData = { 'eventResourceURL' : carousel.focussedEvent().timelineEvent.resourceURL };
						Stats.log('dragged.timeline.kltimeline',logData);
					}
				};
			},
      carouselEventListeners: function (carousel, navBar) {

        return {
					click: function(){
						if(this.e.$event.hasClass('timeline-item-next')){
							var logData = { 'eventResourceURL' : this.e.timelineEvent.resourceURL };
							Stats.log('click.nextEvent.timeline.kltimeline',logData);
						}
						if(this.e.$event.hasClass('timeline-item-previous')){
							var logData = { 'eventResourceURL' : this.e.timelineEvent.resourceURL };
							Stats.log('click.previousEvent.timeline.kltimeline',logData);
						}
	
					},
					mouseenter: function () {
						var timelineEvent = this.e.timelineEvent;							
						if (this.e.focus) {
							var logData = { 'eventResourceURL' : this.e.timelineEvent.resourceURL };
							Stats.log('hover.focussedEvent.timeline.kltimeline',logData);

              this.e.hovered = true;
              var offset = 86;

              $(this.e.$event).find('.tl-details').clearQueue();
              $(this.e.$event).find('.tl-details').animate({
                top: offset
              });
            }
          },
          mouseleave: function () {
						var timeline = this.t;
						
            if (this.e.focus && this.e.hovered) {
              this.e.hovered = false;
							var offset = 180;

              $(this.e.$event).find('.tl-details').clearQueue();
              $(this.e.$event).find('.tl-details').animate({
                top: offset 
							},500,function(){				
								
							});
            }
          },
          next: function(){
            if(!Modernizr.csstransforms){
              this.e.$event.stop(true);
              this.e.$event.delay(200).animate({ 
                top:17,
                width:273,
                height:154
              }, { 
                step: function(){
                  $(this).css('overflow','visible');
                } 
              }).css('overflow','visible');

              $(this.e.$event).find('.tl-details').stop();
              $(this.e.$event).find('.tl-details').delay(200).animate({
								top:160
              });
            }
          },
          previous: function(){
            if(!Modernizr.csstransforms){
              this.e.$event.stop(true);
              this.e.$event.delay(200).animate({ 
                top:17,
                width:273,
                height:154
              }, { 
                step: function(){
                  $(this).css('overflow','visible');
                } 
              }).css('overflow','visible');

							$(this.e.$event).find('.tl-details').stop();
							$(this.e.$event).find('.tl-details').delay(200).animate({
								top:160
							});
            }
          },
          focus: function () {
             if(!Modernizr.csstransforms){
              this.e.$event.stop(true);
              this.e.$event.delay(200).animate({ 
                top:0,
                width:304,
                height:171
              }, { 
                step: function(){
                  $(this).css('overflow','visible');
                } 
              }).css('overflow','visible');
            }
        
						var timeline = this.t;
						var graphicalTimelineEvent = this.e;

            var navbarEvent = navBar.hasTimelineEvent(this.e.timelineEvent);

            if (!navbarEvent.focus) {
              navBar.focusEvent(navbarEvent);
            }

						var offset = 86;

            $(this.e.$event).find('.tl-details').clearQueue();
            $(this.e.$event).find('.tl-details').delay(500).animate({
              top: offset
						},500,function(){

						if (graphicalTimelineEvent.focus) {
						 	graphicalTimelineEvent.$event.find('a').bind('touchstart click',$.proxy(graphicalTimelineEvent.clickAction,graphicalTimelineEvent));
						}

						});
          },
          blur: function () {
						var offset = 180;

						this.e.$event.find('a').unbind('click',this.e.clickAction);
						this.e.$event.find('a').unbind('touchstart',this.e.clickAction);

            $(this.e.$event).find('.tl-details').clearQueue();
            $(this.e.$event).find('.tl-details').animate({
              top: offset + 1
            },500);
					}
        };

      },
     dragHandleOptions: function (carousel, navBar) {

        return {
          bound: function(){
            var offset = 16;
            var bottomBound = 0 - offset; 

            var topBound = $('.navbar').width(); 
            var currentPosition = $(this.element).position().left;

            if( currentPosition > bottomBound &&
                currentPosition < topBound){

                return true;
            }
          },
          axis: 'x',
          positioning: 'absolute',
          callback: {
						dragging: function(){
							var navWidth = navBar.width();
							var handlePos = 0;

							var $dragHandle = navBar.dragHandle; 
							var handlePos = $dragHandle.position().left;
							var percent = handlePos/navWidth;

							var carouselWidth = carousel.width();
							var travel = carouselWidth * percent;

							var eventCount = navBar.graphicalEvents.length;
							var eventIndex = Math.round(eventCount * percent);

							if(eventIndex > eventCount - 1) 
								eventIndex = eventCount - 1;

							if(eventIndex < 0) 
								eventIndex = 0;

              navBar.focusEvent(navBar.graphicalEvents[eventIndex]);

							carousel.$timeline.css('left', -travel);
						},
            dragend: function () {
              var focussedEvent = navBar.focussedEvent();

							var $dragHandle = navBar.dragHandle; 
              $dragHandle.clearQueue();
              $dragHandle.animate({
                left: focussedEvent.$event.position().left + 5
              }, 500);

              var carouselEvent = carousel.hasTimelineEvent(focussedEvent.timelineEvent);

              if (carouselEvent) {
								var logData = { 'eventResourceURL' : carouselEvent.timelineEvent.resourceURL };
								Stats.log('dragged.handle.navbar.kltimeline',logData);
	
                carousel.centerEvent(carouselEvent);
                carousel.focusEvent(carouselEvent);
              }

            }
          }
        };
      },
      navBarOptions: {
        showPanels: false,
        draggable: false,
        moveable: true,
        timelineAttachSelector: '.navBar'
      },

        selectors:  {
          timeline: {
            name: { selector: '.tl-header-title' },
            summary: { selector: '.tl-header-summary' },
            start: {selector: '.tl-header-start-date' },
            end: {selector: '.tl-header-end-date' },
            selector: '.kl-timeline'
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
        targetSelector: ".kl-timeline"
      };

			if(kltimelineConfig !== undefined){
				for(var property in kltimelineConfig){
					config[property] = kltimelineConfig[property];
				}
			}
			
			return config;

  };


  return ConfigurationLoader;

});
