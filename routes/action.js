const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27018/wat_storage`;
	
	webServer
	.get('/action', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection('action', {strict:true}, (err, actionCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					actionCollection.find().toArray()
					.then(actionsArray => {
						res.send(actionsArray).status(200).end();
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
	.post('/action', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection('action', (err, actionCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {

					var actionItem = {};
					actionItem.action = req.body;
					console.log(req.body);


					actionCollection.findOneAndReplace({ 'action': actionItem.action }, actionItem, { upsert: true })
					.then((savedBaseScenario) => {
						res.status(200).send(savedBaseScenario).end();
						db.close();
					}).catch(err => {
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