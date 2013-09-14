/* Grogbot JS controller for Arduino.
   Two main functions:
     Control Arduino connection and listener
     On click of button or push of hw button, make a drink

*/

var pv = 'scripts/vendor/';
var pl = 'scripts/libs/';
require(["jquery", pv + "dropdown.js", pv + "prettify.js", pl + 'Noduino.js', pl + 'Noduino.Socket.js', pl + 'Logger.HTML.js'], function($, dd, p, NoduinoObj, Connector, Logger) {
  var Noduino = null,
      motor = null,
      button = null,
      createMotor = function(board) {
        $('#interval-slide').change(function(e){
          var speed = this.value;
          if (!motor){
            board.withMotor({pin:9}, function(e,Motor){
              motor = Motor;
              motor.setSpeed(speed);
            });
          } else {
            motor.setSpeed(speed);
          }
        });
      };

  var connectButton = function(board) {
    board.withButton({pin: 13}, function(err, Button) {

      if (err) { return console.log(err); }

      Button.on('push', function() {
        console.log('Button pushed');
      });

      Button.push();
    });

  };

  var makeDrink = function(board) {
      board.withMotor({pin: 9}, function(e, Motor) {
        motor = Motor;
        motor.setSpeed(10);
      });
  };

  $(document).ready(function(e) {
    $('#connect').click(function(e) {
      // Put stuff that should happen when the "Connect" button is clicked in here.
      e.preventDefault();

      if (!Noduino || !Noduino.connected) {
        // Connect to Arduino
        Noduino = new NoduinoObj({debug: true, host: 'http://localhost:8090', logger: {container: '#connection-log'}}, Connector, Logger);
        Noduino.connect(function(err, board) {
          $('#connection-status .alert').addClass('hide');
          if (err) {
            $('#connection-status .alert-error').removeClass('hide'); }
          else {
            $('#connection-status .alert-success').removeClass('hide'); connectButton(board); }
        });
      }
    });
  });
});