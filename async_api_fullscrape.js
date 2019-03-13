var idArr = [];
var jobArr = [];
var csrf = "ajax:2773576118997798665";
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var reg = (x,n) => x ? x[n] : '';
var rando = (n) => Math.round(Math.random()*n);
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


async function buildUI(){


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
    if(idArr.length >= (num - 10)) {
		await delay(20000)
		looper();
    }
  }
}


async function getPostingById(id){
  var res = await fetch("https://www.linkedin.com/voyager/api/jobs/jobPostings/"+id, {"credentials":"include","headers":{"accept":"application/vnd.linkedin.normalized+json+2.1","accept-language":"en-US,en;q=0.9","csrf-token":csrf,"x-li-deco-include-micro-schema":"true","x-li-lang":"en_US","x-li-page-instance":"urn:li:page:d_flagship3_job_details;8+bX55W5TJqvu90HI366wQ==","x-li-track":"{\"clientVersion\":\"1.2.7702.0\",\"osName\":\"web\",\"timezoneOffset\":-5,\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\"}","x-restli-protocol-version":"2.0.0"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
  var jdat = await res.json();
  var output = parseObj(jdat);
  jobArr.push(output)
}

function parseObj(obj){
  var companyid = obj.data.companyDetails.company ? obj.data.companyDetails.company.replace(/\D+/g, '') : '0'; //string
  var description = obj.data.description.text; //string
  var orginalListDate = obj.data.originalListedAt; //number milsec
  var lastUpdateDate = obj.data.listedAt; //number milsec
  var monthsExpReq = obj.data.candidateMonthsOfExperience; //number
  var expiry = obj.data.expireAt; //number milsec
  var industry = obj.data.formattedIndustries; //array
  var jobFunction = obj.data.formattedJobFunctions; //array
  var jobPostingUrl = obj.data.jobPostingUrl.replace(/\?.+/, ''); //string
  var geofacet = obj.data.jobRegion; //string
  var formattedLocation = obj.data.formattedLocation; //string
  var poster = reg(/(?<=profile:).+/.exec(obj.data.poster),0); //string
  var skills = obj.data.skillMatches ? obj.data.skillMatches.map(itm=> itm.value) : []; //array 
  var title = obj.data.title; //string
  var jobType = obj.data.formattedEmploymentStatus; //string
  var jobLevel = obj.data.formattedExperienceLevel; //string
  var views = obj.data.views; //number
  var applies = obj.data.applies; //number
  var scrapeTimestamp = new Date().getTime(); //number
  var remote = obj.data.workRemoteAllowed ? 'yes' : 'no';
  var salary = obj.data.salaryInsights;
  
  var jdat = {
	"companyid":companyid,
	"title":title,
	"description":description,
    "orginalListDate":orginalListDate,
	"lastUpdateDate":lastUpdateDate,
    "monthsExpReq": monthsExpReq,
	"expiry":expiry,
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
    "salary":salary,
	"scrapeTimestamp":scrapeTimestamp,
	};
  return jdat;
}

async function looper(){
  for(var i=0; i<idArr.length; i++){
	getPostingById(idArr[i]);
	console.log(i);
	await delay(rando(100)+1601);
  }
}


loopthrough()
