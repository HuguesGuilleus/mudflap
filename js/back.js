// Mudflap
// 2019 GUILLEUS Hugues <ghugues@netc.fr>
// BSD 3-Clause "New" or "Revised" License

// open save tab
browser.browserAction.onClicked.addListener(()=>{
	browser.tabs.create({
		url:"/pages/save.html",
	});
});

browser.tabs.onUpdated.addListener((id,_,tab)=>{
	// if (tab.isArticle || tab.isInReaderMode) {
	// 	browser.pageAction.show(id);
	// } else {
	// 	browser.pageAction.hide(id);
	// }
	browser.pageAction.show(id);
});

browser.pageAction.onClicked.addListener(async tab=>{
	if (tab.isInReaderMode) {
		let _ = await browser.tabs.toggleReaderMode(tab.id);
	}
	new Page(tab)
	popup(tab)
})

// get the tab text title ... and store in indexDB
class Page {
	constructor(tab) {
		this.title = tab.title ;
		this.getJournal(tab.url);
		this.getText()
	}
	getText() {
		browser.tabs.executeScript({
			file:"/js/getText.js",
		}).then(res=>{
			this.text = res.pop();
			this.save();
		});
	}
	getJournal(url) {
		var j = decodeURIComponent(url).replace(/.*:\/\/([\d\w-.]+)\/.*/, "$1")
		if (/^www\./.test(j)) { // rm www.
			j = j.replace("www.","")
		}
		if (/\.\w+$/.test(j)) { // rm .fr .com .org ...
			j = j.replace(/\.\w+$/,"") ;
		}
		this.journal = j
	}
	save() {
		var bib = "bib"+window.localStorage.getItem("lastBib");
		db.transaction(bib,"readwrite").objectStore(bib).add(this);
	}
}

/// Open the popup add.html for display message
function popup(tab) {
	browser.pageAction.setPopup({
		popup:"/pages/add.html",
		tabId:tab.id,
	});
	browser.pageAction.openPopup()
}

// Storage
var db = null ;
(async function() {
	// Last key
	var bib = window.localStorage.getItem("lastBib") ;
	if ( bib === null ) {
		window.localStorage.setItem("lastBib", "0")
		bib = "bib0"
	} else {
		bib = "bib" + bib ;
	}
	// data base
	var openning = window.indexedDB.open("articles",1) ;
	openning.onupgradeneeded = event=>{
		db = event.target.result ;
		store = db.createObjectStore(bib,{
			autoIncrement:true,
		});
		console.log("storage ...");
	}
	openning.onsuccess = ()=>{
		db = openning.result ;
	}
})();
