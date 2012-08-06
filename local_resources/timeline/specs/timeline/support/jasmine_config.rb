module Jasmine
  class Config

    def jasmin_execute_js_prepend
      """
      
      window.webkitRequestAnimationFrame = null;
      window.mozRequestAnimationFrame = null;
      window.oRequestAnimationFrame = null;

       require({ baseUrl: 'http://localhost:8888/webapp/static/' });

       require({
        paths: {
           'jquery-1': 'script-dev/vendor/jquery.min',
           'istats-1': 'script-dev/vendor/istats.fake',
           'timeline': 'script-dev/timeline',
           'vendor': 'script-dev/vendor',
           'template': 'script-dev/timeline/template'
         }
       });

       require([
                'timeline/controllers/TimelineController',
                'timeline/models/Stats',
                'timeline/models/Parser',
                'timeline/models/Timeline',
                'timeline/models/TimelineEvent',
                'timeline/models/GraphicalTimeline',
                'timeline/models/GraphicalTimelineEvent',
                'timeline/models/ConfigurationLoader',
                '/spec/javascripts/fixtures/TimelineView.js',
                '/spec/javascripts/fixtures/EventView.js'
              ],function(TimelineController,Stats,Parser,Timeline,TimelineEvent,GraphicalTimeline,GraphicalTimelineEvent,ConfigurationLoader,TimelineView,EventView){
         window.js_require_modules = Array();
         window.js_require_modules['TimelineController'] = TimelineController;
         window.js_require_modules['Stats'] = Stats;
         window.js_require_modules['Parser'] = Parser;
         window.js_require_modules['Timeline'] = Timeline;
         window.js_require_modules['TimelineEvent'] = TimelineEvent;
         window.js_require_modules['GraphicalTimeline'] = GraphicalTimeline;
         window.js_require_modules['GraphicalTimelineEvent'] = GraphicalTimelineEvent;
         window.js_require_modules['TimelineView'] = TimelineView;
         window.js_require_modules['EventView'] = EventView;
      """
    end

    def jasmin_execute_js_append
      """
      });
      """
    end

  end
end


# Note - this is necessary for rspec2, which has removed the backtrace
module Jasmine
  class SpecBuilder
    def declare_spec(parent, spec)
      me = self
      example_name = spec["name"]
      @spec_ids << spec["id"]
      backtrace = @example_locations[parent.description + " " + example_name]
      parent.it example_name, {} do
        me.report_spec(spec["id"])
      end
    end
  end
end
