// Mudflap
// 2019 GUILLEUS Hugues <ghugues@netc.fr>
// BSD 3-Clause "New" or "Revised" License

browser.tabs.onUpdated.addListener((id,_,tab)=>{
	if (tab.isArticle || tab.isInReaderMode) {
		browser.pageAction.show(id);
	} else {
		browser.pageAction.hide(id);
	}
});

browser.pageAction.onClicked.addListener(async tab=>{
	if (!tab.isInReaderMode) {
		let _ = await browser.tabs.toggleReaderMode(tab.id);
	}
	console.log("on passe à la suite");
	var res = await browser.tabs.executeScript({
		code:'document.body.innerText'
	});
	console.log(res[0]);
	console.log("on a fini de récupérér (en théorie).");
})
