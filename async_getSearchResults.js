var idArr = [];
var delay = (ms) => new Promise(res => setTimeout(res, ms));

var numRes = parseInt(document.getElementsByClassName('jobs-search-two-pane__wrapper jobs-search-two-pane__wrapper--two-pane')[0].getElementsByClassName('t-12 t-black--light t-normal')[0].innerText.replace(/\D+/g, ''));
var num = numRes > 999 ? 1000 : numRes;

async function searchJobs(p){
  var url = window.location.href.replace(/&start=\d+/,'');
  var res= await fetch(url+'&start='+p, {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-language":"en-US,en;q=0.9","cache-control":"max-age=0","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});

  var text = await res.text();
  console.log(text);
  var matches = text.match(/(?<=fs_normalized_jobPosting:)\d+/g);
console.log(matches);
  for(var m=0; m<matches.length; m++){
  	if(idArr.some(itm=> itm == matches[m]) === false) idArr.push(matches[m]);
  }
}

async function loopthrough(){
  for(var i=0; i<num; i=i+25){
	searchJobs(i);
    console.log(i);
await delay(Math.round(Math.random()*100)+5601);
    if(i>999) console.log(idArr);
  }
}

loopthrough()
