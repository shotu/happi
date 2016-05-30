'use strict';
const Hapi = require('hapi');
const  Good = require('good');
const server = new Hapi.Server();
server.connection({port: 3000});

/**
 *  it has options to connect to mongodb database -test
 * @type {{url: string, settings: {db: {native_parser: boolean}}}}
 */
var dbOpts = {
	"url": "mongodb://localhost:27017/test",
	"settings": {
		"db": {
			"native_parser": false
		}
	}
};
/**
 * registering the mongodb with hapi server
 */
server.register({
	register: require('hapi-mongodb'),
	options: dbOpts
}, function (err) {
	if (err) {
		console.error(err);
		throw err;
	}

});

/**
 * methods to handle routes
 * @param request
 * @param reply
 */
function usersHandler(request, reply) {
	var db = request.server.plugins['hapi-mongodb'].db;
	var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

	db.collection('users').findOne({  "_id" : new ObjectID(request.params.id) }, function(err, result) {
		if (err) return reply(Boom.internal('Internal MongoDB error', err));
		console.log(result);
		reply(result);
	});
};

// server.register(require('inert'), function (err) {
// 	if(err){
// 		throw err
// 	}
//
// 	server.route({
// 		method: 'GET',
// 		path: '/{name}',
// 		handler: function (request, reply) {
// 			reply.file('./public/hello.html');
// 		}
// 	})
// })
/**
 * registering the Good Console and starting the server
 */
server.register({
	register: Good,
	options: {
		reporters: {
			console: [{
				module: 'good-squeeze',
				name: 'Squeeze',
				args: [{
					response: '*',
					log: '*'
				}]
			}, {
				module: 'good-console'
			}, 'stdout']
		}
	}
},function (err) {
	if(err){
		throw err
	}


	server.start(function (err) {
		if(err){
			throw err;
		}
		console.log('Server is running at: ', server.info)
	})

	
	// after registering is successfull it defines the routes
	server.route( {
		"method"  : "GET",
		"path"    : "/users/{id}",
		"handler" : usersHandler
	});



})

