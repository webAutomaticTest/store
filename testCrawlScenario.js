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
			saveCrawlScenario(baseScenario);
		}
	});

}


function saveCrawlScenario(baseScenario){

	var baseScenarioActions = baseScenario[baseScenario.length-1].actions;
	var bid = baseScenario[baseScenario.length-1]._id;
	for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
		var newActions = baseScenarioActions.slice(0, i + 1);
		var scenario = new wat_action.Scenario();
		scenario.actions = newActions;		
		var scenarioActions = JSON.parse(scenario.toJSON());
		postToSaveCrawlScenario(scenarioActions,bid);
		
	}
}


function postToSaveCrawlScenario(scenarioActions,bid){
	request_promise({
		method: 'POST',
		uri: 'http://localhost:8086/crawlScenario/',
		body: { "scenarioActions": scenarioActions , "bid": bid },
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