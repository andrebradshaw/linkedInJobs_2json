//issue with first page duplicating. Not sure why, but linkedin is processing the next iteration as 24 instead of 25. it is an issue with Linkedin

function checker(elm, type) {
  if (elm != undefined) {
    if (type == 'href') {
      return elm.href;
    }
    if (type == 'text') {
      return elm.innerText.trim();
    }
    if (type == 'next') {
      return elm;
    }
  } else {
    return '';
  }
}

function vld(elm, n){if(elm != null){return elm[n];}else{return '';}}
function checkThenDo(x,elm,n){	if(elm != undefined){		return vld(x.exec(elm.innerText),n);	}else{		return '';	}}
function checkHref(elm, n){if(elm[0] != undefined){return elm[n].href}else{return '';}}
function getAddress(elm){if(elm != undefined){return elm.getElementsByClassName('a11y-text')[0].innerText.replace(/^To\s+/, '').trim();}else{return '';}}

var jobObj = [];

function cutDate(str) {
  return vld(/(?<=\w{3}\s)\w{3}\s\d+\s\d+/.exec(str), 0);
}

function getPostingDate(elm) {
  if (elm.getElementsByTagName('span')[0] != undefined) {
    let num = parseInt(vld(/(?<=Posted )\d+.{0,3}(?=\s+)/.exec(checker(elm.getElementsByTagName('span')[0], 'text')), 0).replace(/D+/g, ''));
    let mes = vld(/(?<=Posted )\d+.{0,3}(\sday|\sweek|\smonth|\shour|\sminute)/.exec(checker(elm.getElementsByTagName('span')[0], 'text')), 1);
    let now = new Date().getTime();
    if (/month/.test(mes) === true) {
      return cutDate(new Date(now - (num * 2629800000)));
    }
    if (/week/.test(mes) === true) {
      return cutDate(new Date(now - (num * 604800000)));
    }
    if (/day/.test(mes) === true) {
      return cutDate(new Date(now - (num * 3600000)));
    }
    if (/hour/.test(mes) === true) {
      return cutDate(new Date(now - (num * 3600000)));
    }
    if (/minute/.test(mes) === true) {
      return cutDate(new Date(now - (num * 60000)));
    }
  }
}

function getListArr(r) {
  var arr = [];
  for (i = 0; i < r.length; i++) {
    arr.push(checker(r[i], 'text'));
  }
  return arr;
}

function getJobDeetz(obj) {
  var level = checker(obj.getElementsByClassName('js-formatted-exp-body')[0], 'text');
  var jobtype = checker(obj.getElementsByClassName('js-formatted-employment-status-body')[0], 'text');
  var fnList = obj.getElementsByClassName('js-formatted-job-functions-list')[0].getElementsByTagName('li');
  var indList = obj.getElementsByClassName('js-formatted-industries-list')[0].getElementsByTagName('li');
  var jobfn = getListArr(fnList);
  var ind = getListArr(indList);
  return new Array({
    'level': level,
    'industry': ind,
    'jobtype': jobtype,
    'function': jobfn
  });
}

function getJobPosting() {
  var jobheader = document.getElementsByClassName('jobs-details-top-card__content-container')[0];
  var company_local = jobheader.getElementsByTagName('h3')[0];
  var jobTitle = checker(jobheader.getElementsByTagName('h1')[0], 'text');
  var companyId = vld(/(?<=company\/)\d+/.exec(checkHref(company_local.getElementsByTagName('a'), 0)), 0);


  var geo = vld(/(?<=Company Location\n).+/.exec(company_local.innerText), 0).trim();
  var posted = document.getElementsByClassName('jobs-details-top-card__job-info')[0];
  var views = vld(/.{0,10}\d+(?=\s+view)/.exec(posted.getElementsByTagName('span')[2].innerText), 0).trim().replace(/\D+/g, '');
  var postDate = getPostingDate(posted);
  var jobInfoSummary = document.getElementsByClassName('jobs-box--full-width jobs-details-job-summary')[0];

  var applicants = vld(/.{0,10}\d+(?=\s+applicant)/.exec(checker(jobInfoSummary.getElementsByTagName('ul')[0], 'text')), 0);
  var employees = checkThenDo(/.+?\d+(?=\s+employee)/, jobInfoSummary.getElementsByTagName('ul')[1], 0);
  var jobDeetz = getJobDeetz(document.getElementsByClassName('jobs-description-details')[0]);
  var description = checker(document.getElementsByClassName('jobs-box__html-content')[0], 'text');

var companyName = vld(/(?<=Company Name\s+).+?(?=\s+Company Location)/m.exec(checker(document.getElementsByClassName('jobs-details-top-card__company-info')[0],'text')), 0).trim();

  var address = checker(document.getElementsByClassName('jobs-details-top-card__company-info')[0].getElementsByTagName('span')[2],'text');


  jobObj.push({
    'jobtitle': jobTitle,
    'companyname': companyName,
    'companyid': companyId,
    'address': address,
    'geo': geo,
    'postDate': postDate,
    'views': views,
    'applicants': applicants,
    'employees': employees,
    'jobDetails': jobDeetz,
    'description': description
  });
}


var numberOfPagesToLoop = Math.ceil(parseInt(checker(document.getElementsByClassName('jobs-search-two-pane__alerts')[0].getElementsByTagName('div')[1], 'text').replace(/\D+/g, '')) / 25) + 10;

function dododo(main) {
setTimeout(() => {
  function clickJobListItem() {
    setTimeout(() => {
      var jobList = document.getElementsByClassName(
        'jobs-search-results__list artdeco-list artdeco-list--offset-4')[0].getElementsByClassName('artdeco-list__item');

      function getJobPostingObj(obj, n) {
        setTimeout(() => {
          document.getElementById(obj.getAttribute('id')).scrollIntoView();

          obj.getElementsByClassName('job-card-search--clickable')[0].click();
		setTimeout(()=>{ getJobPosting(); },1200);
			
        }, ((n + 1) * 2100));
      }

      for (i = 0; i < jobList.length; i++) {
        getJobPostingObj(jobList[i], i);
      }

    }, 2500);
  }

  function clickNextPage() {
    setTimeout(() => {
      var pager = document.getElementsByClassName('page-list')[0].getElementsByTagName('li');
      for (p = 0; p < pager.length; p++) {
        if (pager[p].getAttribute('class') == 'active') {
          var pg = pager[(p + 1)];
          if (pg != undefined) {
            pg.getElementsByTagName('button')[0].click();
          } else {
            console.log('done');
          }
        }
      }
    }, (2800 * 25));
  }


  var first = new Promise(res => {
    res(clickJobListItem());
  });
  first.then(clickNextPage());
},((main)*(3000*25)));
}


for (u = 0; u < numberOfPagesToLoop; u++) {
  dododo(u);
}
