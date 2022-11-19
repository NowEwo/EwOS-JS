var Terminal = this ;
var Shell = parent ;
var Kernel = parent.Kernel ;
var TermElement = jQuery(function($, undefined) {
 $('body').terminal(function(command) {
  if (command !== '') {
    try {
      var result = eval(command);
      if (result !== undefined) {
        this.echo(new String(result));
      }
    } catch(e) {
      this.error(new String(e));
    }
  }
}, {
 greetings: 'Selaria MountainRange terminal',
 prompt: 'MountainRange> ',
 color: 'White'
 });
});