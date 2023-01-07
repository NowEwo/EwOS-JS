function lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>127.5) {

        return 'black';
    } 
    else {

        return 'white';
    }
}
document.documentElement.style.setProperty('--TaskbarColor', "white");
setTimeout(()=>{document.documentElement.style.setProperty('--TaskbarColor', lightOrDark(document.getElementById("ApplicationContainer").contentWindow.document.body.style.backgroundColor))},500);
function CreateWindow(Data) {
    var UID = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    if (Data.Name == undefined) {
      var URL = Data.URL + "?" + Data.Arguments;
    } else {
      var URL = "/System/Programs/" + Data.Name + "/App.html?" + Data.Arguments;
    }
    Software[UID] = {};
    document.getElementById("ApplicationContainer").src = URL;
    Software[UID].Controller = document.getElementById("ApplicationContainer").contentWindow;
    Software[UID].Controller.ContextWindow = document.getElementById("ApplicationContainer");
    Software[UID].Controller.Kernel = parent.Kernel;
    Software[UID].Controller.Shell = parent;
}
    
/*{
    "Name/URL" : ... ,    
    "Title" : ... ,
    "Icon" : ... ,
    "Arguments" : ...
}*/