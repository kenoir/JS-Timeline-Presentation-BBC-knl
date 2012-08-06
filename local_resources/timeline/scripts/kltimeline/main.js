require({
  paths: {
    'timeline': 'timeline',
    'vendor': 'vendor',
    'template': 'timeline/template'
  }
});

require(
  ['timeline/controllers/TimelineController',
  'timeline/models/ConfigurationLoader'], 
  function (
    TimelineController,
    ConfigurationLoader) {

  var config = ConfigurationLoader.load();
  TimelineController.init(config);

});
