async function initJobScraper(){
async function getCsrfId(){
  var res = await fetch("https://www.linkedin.com/cap/dashboard/home");
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.getElementById("jet-csrfToken").getAttribute("content");
}

var idArr = [];
var jobArr = [];
var csvArr = [['companyid','jobPostingUrl','jobLocation','orginalListDate','lastUpdateDate','expirationDate','industry','jobFunction','jobPosterUrl','monthsExpReq','skills','title','numberOfApplies','remote','description']];
var csrf = await getCsrfId();
var popid = "popup_jobs";


var delay = (ms) => new Promise(res => setTimeout(res, ms));
var reg = (x,n) => x ? x[n] : '';
var rando = (n) => Math.round(Math.random()*n);
var timer = new Date().getTime().toString().replace(/\d{4}$/, '0000');

var cn = (ob, nm) => ob ? ob.getElementsByClassName(nm) : console.log(ob);
var tn = (ob, nm) => ob ? ob.getElementsByTagName(nm) : console.log(ob);
var gi = (ob, nm) => ob ? ob.getElementById(nm) : console.log(ob);
// var noHTML = (str) => str.replace(/<.+?>/g, '').replace(/\s+/g, ' ').replace(/&.+?;/g, '');
var cleanName = (s) => s.replace(/(?<=^.+?)\s+-\s+.+|(?<=^.+?)\s*[sSJj][Rr].+|(?<=^.+?)\s*(III|IV|II).*|(?<=^.+?)\b,.*|(?<=^.+?)\s*\(.*/, '');
var fixCase = (s) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

/* alert(document.getElementById("jet-csrfToken").getAttribute("content")) */
var numRes = parseInt(document.getElementsByClassName('jobs-search-two-pane__wrapper jobs-search-two-pane__wrapper--two-pane')[0].getElementsByClassName('t-12 t-black--light t-normal')[0].innerText.replace(/\D+/g, ''));
var num = numRes > 999 ? 1000 : numRes;
console.log(num);

var csvReady = (s) => s.replace(/\r|\n/g, ' __ ').replace(/(?<=\d),(?=\d)/g, '').replace(/,/g, ';').replace(/â€™/g, "'").replace(/(?!\w)(?!\s)(?!\+)(?!\!)(?!@)(?!;)(?!\.)(?!\?)(?!\/)(?!\\)(?!")(?!')(?!\|)(?!\{)(?!\})(?!\[)(?!\])(?!\=)(?!-)(?!\()(?!\))(?!\*)(?!\&)(?!\^)(?!%)(?!#)(?!~)(?!\$)./g, '');

var tsvTo2dArr = (tsv) => tsv.split(/\r|\n/)
.map(itm=> itm.split(/(?<=^|\t)/));

var jsonKeys = (str) => tsvTo2dArr(str)[0].map(col=>col.toLowerCase().trim().replace(/\W+/g, '_'));
//   <path d="M0,1 10,1 M9,1 9,10 M0,9 10,9 M1,9 1,1" />
function d2arrToJSON(str){
  var temp = [];
  var keys = jsonKeys(str);
  var d2arr = tsvTo2dArr(str);
  d2arr.shift();
  d2arr.forEach(row=>{
  var tempObj = '{';
    for(var i=0; i<keys.length; i++){
	  var val = row[i] ? row[i].replace(/"/g, '\"') : '';
      tempObj = tempObj + '"' + keys[i] + '":"' + val.trim() + '",';
    }
    temp.push(JSON.parse(tempObj.replace(/,$/, '')+'}'));
  });
 return temp;
}

function dragElement() {
  this.style.border = "1px solid #5E9ED6";
  this.style.background = "#111111";
  this.style.transition = "all 166ms";
  var elmnt = this.parentElement;
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(this.id)) {
    document.getElementById(this.id).onmousedown = dragMouseDown;
  } else {
    this.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.opacity = "0.85";
    elmnt.style.transition = "opacity 1000ms";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.style.opacity = "1";
  }
}


function createPopTextArea(id){
if(document.getElementById(id)) document.getElementById(id).outerHTML = "";

var cd = document.createElement("div");
cd.setAttribute("id", id);
cd.style.display = "inline-block";
cd.style.position = "fixed";
cd.style.top = "10%";
cd.style.left = "50%";
cd.style.width = "22%";
cd.style.height = "16%";
cd.style.background = "transparent";
cd.style.borderRadius = ".15em";
cd.style.padding = "2px";
cd.style.zIndex = "10000";
document.body.appendChild(cd);

var cb = document.createElement("button");
cb.setAttribute("id", id+"_close");
cb.style.float = "left";
cb.style.background = "#000";
cb.style.height = "20px";
cb.style.width = "20px";
cb.style.borderRadius = "50%";
cb.style.boxShadow = "0px";
cb.style.border = "3px solid Crimson";
cb.style.textAlign = "center";
cb.style.cursor = "pointer";
cb.style.userSelect = "none";
cb.style.fontSize = "1em";
cb.style.color = "Crimson";
cb.style.transform = "scale(1, 1) translate(3.5px, 3.5px) rotate(0deg)"; 
cb.style.background = "transparent"
cb.addEventListener("click", killParent);
cb.addEventListener("mousedown", hoverO);
cb.addEventListener("mouseover", hoverI);
cb.addEventListener("mouseout", hoverO);
cd.appendChild(cb);

var hd = document.createElement("div");
hd.setAttribute("id", id+"_mover");
hd.style.width = "99%";
hd.style.height = "25%";
hd.style.backgroundColor = "#000000";
hd.style.borderTopLeftRadius = ".15em";
hd.style.borderTopRightRadius = ".15em";
hd.style.padding = "6px";
hd.style.cursor = 'move';
hd.style.boxShadow = "1px 1px 1px 0px #888888";
hd.addEventListener("mouseover", dragElement);
hd.addEventListener("mouseout", nodrag);
cd.appendChild(hd);


var tf = document.createElement("input");
tf.setAttribute("id", id+"_textfile");
tf.setAttribute("placeholder", "filename")
tf.style.width = "36%";
tf.style.height = "100%";
tf.style.padding = "3px";
tf.style.border = "1px solid #000000";
tf.style.background = "#0f0f0f";
tf.style.color = "#ffffff";
tf.style.fontSize = "1em";
tf.style.userSelect = "none";
tf.style.float = "right";
tf.style.boxShadow = "1px 1px 1px 0px #888888";
tf.addEventListener("keydown", (event) => { if (event.key == "Enter") dlBox(); });
hd.appendChild(tf);

var tb = document.createElement("div");
tb.setAttribute("id", id+"_textarea");
tb.innerText = "Grabbing Job Ids...";
tb.style.width = "99%";
tb.style.height = "75%";
tb.style.padding = "3px";
tb.style.border = "1px solid #000000";
tb.style.color = "#878787";
tb.style.fontSize = "1em";
tb.style.userSelect = "none";
tb.style.boxShadow = "1px 1px 1px 0px #888888";
cd.appendChild(tb);
tb.style.backgroundColor = "#282828";

}

async function killParent() {
  this.style.background = "Crimson";
  this.style.transform = "scale(.001, .001) translate(3px, 3px)  rotate(495deg)"; 
  this.style.transition = "all 106ms cubic-bezier(.9,.37,.66,.96)";
  await delay(206);
  this.parentElement.outerHTML = "";
}
async function killElm(){
  this.outerHTML = "";
}
async function hoverI(){
  this.style.border = "2px solid Crimson";
  await delay(40);
  this.style.border = "1px solid Crimson";
  await delay(30);
  this.style.border = "1px solid #000";
  await delay(20);
  this.style.background = "Crimson";
  this.style.color = "#000";
  this.style.transition = "all 186ms cubic-bezier(.9,.37,.66,.96)";
}
async function hoverO(){
  this.style.background = "#000";
  this.style.border = "1px solid Crimson";
  await delay(66);
  this.style.border = "3px solid Crimson";
  this.style.color = "Crimson";
  this.style.transition = "all 186ms cubic-bezier(.9,.37,.66,.96)";
}
function nodrag(){
  this.style.border = "0px solid #5E9ED6";
  this.style.background = "#000000";
  this.style.transition = "all 166ms";
}

function dlBox(){
  var csvTable = (arr) => arr.map(itm=>{	return itm.toString().replace(/$/, '\r'); }).toString().replace(/\r,/g, '\r');
  var filename = gi(document,popid+"_textfile").value;
  if(/\.json$/.test(filename))  downloadr(jobArr,filename);
  if(/\.csv$/.test(filename))  downloadr(csvTable(csvArr),filename);
  if(/^.{0}$/.test(filename))  downloadr(csvTable(csvArr),'defaultName.csv');
}

async function downloadr(str, name) {
  var type = "data:text/plain;charset=utf-8,";
  var strDL = str;
  if(/\.json$/.test(name)){
   var type = "data:application/json;charset=utf-8,";
   var strDL = JSON.stringify(str);
  }

  var file = new Blob([strDL], { type: type });
  var a = document.createElement("a"),
      url = URL.createObjectURL(file);
  a.href = url;
  a.download = /\..{2,4}$/.test(name) ? name : name+"_def.txt";
  document.body.appendChild(a);
  a.click();
  await delay(10);
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}


async function searchJobs(p){
  var url = window.location.href.replace(/&start=\d+/,'');
  var res= await fetch(url+'&start='+p, {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-language":"en-US,en;q=0.9","cache-control":"max-age=0","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});

  var text = await res.text();
  var matches = text.match(/(?<=fs_normalized_jobPosting:)\d+/g);
  for(var m=0; m<matches.length; m++){
  	if(idArr.some(itm=> itm == matches[m]) === false) idArr.push(matches[m]);
  }
}

async function loopthrough(){
  for(var i=0; i<num; i=i+25){
	searchJobs(i);
    console.log(i);
	await delay(rando(100)+3601);
    var idsPercCompl = Math.round((idArr.length/num) *100);
    gi(document, popid+"_textarea").innerText = 'Mapping Job Ids... ' +idsPercCompl+ '% completed.\nThis part will take about '+(Math.round((num/25)*3.7)+10)+' seconds.\nThen we will dive into those jobs.';
    if(idArr.length >= (num - 3)) {
      gi(document, popid+"_textarea").innerText = 'Initializing Scraper...';
	  await delay(10000);
	  looper();
    }
  }
}

async function looper(){
  for(var i=0; i<idArr.length; i++){
	getPostingById(idArr[i]);
	console.log(i);
    var jobsPercCompl = Math.round((jobArr.length/num) *10000)/100;
    gi(document, popid+"_textarea").innerText = 'Scraping Jobs... ' +jobsPercCompl+ '% completed.';
    if(i == idArr.length -1) gi(document, popid+"_textarea").innerText = '100% completed. Download by naming your file.\nAnd press Enter.';
	await delay(rando(100)+1601);
  }
}

async function getPostingById(id){
  var timeOffset = -(new Date().getTimezoneOffset() / 60);
  var res = await fetch("https://www.linkedin.com/voyager/api/jobs/jobPostings/"+id, {"credentials":"include","headers":{"accept":"application/vnd.linkedin.normalized+json+2.1","accept-language":"en-US,en;q=0.9","csrf-token":csrf,"x-li-deco-include-micro-schema":"true","x-li-lang":"en_US","x-li-page-instance":"urn:li:page:d_flagship3_job_details;8+bX55W5TJqvu90HI366wQ==","x-li-track":"{\"clientVersion\":\"1.2.7702.0\",\"osName\":\"web\",\"timezoneOffset\":"+timeOffset+",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\"}","x-restli-protocol-version":"2.0.0"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
  var jdat = await res.json();
  var output = parseObj(jdat);
  var j = output[0];
  var c = output[1]
  if(jobArr.some(job=> job.jobPostingUrl == j.jobPostingUrl) === false) {
   jobArr.push(j);
   csvArr.push(c);
  }
}

function parseObj(obj){
  var companyid = obj.data.companyDetails.company ? obj.data.companyDetails.company.replace(/\D+/g, '') : '0'; //string
  var description = obj.data.description.text; //string
  var orginalListDate = obj.data.originalListedAt; //number milsec
  var lastUpdateDate = obj.data.listedAt; //number milsec
  var monthsExpReq = obj.data.candidateMonthsOfExperience ? obj.data.candidateMonthsOfExperience : '0'; //number
  var expirationDate = obj.data.expireAt; //number milsec
  var industry = obj.data.formattedIndustries; //array
  var jobFunction = obj.data.formattedJobFunctions; //array
  var jobPostingUrl = obj.data.jobPostingUrl.replace(/\?.+/, ''); //string
  var geofacet = obj.data.jobRegion; //string
  var formattedLocation = obj.data.formattedLocation; //string
  var jobPoster = reg(/(?<=profile:).+/.exec(obj.data.poster),0); //string
  var skills = obj.data.skillMatches ? obj.data.skillMatches.map(itm=> itm.value) : []; //array 
  var title = obj.data.title; //string
  var jobType = obj.data.formattedEmploymentStatus; //string
  var jobLevel = obj.data.formattedExperienceLevel; //string
  var views = obj.data.views; //number
  var applies = obj.data.applies; //number
  var scrapeTimestamp = new Date().getTime(); //number
  var remote = obj.data.workRemoteAllowed ? 'yes' : 'no';
  var jobPosterProf = jobPoster ? 'www.linkedin.com/in/'+jobPoster : '';

  var csvdat = [
	companyid,
	jobPostingUrl,
	csvReady(formattedLocation), 
	new Date(orginalListDate), 
	new Date(lastUpdateDate), 
	new Date(expirationDate), 
	csvReady(industry.toString()), 
	csvReady(jobFunction.toString()),
	jobPosterProf,
	monthsExpReq,
	csvReady(skills.toString()),
	csvReady(title),
	applies,
	remote,
	csvReady(description)
]
  var jdat = {
	"companyid":companyid,
	"title":title,
	"description":description,
    "orginalListDate":orginalListDate,
	"lastUpdateDate":lastUpdateDate,
    "monthsExpReq": monthsExpReq,
	"expirationDate":expirationDate,
	"industry":industry,
	"jobFunction":jobFunction,
	"jobPostingUrl":jobPostingUrl,
	"geofacet":geofacet,
	"formattedLocation":formattedLocation,
	"jobPoster":jobPoster,
	"skills":skills,
	"jobType":jobType,
	"jobLevel":jobLevel,
	"views":views,
    "applies": applies,
    "remote": remote,
	"scrapeTimestamp":scrapeTimestamp,
	};
  return [jdat, csvdat];
}
createPopTextArea(popid);
loopthrough();
}
initJobScraper()
