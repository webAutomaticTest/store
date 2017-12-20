const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27018/wat_storage`;
	
	webServer
	.get('/candidate', (req, res) => {
		MongoClient.connect(dbUrl)
		.then(db => {
			db.collection('candidate', {strict:true}, (err, candidateCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {
					candidateCollection.find().toArray()
					.then(candidateArray => {
						res.send(candidateArray).status(200).end();
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
	.post('/candidate', (req, res) => {
		MongoClient.connect(dbUrl).
		then(db => {
			db.collection('candidate', (err, candidateCollection) => {
				if (err) {
					res.status(404).send(err).end();
					db.close();
				} else {

					var candidateItem = {};
					candidateItem.bid = ObjectID(req.body.bid); //bid
					candidateItem.aid = ObjectID(req.body.aid); //aid
					candidateItem.abid = req.body.abid; //abid
					candidateItem.action = req.body.candidateActionJson; //action
					
					candidateCollection.save(candidateItem)
					.then((savedCandidate) => {
						res.status(200).send(savedCandidate).end();
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