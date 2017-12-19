const scenario_str = require('./baseScenario/inputBaseScenario.json');
const wat_action = require('wat_action_nightmare');
const request = require('request');


getBaseScenario.call(this);



function getBaseScenario(){

	request.get('http://localhost:8086/base/', function (error, response, body) {
	if (!error) {
		
		console.log("bodytype:" + typeof(body));
		var baseScenario = JSON.parse(body);
		// var baseJSON = JSON.parse(body);
		console.log("baseLen:"+ baseScenario.length);
		console.log("basescenarioID:"+ baseScenario[baseScenario.length-1]._id);
		console.log("basescenarioAction:"+ baseScenario[baseScenario.length-1].actions);
		
		var base_scenario_get = new wat_action.Scenario();
		base_scenario_get.actions = baseScenario[baseScenario.length-1].actions;
		console.log(base_scenario_get);


		// scenarioIdList.push(obj);
		// resolve(obj);
	}
	});

}