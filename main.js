var canvas=document.getElementById("canvas");
canvas.height=window.screen.height;

function randColor(){
  var r=Math.floor(Math.random()*100);
  var g=Math.floor(Math.random()*100);
  var b=Math.floor(Math.random()*100);
  var a=(Math.random()*0.6);
  var color="rgba("+r+","+g+","+b+","+a+")";
  return color;
}
var visualization=function(){
  var canvas=document.getElementById("canvas")
  //canvas.width = canvas.width;//Reset the canvas
  //add a transperancy
  var context=canvas.getContext('2d');
  context.fillStyle = "rgba(0,0,0,"+document.getElementById('transperancy').value+")";
  context.fillRect(0,0,1024,600);
  if(this.visualization=='waveform')
  {
    context.beginPath();
    var color=randColor();
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = document.getElementById('width').value;
    context.lineJoin = "round";
    context.moveTo(0,300);
    for(i in this.waveformData.left)
    {
      value=this.waveformData.left[i];//can be -ve or +ve
      context.lineTo(i*4,300+300*value);
    }
    context.stroke();
    context.closePath();
  }
  else if(this.visualization=='equalizer')
  {
    context.fillStyle = randColor();
    var min=1000000,max=0;
    for(var i=0;i<this.eqData.left.length;i++)
    {
      var value=this.eqData.left[i];
      var height=value*400;
      var x=4*i;

      var width=4;
      context.fillRect(x,600-height,width,height);
    }
  }
  else if(this.visualization == "circle")
  {
    canvas.height=canvas.height;
    var x = 512;
    var y = canvas.height;
    var radius = (this.peakData.left + this.peakData.right)/2;  
    console.log(radius);
    var grd=context.createRadialGradient(x,y,5,x,y,100);
    var color = randColor();
    grd.addColorStop(0,color);
    grd.addColorStop(1,"white");
    context.fillStyle = grd;
    context.beginPath();
    context.arc(x,y,radius*300+10,0,Math.PI*2,true);
    context.closePath();
    context.fill();

  }
  else
  {
    canvas.height=canvas.height;
    //Create some arc visualizations
    var x = 512;
    var y = canvas.height+60;
    var radius = (this.peakData.left + this.peakData.right)/2;	
    var leftRadius = radius*300+50;
    var rightRadius = radius*300+50;
    var startAngle = 1 * Math.PI;
    var endAngle = 2 * Math.PI;
    var counterClockwise = false;
    var color=randColor();
    context.beginPath();
    context.arc(x, y, leftRadius, startAngle, 3/2*Math.PI, counterClockwise);
    context.lineWidth = 4;
    context.strokeStyle = color;
    context.stroke();
    context.beginPath();
    context.arc(x, y, rightRadius, 3/2*Math.PI,endAngle , counterClockwise);
    context.lineWidth = 4;//this.peakData.right*100;
    context.strokeStyle = color;
    context.stroke();
  }
}
document.getElementById('waveform').onclick=function()
{
  var sound = soundManager.getSoundById('mySound');
  sound.visualization='waveform';
}
document.getElementById('equalizer').onclick=function()
{
  var sound = soundManager.getSoundById('mySound');
  sound.visualization='equalizer';
}
document.getElementById('arc').onclick=function()
{
  var sound = soundManager.getSoundById('mySound');
  sound.visualization='arc';
}
document.getElementById('circle').onclick=function()
{
  var sound = soundManager.getSoundById('mySound');
  sound.visualization='circle';
}
soundManager.setup({
  url: './swf/',
  flashVersion: 9, // optional: shiny features (default = 8)
  onready: function() {
    // Ready to use; soundManager.createSound() etc. can now be called.
    var sound=soundManager.createSound({
      id: 'mySound',
      url: 'audio.mp3',
      autoLoad: true,
      autoPlay: true,
      usePeakData: true,     // enable left/right channel peak (level) data
      useWaveformData: true, // enable sound spectrum (raw waveform data) - WARNING: May set CPUs on fire.
      useEQData: true,       // enable sound EQ (frequency spectrum data) - WARNING: Also CPU-intensive.
      onload: function() {
        console.log('The sound '+this.id+' loaded!');
      },
      whileplaying: visualization,
      volume: 50
    });
    sound.visualization='arc';
  }
});
