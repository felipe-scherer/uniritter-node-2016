'use strict';

var Types = require('joi');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        schema = {
            type: 'products',
            attributes: {
                name: Types.string(),
                price: Types.number().min(0), 
                brand: Types.string(),
                model: Types.string()
                
                }
        }

    harvesterPlugin.routes.all(schema).forEach(function (route) {
        server.route(route)
    })
}
