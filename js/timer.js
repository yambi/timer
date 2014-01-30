var remain = 0;
var total = 0;
var shitugi = 0;
var happyo = 0;
var ptime = Date.parse(new Date());
var tid=setInterval(count,100);
var p = true;
var prev_bell = true;
var happyo_bell = true;
var shitugi_bell = true;


$(function(){
    reset();
});


function reset(){
    happyo = $("#min").val()*60000+$("#sec").val()*1000;
    remain = happyo;

    shitugi = $("#smin").val()*60000+$("#ssec").val()*1000;

    total = 0;
    ptime = Date.parse(new Date());
    p=true;
    prev_bell = true;
    happyo_bell = true;
    shitugi_bell = true;
    $("#bpause").val("start");
    show();
}

function kp(event){
   console.log(pressedChar(event));
   if(event.keyCode==13)reset();

   var char = pressedChar(event);
   if (char && !char.match(/\d/)) {
      return false;
   } else {
      return true;
   }
}

function pause(){
    if(p){
        p=false;
        $("#bpause").val("pause");
    }else{
        p=true;
        $("#bpause").val("start");
    }
    console.log("pause:"+p);
}
function count(){
   if(p){
       ptime = Date.parse(new Date())
       return;
   }
   var ctime = Date.parse(new Date())
   remain -= (ctime-ptime);
   total  += (ctime-ptime);
   ptime=ctime;

   if(remain<=120000 && prev_bell){
     bell_play();
     prev_bell=false;
   }
   if(remain<=0 && happyo_bell){
     bell_play();
     setTimeout("bell_play()",600);
     happyo_bell=false;
   }
   if(shitugi+remain<=0 && shitugi_bell){
     if($("#cshitugi").is(':checked')){
       bell_play();
       setTimeout("bell_play()",600);
       setTimeout("bell_play()",1200);
     }
     shitugi_bell=false;
   }

   show();
}

function bell_play(){
  var audio = new Audio(bell);
  if(!$("#cmute").is(':checked'))audio.play();
}

function show(){
    var hmin = Math.floor(happyo/60/1000);
    var hsec = happyo/1000-hmin*60;
    var smin = Math.floor(shitugi/60/1000);
    var ssec = shitugi/1000-smin*60;
    if($("#cshitugi").is(':checked')){
        $("#rannounce").html("発表："+hmin+"分"+n2s(hsec)+"秒<br />質疑："+smin+"分"+n2s(ssec)+"秒");
    }else{
        $("#rannounce").text("発表："+hmin+"分"+n2s(hsec)+"秒");
    }
   if(remain>0){
       var tmin = Math.floor(total/60/1000);
       var tsec = total/1000-tmin*60;
       var rmin = Math.floor(remain/60/1000);
       var rsec = remain/1000-rmin*60;
       $("#total").text("発表開始から： "+ind(tmin,rmin)+"分"+n2s(tsec)+"秒");
       $("#count").text("発表終了まで： "+ind(rmin,tmin)+"分"+n2s(rsec)+"秒");
       $("#pg").val(1.0*total/happyo);
       document.body.style.backgroundColor = '#000000';
   }
   else if($("#cshitugi").is(':checked')&& shitugi+remain>0){
       var tmin = Math.floor(total/60/1000);
       var tsec = total/1000-tmin*60;
       var rmin = Math.floor((shitugi+remain)/60/1000);
       var rsec = (shitugi+remain)/1000-rmin*60;
       $("#total").text("発表開始から： "+ind(tmin,rmin)+"分"+n2s(tsec)+"秒");
       $("#count").text("質疑終了まで： "+ind(rmin,tmin)+"分"+n2s(rsec)+"秒");
       $("#pg").val(-1.0*remain/shitugi);
       document.body.style.backgroundColor = '#777700';
   }
   else if($("#cshitugi").is(':checked')){
       var tmin = Math.floor(total/60/1000);
       var tsec = total/1000-tmin*60;
       var rmin = Math.floor(-(shitugi+remain)/60/1000);
       var rsec = -(shitugi+remain)/1000-rmin*60;
       $("#total").text("発表開始から： "+ind(tmin,rmin)+"分"+n2s(tsec)+"秒");
       $("#count").text("質疑終了から： "+ind(rmin,tmin)+"分"+n2s(rsec)+"秒");
       $("#pg").val(-1.0*remain/shitugi);
       document.body.style.backgroundColor = '#660000';
   }
   else{
       var tmin = Math.floor(total/60/1000);
       var tsec = total/1000-tmin*60;
       var rmin = Math.floor(-remain/60/1000);
       var rsec = -remain/1000-rmin*60;
       $("#total").text("発表開始から： "+ind(tmin,rmin)+"分"+n2s(tsec)+"秒");
       $("#count").text("発表終了から： "+ind(rmin,tmin)+"分"+n2s(rsec)+"秒");
       $("#pg").val(1);
       //if(rmin==0&&rsec==0)document.body.style.backgroundColor = '#FFFF00';
       document.body.style.backgroundColor = '#660000';
   }
}
function n2s(n){
    return (n<10)?"0"+n:""+n;
}
function ind(a,b){
    a=""+a;
    b=""+b;
    if(a.length>=b.length)return a;
    else return ind("0"+a,b);
}

// http://tockri.blog78.fc2.com/blog-entry-119.html
function pressedChar(event) {
  var code = 0;
  if (event.charCode === 0) {// Firefox, Safari control code
    code = 0;
  } else if (!event.keyCode && event.charCode) {// Firefox
    code = event.charCode;
  } else if (event.keyCode && !event.charCode) {// IE
    code = event.keyCode;
  } else if (event.keyCode == event.charCode) {// Safari
    code = event.keyCode;
  }
  if (32 <= code && code <= 126) {// ASCII文字の範囲内
    return String.fromCharCode(code);
  } else {
    return null;
  }
}
