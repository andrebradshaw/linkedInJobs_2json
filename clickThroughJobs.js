function checker(elm, type) {  if (elm != undefined) {    if (type == 'href') {      return elm.href;    }    if (type == 'text') {      return elm.innerText.trim();    }    if (type == 'next') {      return elm;    }  } else {    return '';  }}

var numberOfPagesToLoop = Math.ceil(parseInt(checker(document.getElementsByClassName('jobs-search-two-pane__alerts')[0].getElementsByTagName('div')[1],'text').replace(/\D+/g, ''))/50)+10;

function clickJobListItem() {
  setTimeout(() => {
    var jobList = document.getElementsByClassName(
      'jobs-search-results__list artdeco-list artdeco-list--offset-4')[0].getElementsByClassName('artdeco-list__item');

    function getJobPostingObj(obj, n) {
      setTimeout(() => {
        document.getElementById(obj.getAttribute('id')).scrollIntoView();

        obj.getElementsByClassName('job-card-search--clickable')[0].click();
      }, ((n + 1) * 1800));
    }

    for (i = 0; i < jobList.length; i++) {
      getJobPostingObj(jobList[i], i);
    }

  }, 2100);
}

function clickNextPage() {
setTimeout(()=>{
  var pager = document.getElementsByClassName('page-list')[0].getElementsByTagName('li');
  for (p = 0; p < pager.length; p++) {
    if (pager[p].getAttribute('class') == 'active') {
      var pg = pager[(p + 1)];
      if (pg != undefined) {
        pg.getElementsByTagName('button')[0].click();
      } else {
        console.log('done, bitch');
      }
    }
  }
},(2200*25));
}

function dododo(){
	var first = new Promise(res=>{res(clickJobListItem());});
	first.then(clickNextPage());
}


for(u=0; u<numberOfPagesToLoop; u++){
dododo()
}
