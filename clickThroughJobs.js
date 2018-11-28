
function getJobPostingObj(obj, n){
setTimeout(()=>{
	obj.getElementsByClassName('job-card-search--clickable')[0].click();
},((n+1)*2000));
}
var jobList = document.getElementsByClassName(
'jobs-search-results__list artdeco-list artdeco-list--offset-4')[0].getElementsByClassName('artdeco-list__item');

for(i=0; i<jobList.length; i++){
	getJobPostingObj(jobList[i], i);
}





