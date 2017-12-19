const scenario_str = require('./baseScenario/inputBaseScenario.json');
const wat_action = require('wat_action_nightmare');
const base_scenario = new wat_action.Scenario(scenario_str);
const request_promise = require('request-promise');
var baseScenarioJson = JSON.parse(base_scenario.toJSON());

saveBaseScenario.call(this,baseScenarioJson);

function saveBaseScenario(baseScenarioJson){
	request_promise({
		method: 'POST',
		uri: 'http://localhost:8086/base/',
		body: baseScenarioJson,
		json: true
	})
    .then(function (parsedBody) {// POST succeeded...
    	console.log(parsedBody);

    })
    .catch(function (err) {// POST failed...
    	console.log(err);
    });
}