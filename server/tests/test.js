var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:8000';
var options ={
  transports: ['websocket'],
  'force new connection': true
};


describe('socket', function(){
  it('should echo', function(done){
    var the_data = "the dataaa";
    var cl = io.connect(socketURL, options);
    cl.on('response', function(data){
      data.should.equal(the_data);
      done();
    })
    cl.emit("echo", the_data)
  })
})
