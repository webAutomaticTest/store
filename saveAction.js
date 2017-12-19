const wat_action = require('wat_action_nightmare');
const request = require('request');
const Promise = require('promise');
const request_promise = require('request-promise');

getBaseScenario.call(this);

function getBaseScenario(){

	request.get('http://localhost:8086/base/', function (error, response, body) {
		if (!error) {

			console.log("bodytype:" + typeof(body));
			var baseScenario = JSON.parse(body);
			var basescenarioActions = baseScenario[baseScenario.length-1].actions;

			for (var i = 0; i <= basescenarioActions.length - 1; i++) {
				saveBaseActions(basescenarioActions[i]);
			}

		}
	});

}


function saveBaseActions(baseActionJson){
	request_promise({
		method: 'POST',
		uri: 'http://localhost:8086/action/',
		body: baseActionJson,
		json: true
	})
    .then(function (parsedBody) {// POST succeeded...
    	console.log(parsedBody);
    	return Promise.resolve(parsedBody);

    })
    .catch(function (err) {// POST failed...
    	console.log(err);
    	return Promise.reject(err);
    });
}