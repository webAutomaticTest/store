const MongoClient = require('mongodb').MongoClient;
const winston = require('winston');

module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27018/wat_storage`;

	webServer
	.get('/scenario', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					scenarioCollection.find().toArray()
					.then(scenarioArray => {
						res.send(scenarioArray).status(200).end();
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
	.get('/scenario/:sid', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					scenarioCollection.find({_id: new ObjectID(req.params.sid)}).toArray()
					.then(scenarioArray => {
						res.send(scenarioArray).status(200).end();
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
	.post('/scenario', (req, res) => {
		MongoClient.connect(dbUrl).
		then(db => {
			db.collection('scenario', (err, scenarioCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					var scenario = req.body;

					scenarioCollection.insert(scenario)
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