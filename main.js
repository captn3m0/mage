var visualization=function(){
  var canvas=document.getElementById("canvas")
  canvas.width = canvas.width;//Reset the canvas
  var context=canvas.getContext('2d');
  if(this.visualization=='waveform')
  {
    context.beginPath();
    context.fillStyle = "#000";
    context.strokeStyle = "#000"
    context.lineWidth = 2;
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
  else
  {
    context.fillStyle = "#000";
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
}
document.getElementById('equalizer').onclick=function()
{
  var sound = soundManager.getSoundById('mySound');
  sound.visualization='equalizer';
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
      volume: 50,
      visualization:"waveform"
    });
  }
});
