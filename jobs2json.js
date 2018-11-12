function vld(elm, n){if(elm != null){return elm[n]}else{return '';}}
function checkThenDo(x,elm,n){	if(elm != undefined){		return vld(x.exec(elm.innerText),n);	}else{		return '';	}}
function checkHref(elm, n){if(elm[0] != undefined){return elm[n].href}else{return '';}}
function getAddress(elm){if(elm != undefined){return elm.getElementsByClassName('a11y-text')[0].innerText.replace(/^To\s+/, '').trim();}else{return '';}}


var jobObj = [];

function cutDate(str){return vld(/(?<=\w{3}\s)\w{3}\s\d+\s\d+/.exec(str),0);}

function getPostingDate(elm){
	if(elm.getElementsByTagName('span')[0] != undefined){
		let num = parseInt(vld(/(?<=Posted )\d+.{0,3}(?=\s+)/.exec(elm.getElementsByTagName('span')[0].innerText),0).replace(/D+/g, ''));
		let mes = vld(/(?<=Posted )\d+.{0,3}(\sday|\sweek|\smonth|\shour|\sminute)/.exec(elm.getElementsByTagName('span')[0].innerText),1);
		let now = new Date().getTime();
		if(/month/.test(mes) === true){return cutDate(new Date(now - (num * 2629800000)));}
		if(/week/.test(mes) === true){return cutDate(new Date(now - (num * 604800000)));}
		if(/day/.test(mes) === true){return cutDate(new Date(now - (num * 3600000)));}
		if(/hour/.test(mes) === true){return cutDate(new Date(now - (num * 3600000)));}
		if(/minute/.test(mes) === true){return cutDate(new Date(now - (num * 60000)));}
	}
}

function getListArr(r){	var arr = [];	for(i=0; i<r.length; i++){		arr.push(r[i].innerText);	}	return arr;}

function getJobDeetz(obj){	
	var level = obj.getElementsByClassName('js-formatted-exp-body')[0].innerText;
	var jobtype = obj.getElementsByClassName('js-formatted-employment-status-body')[0].innerText;
	var fnList = obj.getElementsByClassName('js-formatted-job-functions-list')[0].getElementsByTagName('li');
	var indList = obj.getElementsByClassName('js-formatted-industries-list')[0].getElementsByTagName('li');
	var jobfn = getListArr(fnList);	
	var ind = getListArr(indList);
return new Array({'level': level, 'industry': ind, 'jobtype': jobtype, 'function': jobfn});
}

function getJobPosting(){
	var jobheader = document.getElementsByClassName('jobs-details-top-card__content-container')[0];
	var company_local = jobheader.getElementsByTagName('h3')[0];
	var jobTitle = jobheader.getElementsByTagName('h1')[0].innerText;
	var companyId = vld(/(?<=company\/)\d+/.exec(checkHref(company_local.getElementsByTagName('a'),0)),0);	
	
	var companyName = vld(/(?<=Company Name\n).+/.exec(company_local.innerText),0).trim();
	var geo = vld(/(?<=Company Location\n).+/.exec(company_local.innerText),0).trim();

	var posted = document.getElementsByClassName('jobs-details-top-card__job-info')[0];
	var views = vld(/.{0,10}\d+(?=\s+view)/.exec(posted.getElementsByTagName('span')[2].innerText),0).trim();
	var postDate = getPostingDate(posted);
console.log(postDate)
	var jobInfoSummary = document.getElementsByClassName('jobs-box--full-width jobs-details-job-summary')[0];
	var applicants = vld(/.{0,10}\d+(?=\s+applicant)/.exec(jobInfoSummary.getElementsByTagName('ul')[0].innerText),0);
	var employees = checkThenDo(/.+?\d+(?=\s+employee)/,jobInfoSummary.getElementsByTagName('ul')[1],0);
	
	var jobDeetz = getJobDeetz(document.getElementsByClassName('jobs-description-details')[0]);
	var description = document.getElementsByClassName('jobs-box__html-content')[0].innerText;

	var address = getAddress(document.getElementsByClassName('jobs-commute-module__container')[0]);

jobObj.push({'jobtitle': jobTitle, 'companyname': companyName, 'companyid': companyId, 'address': address, 'geo': geo, 'postDate': postDate, 'views': views, 'applicants': applicants, 'employees': employees, 'jobDetails': jobDeetz, 'description': description});

console.log(JSON.stringify(jobObj)); 
	
 }


getJobPosting()
