function vld(elm, n){if(elm != null){return elm[n]}else{return '';}}
var jobSalArr = [];

function getSalData(){
	var res = document.getElementsByClassName('search-results-list')[0].getElementsByTagName('li');
	for(i=0; i<res.length; i++){
		let company = res[i].getElementsByTagName('img')[0].getAttribute('title');
		let left = res[i].getElementsByClassName('upper-content-wrapper')[0];
		let right = res[i].getElementsByClassName('lower-content-wrapper')[0];
		let title = left.getElementsByTagName('span')[0].getAttribute('title');
		let geo = left.getElementsByTagName('span')[1].innerText.replace(/Greater\s+/, '').replace(/\s+Area/, '');
		let medianSal = right.getElementsByTagName('span')[0].innerText.replace(/\D+/g, '');
		let lowSal = vld(/(?<=Range:\s\$)\d+.{1,10}?(?<=\s+)/.exec(right.getElementsByTagName('span')[1].innerText),0).replace(/\D+/g, '');
		let highSal = vld(/-.+$/.exec(right.getElementsByTagName('span')[1].innerText),0).replace(/\D+/g, '');
		let arr = {'company': company, 'title': title, 'geo': geo, 'medianSal': medianSal, 'lowSal': lowSal, 'highSal': highSal}
		jobSalArr.push(arr);
	}

}
getSalData()
