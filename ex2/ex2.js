function fakeAjax(url,cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	console.log("Requesting: " + url);

	setTimeout(function(){
		cb(fake_responses[url]);
	},randomDelay);
}

function output(text) {
	console.log(text);
}

// **************************************

// Bridge the gap between one function that may
// execute sometime in the future and one function
// that will execute right away with closure.
//
// Closure! Closure! Closure!
//
// Active Thunk Pattern
//
// Thunks help us eliminate time as a complicating
// factor in our code.
function getFile(file) {
	let text, fn;

	// The callback could either execute immediately
	// or at some point in future.
	fakeAjax(file, function(response) {
		if (fn) { fn(response); }
		else 		{ text = response; }
	});

	return function(cb) {
		if (text) { cb(text); }
		else 			{ fn = cb; }
	}
}

const th1 = getFile("file1");
const th2 = getFile("file2");
const th3 = getFile("file3");

th1((a) => {
	output(a);

	th2((b) => {
		output(b);

		th3((c) => {
				output(c);
				output("Complete!");
		});
	});
});
