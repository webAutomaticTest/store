const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');


module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27018/wat_storage`;
	
	webServer
	.get('/crawlScenario', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection('crawlScenario', {strict:true}, (err, crawlScenarioCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					crawlScenarioCollection.find({ isCrawled: false }).toArray()
					.then(crawlScenarioArray => {
						res.send(crawlScenarioArray).status(200).end();
						db.close();
					})
					.catch(err => {
						res.status(500).send(err).end();
						db.close();
					});
				}
			});
		})
		.catch(err => {
			winston.info(err);
			res.status(500).send(err).end;
		});
	});

	webServer
	.post('/crawlScenario', (req, res) => {
		MongoClient.connect(dbUrl).
		then(db => {
			db.collection('crawlScenario', (err, crawlScenarioCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {

					var crawlScenario = {};
					crawlScenario._id = ObjectID();
					crawlScenario.bid = ObjectID(req.body.bid);
					crawlScenario.actions = req.body.scenarioActions;
					crawlScenario.actions = req.body;
					crawlScenario.wait = 1000;
					crawlScenario.isCrawled = false;
					if (!crawlScenario.cssselector) {
						crawlScenario.cssselector = 'watId';
					}
					if (!crawlScenario.name) {
						crawlScenario.name = 'MyScenario';
					}
					if (!crawlScenario.assert) {
						crawlScenario.assert = {
							end: true,
							selector: 'body',
							property: 'innerHTML',
							contains: 'success'
						};
					}

					
					crawlScenarioCollection.findOneAndReplace({'actions': crawlScenario.actions},crawlScenario,{upsert:true})
					.then(savedScenario => {
						res.status(200).send(savedScenario).end();
						db.close();
					})
					.catch(err => {
						winston.error(err);
						res.status(500).send(err).end();
						db.close();
					});
				}
			});
		}).catch(err => {
			winston.error(err);
			res.status(500).send(err).end;
		});
	});
};