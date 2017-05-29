function buildURL(term) {
  let apiURL = `https://en.wikipedia.org/w/api.php?`;
  let apiAction = `&action=opensearch`;
  let apiFormat = `&json`;
  let apiSearch = `&search=`;
  let apiLimit  = `&limit=5`;

  return apiURL   +
        apiAction +
        apiLimit  +
        apiFormat +
        apiSearch + encodeURIComponent(term);
}

function getWikiSearchResults(term) {

  // TODO Rx.Observable.fromPromise(fetch('/users'));

  // Pass it the definition of forEach so we don't need to
  // create that object we did earlier.
  return Rx.Observable.create(function forEach(observer) {
    const url = buildURL(term);

    let cancelled = false;

    fetchJsonp(url)
      .then(resp => resp.json())
      .then(json => {
        if (!cancelled) {
          observer.next(json[1]);
          observer.complete();
        }
      })
      .catch(errv => observer.error())

    return function unsubscribe() {
      cancelled = true;
    }
  });
}

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

function getFile(file) {
	return ASQ(function(done){
		fakeAjax(file,done);
	});
}

// Request all files at once in
// "parallel" via `getFile(..)`.
//
// Render as each one finishes,
// but only once previous rendering
// is done.

// ???
