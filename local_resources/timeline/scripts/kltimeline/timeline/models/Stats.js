define([],function(){

  var Stats = function(){

  }

  Stats.useDebugWriter = false;

  Stats.setKey = function(key){
    Stats.key = key;
  }

  Stats.setWriter = function(writer){
    Stats.writer = writer;
  }

  Stats.log = function(action,data){
    if(Stats.useDebugWriter == true){
      Stats.debugWriter.log(action,Stats.key, data);
    }

    Stats.writer.log(action,Stats.key,data);
  }

  Stats.debugWriter = {
    log: function(action,key,data){
      if(document.Log == undefined) document.Log = [];
      document.Log.push({
        action: action,
        key: key,
        data: data
        });
      }
  }


  return Stats;

});


