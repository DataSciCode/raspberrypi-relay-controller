'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 3000 });

const rpio = require('rpio');
const defaultPinOnDuration = 500;
const relayToGpioPinMapping = {
    '1': 12,
    '2': 13
};

// Test: curl -X PUT -D - -H "Content-Type: application/json" -d '{ "relay":{"state":"closed"}}' http://localhost:3000/relays/1
server.route({
    method: 'PUT',
    path: '/relays/{number}',
    handler: function (request, reply) {
        let relayNumber = request.params.number;
        let relay = request.payload.relay;
        if (relay.state === "closed") {
            let relayPin = relayToGpioPinMapping[relayNumber];
            let duration = Number(relay.close_duration || defaultPinOnDuration);        
            console.log(JSON.stringify(relay));
            toggleGpioPinOn(relayPin, duration);    
        }
        
        reply().code(204);
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

function toggleGpioPinOn(pin, durationMilliseconds) {
    // Set the initial state to low.
    rpio.open(pin, rpio.OUTPUT, rpio.LOW);
    // Turn pin ON.
    rpio.write(pin, rpio.HIGH);
    // Wait durationMilliseconds
    rpio.msleep(durationMilliseconds);
    // Turn pin OFF.
    rpio.write(pin, rpio.LOW);
}