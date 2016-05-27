'use strict';
const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({port: 3000});





server.register(require('inert'), function (err) {
	if(err){
		throw err;
	}

	server.route({
		method: 'GET',
		path: '/{name}',
		handler: function (request, reply) {
			reply.file('./public/hello.html');
		}
	})

})




server.start(function (err) {
	if(err){
		throw err;
	}
	console.log('Server is running at: ', server.info)
})
