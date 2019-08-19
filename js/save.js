// Mudflap
// 2019 GUILLEUS Hugues <ghugues@netc.fr>
// BSD 3-Clause "New" or "Revised" License

import * as _zip from "/jszip/jszip.js"

(function(){
	// download
	document.getElementById("download").addEventListener("click",async()=>{
		var zip = new JSZip();
		var listZip = zip.folder("date")
		for (let art of await getArtAll()) {
			console.log(art.title);
			art.fileName = art.journal +"-"+ art.title.replace(/[\s|:;.]+/g,"_") + ".txt" ;
			listZip.file(art.fileName, art.text)
		}
		var b = await zip.generateAsync({
			type:"blob",
		});
		var url = window.URL.createObjectURL(b);
		var anchor = document.createElement("a");
		anchor.href = url ;
		anchor.download = "articles.zip" ;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		window.URL.revokeObjectURL(url)
	})
	document.getElementById("closeReadWrite").addEventListener("click",()=>{
		document.querySelector("main#default").hidden = false ;
		document.querySelector("main#readWrite").hidden = true ;
	})
})();

// List of pages
async function listPages(){
	let i = 0;
	var list = document.getElementById("listArt");
	for (let art of await getArtAll()) { i++ ;
		// list item
		let li = document.createElement("li");
		list.appendChild(li);
		li.id = "i"+i ;
		// title
		let title = document.createElement("div");
		li.appendChild(title);
		title.classList.add("title");
		title.textContent = art.title ;
		// journal
		let journal = document.createElement("div");
		li.appendChild(journal)
		journal.classList.add("journal");
		journal.textContent = art.journal;
		// button
		let button = document.createElement("button");
		li.appendChild(button);
		button.classList.add("readwrite")
		button.textContent = "Voir et éditer le texte" ;
		button.addEventListener("click",readWrite)
	}
}

async function readWrite() {
	let i = JSON.parse(this.parentElement.id.replace("i",""));
	let art = await getArt(i);
	document.querySelector("main#default").hidden = true ;
	document.querySelector("main#readWrite").hidden = false ;
	let editor = document.getElementById("editor") ;
	editor.value = art.text ;
	document.getElementById("editorSave").onclick = ()=>{
		var bib = "bib" + window.localStorage.getItem("lastBib") ;
		art.text = editor.value ;
		console.log(art);
		var l = db.transaction(bib,"readwrite").objectStore(bib).put(art,i) ;
		l.onerror = event=>{
			console.error(event);
		};
		l.onsuccess = event=>{
			console.log(event);
		}
		// console.log(l);
	};
}

// indexDB
var db = null ;
(async function() {
	var openning = window.indexedDB.open("articles",1) ;
	openning.onsuccess = ()=>{
		db = openning.result ;
		listPages();
	}
})();
function getArtAll() {
	var bib = "bib" + window.localStorage.getItem("lastBib") ;
	return new Promise(function(resolve, reject) {
		var req = db.transaction(bib,"readonly").objectStore(bib).getAll();
		req.onsuccess = event=>{
			resolve(req.result);
		};
		req.onerror = event=>{
			reject(event)
		}
	});
}
function getArt(i) {
	var bib = "bib" + window.localStorage.getItem("lastBib") ;
	return new Promise(function(resolve, reject) {
		var req = db.transaction(bib,"readonly").objectStore(bib).get(i);
		req.onsuccess = event=>{
			resolve(req.result);
		};
		req.onerror = event=>{
			reject(event)
		}
	});
}
