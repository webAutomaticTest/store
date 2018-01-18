const MongoClient = require('mongodb').MongoClient;
const winston = require('winston');
const Promise = require('promise');
const ObjectID = require('mongodb').ObjectID;

module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27018/wat_storage`;
	webServer
	.get('/step', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection('step', {strict:true}, (err, stepCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					stepCollection.find().toArray()
					.then(stepArray => {
						res.send(stepArray).status(200).end();
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
	.post('/init_step', (req, res) => {
		MongoClient.connect(dbUrl).
		then(db => {
			db.collection('step', (err, stepCollection) => {
				if (err) {
					winston.error(err);
					res.status(404).send(err).end();
					db.close();
				} else {
					var stepItem = {};
					stepItem.candidateId = ObjectID(req.body._id);
					stepItem.bid = ObjectID(req.body.bid);
					stepItem.preIndex = req.body.preIndex;
					stepItem.aid = ObjectID(req.body.aid);
					stepItem.action = req.body.action;
					stepItem.FPCA = 0;
					stepItem.TPCA_OUT = 0;
					stepItem.TPCA_IN_TS = 0;
					stepItem.TPCA_IN_TF = 0;
					stepItem.probability = req.body.probability;
					// stepItem.pSum = 0;

					stepCollection.findOneAndReplace({'candidateId': stepItem.candidateId },stepItem,{ upsert: true })
					.then(savedStep => {
						res.status(200).send(savedStep).end();
						db.close();
					})
					.catch(err => {
						winston.error(err);
						res.status(500).send(err).end();
						db.close();
					});		

				}
			})
		}).catch(err => {
			winston.error(err);
			res.status(500).send(err).end;
		});
	});

	webServer
	.post('/update_step', (req, res) => {
		MongoClient.connect(dbUrl).
		then(db => {
			db.collection('step', (err, stepCollection) => {
				if (err) {
					winston.error(err);
					res.status(404).send(err).end();
					db.close();
				} else {
					var stepItem = req.body;
					stepItem._id = new ObjectID(req.body._id);

					stepCollection.findOneAndReplace({'_id': stepItem._id },stepItem,{ upsert: true })
					.then(savedStep => {
						res.status(200).send(savedStep).end();
						db.close();
					})
					.catch(err => {
						winston.error(err);
						res.status(500).send(err).end();
						db.close();
					});		

				}
			})
		}).catch(err => {
			winston.error(err);
			res.status(500).send(err).end;
		});
	});
};