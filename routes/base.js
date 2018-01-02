const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27018/wat_storage`;
	
	webServer
	.get('/base', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			// .then(database => {
			// const db = database.db('wat_storage');

			db.collection('base', {strict:true}, (err, baseCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					baseCollection.find().toArray()
					.then(basesArray => {
						res.send(basesArray).status(200).end();
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
	.get('/base/:bid', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection('base', {strict:true}, (err, baseCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					baseCollection.find({_id: new ObjectID(req.params.bid)}).toArray()
					.then(basesArray => {
						res.send(basesArray).status(200).end();
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
	.post('/base', (req, res) => {
		MongoClient.connect(dbUrl).
		then(db => {
			// .then(database => {
			// 	const db = database.db('wat_storage');
			db.collection('base', (err, baseCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {

					var baseScenario = {};
					//set user id
					baseScenario.uid = new ObjectID("59b93998eb13c900013461ad");
					baseScenario.actions = req.body;

					if (!baseScenario.wait) {
						baseScenario.wait = 0;
					}
					if (!baseScenario.cssselector) {
						baseScenario.cssselector = 'watId';
					}
					if (!baseScenario.name) {
						baseScenario.name = 'MyScenario';
					}
					if (!baseScenario.assert) {
						baseScenario.assert = {
							end: true,
							selector: 'body',
							property: 'innerHTML',
							contains: 'success'
						};
					}

					
					baseCollection.findOneAndReplace({"actions": baseScenario.actions},baseScenario,{upsert:true})
					.then(savedBaseScenario => {
						res.status(200).send(savedBaseScenario).end();
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