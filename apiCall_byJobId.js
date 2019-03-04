var csrf = "ajax:2466362236496889676";
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var reg = (x,n) => x ? x[n] : '';
var jobArr = [];
async function getPostingById(id){
  var res = await fetch("https://www.linkedin.com/voyager/api/jobs/jobPostings/"+id, {"credentials":"include","headers":{"accept":"application/vnd.linkedin.normalized+json+2.1","accept-language":"en-US,en;q=0.9","csrf-token":csrf,"x-li-deco-include-micro-schema":"true","x-li-lang":"en_US","x-li-page-instance":"urn:li:page:d_flagship3_job_details;8+bX55W5TJqvu90HI366wQ==","x-li-track":"{\"clientVersion\":\"1.2.7702.0\",\"osName\":\"web\",\"timezoneOffset\":-5,\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\"}","x-restli-protocol-version":"2.0.0"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
  var jdat = await res.json();
//   var doc = new DOMParser().parseFromString(text, "text/html");
  var output = parseObj(jdat);
  jobArr.push(output)
}

function parseObj(obj){
  var coid = obj.data.companyDetails.company ? obj.data.companyDetails.company.replace(/\D+/g, '') : '0'; //string
  var desc = obj.data.description.text; //string
  var orglisted = obj.data.originalListedAt; //number milsec
  var lastlisted = obj.data.listedAt; //number milsec
  var expMonths = obj.data.candidateMonthsOfExperience; //number
  var expiry = obj.data.expireAt; //number milsec
  var ind = obj.data.formattedIndustries; //array
  var func = obj.data.formattedJobFunctions; //array
  var postlink = obj.data.jobPostingUrl.replace(/\?.+/, ''); //string
  var geofacet = obj.data.jobRegion; //string
  var geo = obj.data.formattedLocation; //string
  var poster = reg(/(?<=profile:).+/.exec(obj.data.poster),0); //string
  var skills = obj.data.skillMatches ? obj.data.skillMatches.map(itm=> itm.value) : []; //array 
  var title = obj.data.title; //string
  var type = obj.data.formattedEmploymentStatus; //string
  var level = obj.data.formattedExperienceLevel; //string
  var views = obj.data.views; //number
  var applies = obj.data.applies; //number
  var timestamp = new Date().getTime(); //number
  var remote = obj.data.workRemoteAllowed ? 'yes' : 'no';
  var salary = obj.data.salaryInsights;
  
  var jdat = {
	"coid":coid,
	"title":title,
	"desc":desc,
        "orglisted":orglisted,
	"lastlisted":lastlisted,
        "expMonths": expMonths,
	"expiry":expiry,
	"ind":ind,
	"func":func,
	"postlink":postlink,
	"geofacet":geofacet,
	"geo":geo,
	"poster":poster,
	"skills":skills,
	"type":type,
	"level":level,
	"views":views,
        "applies": applies,
        "remote": remote,
        "salary":salary,
	"timestamp":timestamp,
	};
return jdat;
}

async function looper(){
  for(var i=0; i<idArr.length; i++){
	getPostingById(idArr[i]);
	console.log(i);
	await delay(Math.round(Math.random()*100)+1601);
  }
}
looper()
