function randColor(){
  var r=Math.floor(Math.random()*255);
  var g=Math.floor(Math.random()*255);
  var b=Math.floor(Math.random()*255);
  var color="rgb("+r+","+g+","+b+")";
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
  if(this.visualization=='particles'){
    document.getElementsByTagName('html')[0].style.backgroundColor = '#FFF';
    dc = context;
    width = canvas.width;
    height = canvas.height;
    frame_number = 100;
    dc.clearRect(0,0,width,height);
    var nbr_circles = 333;
    var deviation = 5/8.0;
    
    var phi = (Math.sqrt(5)+1)/2 - 1;            // golden ratio
    var golden_angle = phi*2*Math.PI;            // golden angle
    
    //var lg_rad = width * .25;
    function maxarray(_arr){
      var max=0, _kk=0;
      while(_kk<_arr.length){
        if(_arr[_kk] > max){
          max = _arr[_kk];
        }
        _kk++;
      }
      return max;
    }
    var lg_rad = maxarray(this.eqData)*.3*width;
    var lg_area = Math.pow(lg_rad,2)*Math.PI;
    
    var mean_area = lg_area / nbr_circles;
    
    var min_area = mean_area * (1-deviation);
    var max_area = mean_area * (1+deviation);
    
    var cum_area = 0;
    
    var fudge = .87; // Fudge factor, since our circles don't actually fill up space entirely.
    
    var cx = width/2;
    var cy = height/2;
    
    var hue_incr = frame_number * .0002 + .1;
    var angle_offset = frame_number * .01;
    
    for (var i = 1; i <= nbr_circles; ++i) {
      dc.beginPath();
    
      var angle = i*golden_angle + angle_offset;
    
      var ratio = i / nbr_circles;
      var sm_area = min_area + ratio * (max_area - min_area);
      var sm_rad = Math.sqrt( sm_area / Math.PI );
    
      cum_area += sm_area;
    
      var spiral_rad = Math.sqrt( cum_area / Math.PI );
      var x = cx + Math.cos(angle) * spiral_rad;
      var y = cy + Math.sin(angle) * spiral_rad;
    
      var hue = 30 + this.eqData[i]*hue_incr*i*parseInt(Math.random()*360);
      hue -= Math.floor(hue);
      hue *= 360;

      // Uncomment the following for more color variation.
      // hue = maxarray(this.eqData)*i*360;
    
      dc.fillStyle = 'hsla(' + hue + ',80%,50%,'+ this.eqData[parseInt(Math.random()*this.eqData.length)]+')';
      //console.log(dc.fillStyle);
    
      dc.arc(x, y, sm_rad * fudge, 0, 2*Math.PI, false);
      dc.fill();
    }
  }
  else
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
}
document.getElementById('waveform').onclick=function()
{
  var sound = soundManager.getSoundById('mySound');
  sound.visualization='waveform';
  document.getElementsByTagName('html')[0].style.backgroundColor = '#000';
}
document.getElementById('equalizer').onclick=function()
{
  var sound = soundManager.getSoundById('mySound');
  sound.visualization='equalizer';
  document.getElementsByTagName('html')[0].style.backgroundColor = '#000';
}
document.getElementById('particles').onclick = function(){
  var sound = soundManager.getSoundById('mySound');
  sound.visualization='particles';
  document.getElementsByTagName('html')[0].style.backgroundColor = '#FFF';
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
      usePeakData: false,     // enable left/right channel peak (level) data
      useWaveformData: true, // enable sound spectrum (raw waveform data) - WARNING: May set CPUs on fire.
      useEQData: true,       // enable sound EQ (frequency spectrum data) - WARNING: Also CPU-intensive.
      onload: function() {
        console.log('The sound '+this.id+' loaded!');
      },
      whileplaying: visualization,
      volume: 50
    });
    sound.visualization='particles';
  }
});