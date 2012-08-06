describe('Stats model',function(){

  beforeEach(function () {
    Stats = js_require_modules['Stats'];
  });

  it('Stats.setKey should set the value of Stats.key',function(){
    var expected = 'key';

    Stats.setKey(expected);
    expect(Stats.key).toEqual(expected);
  });

  it('Stats.setWriter should set the value Stats.writer',function(){
    var expected = function(){};

    Stats.setWriter(expected);
    expect(Stats.writer).toEqual(expected);
  }); 

  it('Stats.log should call log on the Stats.writer, with the eventName , Stats.key and additional data',function(){
    var dummyWriter = {
      log: function(){}
    }

    spyOn(dummyWriter,'log');

    var expectedKey = 'key';
    var expectedAction = 'action';
    var expectedData = {};

    Stats.setKey(expectedKey);
    Stats.setWriter(dummyWriter);

    Stats.log(expectedAction,expectedData);

    expect(dummyWriter.log).toHaveBeenCalledWith(expectedAction,expectedKey,expectedData);
  });

});
