var db = null ;
var store = null ;

(async function() {
	openning = window.indexedDB.open("articles",1) ;
	openning.onupgradeneeded = event=>{
		db = event.target.result ;
		store = db.createObjectStore("list",{
			autoIncrement:true,
		});
		console.log("stoarge ...");
	}

	openning.onsuccess = ()=>{
		db = openning.result ;
		go()

		// store.transaction.oncomplete = (event)=>{
		// 	console.log(event);
		// 	list = db.transaction("list", "readwrite").objectStore("list");
		// 	list.add({
		// 		newspaper:"lemonde",
		// 		text:"text ... 1",
		// 		title:"C'est la merde",
		// 	})
		// 	list.add({
		// 		newspaper:"lemonde",
		// 		text:"text ... 2",
		// 		title:"Crise économique ...",
		// 	})
		// };
	}
})();

function go() {
	tra = db.transaction("list","readwrite");
	tra.oncomplete = event=>{
		// console.log("tra (go) complet:",event);
		get();
	}
	list = tra.objectStore("list")
	list.add({
		newspaper:"lemonde",
		text:"text ... 1",
		title:"C'est la merde",
	});
	list.add({
		newspaper:"lemonde",
		text:"text ... 2",
		title:"Crise économique ...",
	});
}

function get() {
	trans = db.transaction("list","readonly")
	trans.oncomplete = event=>{
		console.log("trans (get) complet:",event);
	}
	trans.objectStore("list").getAll().onsuccess = event=>{
		console.log(event.target.result);
	}
}
