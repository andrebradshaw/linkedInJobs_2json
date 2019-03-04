async function getPostingById(id){
  var res = await fetch("https://www.linkedin.com/voyager/api/jobs/jobPostings/"+id, {"credentials":"include","headers":{"accept":"application/vnd.linkedin.normalized+json+2.1","accept-language":"en-US,en;q=0.9","csrf-token":"ajax:2466362236496889676","x-li-deco-include-micro-schema":"true","x-li-lang":"en_US","x-li-page-instance":"urn:li:page:d_flagship3_job_details;8+bX55W5TJqvu90HI366wQ==","x-li-track":"{\"clientVersion\":\"1.2.7702.0\",\"osName\":\"web\",\"timezoneOffset\":-5,\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\"}","x-restli-protocol-version":"2.0.0"},"referrer":"https://www.linkedin.com/jobs/view/1115737817/?eBP=JOB_SEARCH_ORGANIC&refId=06cc08ab-4221-40b0-922f-2fbb256d057c&trk=d_flagship3_search_srp_jobs","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
  var jdat = await res.json();
//   var doc = new DOMParser().parseFromString(text, "text/html");
var output = parseObj(jdat);
console.log(output)
}

function parseObj(obj){
  var coid = obj.data.companyDetails.company.replace(/\D+/g, ''); //string
  var desc = obj.data.description.text; //string
  var listed = obj.data.listedAt; //number milsec
  var expiry = obj.data.expireAt; //number milsec
  var ind = obj.data.formattedIndustries; //array
  var func = obj.data.formattedJobFunctions; //array
  var postlink = obj.data.jobPostingUrl.replace(/\?.+/,''); //string
  var geofacet = obj.data.jobRegion; //string
  var geo = obj.data.formattedLocation; //string
  var poster = /(?<=profile:).+/.exec(obj.data.poster)[0]; //string
  var skills = obj.data.skillMatches ? obj.data.skillMatches.map(itm=> itm.value) : []; //array 
  var title = obj.data.title; //string
  var type = obj.data.formattedEmploymentStatus; //string
  var level = obj.data.formattedExperienceLevel; //string
  var views = obj.data.views; //number
  var timestamp = new Date().getTime();
  var jdat = {
	"coid":coid,
	"title":title,
	"desc":desc,
	"listed":listed,
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
	"timestamp":timestamp,
	};
  return jdat;
}

getPostingById(1115737817)
