var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var noHTML = (s) => s.replace(/<.+?>/g, '').replace(/\s+/g, ' ').replace(/&.+?;/g, '');
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var cleanName = (s) => s.replace(/(?<=^.+?)\s+-\s+.+|(?<=^.+?)\s*[sSJj][Rr].+|(?<=^.+?)\s*(III|IV|II).*|(?<=^.+?)\b,.*|(?<=^.+?)\s*\(.*/, '');
var fixCase = (s) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
var timer = new Date().getTime().toString().replace(/\d{4}$/, '0000');
var rando = (n) => Math.round(Math.random() * n);
var fixDate = (s) => s ? s.replace(/[a-zA-Z]+/, s.replace(/(?<=[a-zA-Z]{3}).+/g, '')) : '';

var csrf = reg(/ajax:\d+/.exec(document.cookie), 0);

async function searchJobs(params){
var res= await fetch("https://www.linkedin.com/voyager/api/search/hits?count=25&decorationId=com.linkedin.voyager.deco.jserp.WebJobSearchHit-12&distance=List()&f_BE=List()&f_C=List()&f_CF=List()&f_CR=List()&f_CT=List()&f_E=List()&f_ES=List()&f_ET=List()&f_F=List()&f_GC=List()&f_I=List()&f_JT=List()&f_L=List()&f_LF=List()&f_PP=List()&f_SB=List()&f_SB2=List()&f_SB3=List()&f_SET=List()&f_T=List()&f_TP=List()&f_TPR=List()&"+params+"&topNRequestedFlavors=List(HIDDEN_GEM,IN_NETWORK,SCHOOL_RECRUIT,COMPANY_RECRUIT,SALARY,JOB_SEEKER_QUALIFIED,PREFERRED_COMMUTE)", {"credentials":"include","headers":{"accept":"application/vnd.linkedin.normalized+json+2.1","accept-language":"en-US,en;q=0.9","csrf-token":csrf,"x-li-lang":"en_US","x-li-page-instance":"urn:li:page:d_flagship3_search_srp_jobs;+7s9SDjJSRWKGvwFl5tSJQ==","x-li-track":"{\"clientVersion\":\"1.3.794\",\"osName\":\"web\",\"timezoneOffset\":-4,\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\"}","x-restli-protocol-version":"2.0.0"},"referrer":"https://www.linkedin.com/jobs/search/?keywords=javascript%20AND%20google%20apps&location=United%20States&locationId=us%3A0","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
var d = await res.json();
console.log(d);
return d;
}

async function looper(){
  var containArr = [['Company Name','Company Id','Job Title','Job Id','Job Desc','Apply Url','Expiry Date','Listing Date','Listing Type','Source Domain','Job Location','Zip Code','lat','lng']];
  var query = reg(/(?<=jobs\/search\/\?).+/.exec(window.location.href),0) + '&origin=JOB_SEARCH_RESULTS_PAGE&q=jserpAll&query=search';
  var res = await searchJobs(query);
  var paging = res.data.paging;

  var elms = res.included.filter(el=> el.companyDetails);
  var conames = res.included.filter(el=> el.name).map(el=> [el.name,reg(/\d+$/.exec(el.entityUrn),0)]);  
  var jobs = res.data.elements.map(el=> [el.hitInfo.descriptionSnippet,reg(/\d+$/.exec(el.hitInfo.jobPosting),0)]);
  var out = elms.map(el=> parseJobPost(el,conames,jobs));
  out.forEach(arr=> containArr.push(arr));

  for(var i=25; i<paging.total; i=i+25){
    var rl = await searchJobs(query+'&start='+i);
    var elms2 = rl.included.filter(el=> el.companyDetails);
    var conames2 = rl.included.filter(el=> el.name).map(el=> [el.name,reg(/\d+$/.exec(el.entityUrn),0)]);  
    var jobs2 = rl.data.elements.map(el=> [el.hitInfo.descriptionSnippet,reg(/\d+$/.exec(el.hitInfo.jobPosting),0)]);
    var out2 = elms2.map(el=> parseJobPost(el,conames2,jobs2));
    out2.forEach(arr=> containArr.push(arr));
    await delay(rando(110)+1200);
    console.log(i);
  }
console.log(containArr);
}

looper()


function parseJobPost(obj,arr,jobarr){
  var jobid = reg(/(?<=fs_jobSavingInfo:)\d+/.exec(JSON.stringify(obj)),0);
  var desc = jobarr.filter(el=> el[1] == jobid);
  var coname = obj.companyDetails.companyName ? obj.companyDetails.companyName : '';
  var coid = obj.companyDetails.company ? reg(/\d+$/.exec(obj.companyDetails.company),0) : '';  
  var cname = arr.filter(el=> el[1] == coid);
  var name = cname.length > 0 ? cname[0][0] : coname
  var title = obj.title ? obj.title : '';
  var applyurl = obj.applyMethod ? obj.applyMethod.companyApplyUrl : '';
  var expiry = obj.expireAt ? new Date(obj.expireAt) : 0;
  var listedAt = obj.listedAt ? new Date(obj.listedAt) : 0;
  var listingType = obj.listingType ? obj.listingType : '';
  var sourceDomain = obj.sourceDomain ? obj.sourceDomain : '';
  var geo = obj.formattedLocation ? obj.formattedLocation : '';
  var addressData = obj.standardizedAddresses ? obj.standardizedAddresses.addresses[0] : null; 
  var zipcode = addressData ? addressData.postalAddress.postalCode : '';
  var latLong = addressData ? addressData.latLong : null;
  var lat = latLong ? latLong.latitude : '';
  var lng = latLong ? latLong.longitude : '';
  var out = [
    name,
    coid,
    title,
    jobid,
    desc ? desc[0][0] : '',
    applyurl ? applyurl : '',
    expiry,
    listedAt,
    listingType,
    sourceDomain,
    geo,
    zipcode,
    lat,
    lng
  ];
  return out;
}
