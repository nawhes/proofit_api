
'use strict'

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('/home/nawhes/proofit_api/wallet');

const identity = 'toeic.language.com';
const channelName = 'language';

let connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
let connectionOptions = {
    identity: identity,
    wallet: wallet,
    clientTlsIdentity: identity,
    discovery: {
        enabled: true,
        asLocalhost: true
    },
    eventHandlerOptions: {
        commitTimeout: 100
    }
};

function input(req, res, next) {
    if (!req.body.email || !req.body.pin || !req.body.record) {
        res.send(500, "something wrong");
        return;
    }
    let email = req.body.email;
    let pin = req.body.pin;
    let record = req.body.record;
    async function main() {
        const gateway = new Gateway();
        const gatewayAccount = new Gateway();

        try {
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);
            await gatewayAccount.connect(connectionProfile, connectionOptions);

            console.log('Get network.');
            const network = await gateway.getNetwork(channelName);
            const networkAccount = await gatewayAccount.getNetwork('account');

            console.log('Get contract.');
            const contract = await network.getContract(channelName);
            const contractAccount = await networkAccount.getContract('account');

            console.log('Submit transaction.');
            const response = await contract.submitTransaction('input', email, pin, gateway.getCurrentIdentity().getName(), record);

            console.log('Transaction response.');
            let responseJson = JSON.parse(response.toString());
            if (responseJson.status == 200) {
                await contractAccount.submitTransaction('update', email, pin, channelName, gateway.getCurrentIdentity().getName());
            }
            await res.json(responseJson);

            console.log('Transaction complete.');
        } catch (err) {
            console.log(`Error processing transaction. ${err}`);
            console.log(err.stack);
            res.send(err);
        } finally {
            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
        }
    }
    main().then(() => {
        console.log('Issue program complete.');
    }).catch((e) => {
        console.log('Issue program exception.');
        console.log(e);
        console.log(e.stack);
        // process.exit(-1);
    });
}

function query(req, res, next) {
    if (!req.body.email || !req.body.pin) {
        res.send(500, "something wrong");
        return;
    }
    let email = req.body.email;
    let pin = req.body.pin;
    async function main() {
        const gateway = new Gateway();
        try {
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('Get network.');
            const network = await gateway.getNetwork(channelName);

            console.log('Get contract.');
            const contract = await network.getContract(channelName);

            console.log('Evaluate transaction.');
            const response = await contract.evaluateTransaction('query', email, pin, gateway.getCurrentIdentity().getName());

            console.log('Transaction response.');
            let responseJson = JSON.parse(response.toString());
            await res.json(responseJson);
            console.log('Transaction complete.');
        } catch (err) {
            console.log(`Error processing transaction. ${err}`);
            console.log(err.stack);
            res.send(err);
        } finally {
            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.')
            gateway.disconnect();
        }
    }
    main().then(() => {
        console.log('Issue program complete.');
    }).catch((e) => {
        console.log('Issue program exception.');
        console.log(e);
        console.log(e.stack);
        // process.exit(-1);
    });
}


function del(req, res, next) {
    if (!req.body.email || !req.body.pin) {
        res.send(500, "something wrong");
        return;
    }
    let email = req.body.email;
    let pin = req.body.pin;
    async function main() {
        const gateway = new Gateway();
        try {
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('Get network.');
            const network = await gateway.getNetwork(channelName);

            console.log('Get contract.');
            const contract = await network.getContract(channelName);

            console.log('Submit transaction.');
            const response = await contract.submitTransaction('delete', email, pin, gateway.getCurrentIdentity().getName());

            console.log('Transaction response.');
            let responseJson = JSON.parse(response.toString());
            await res.json(responseJson);
            console.log('Transaction complete.');
        } catch (err) {
            console.log(`Error processing transaction. ${err}`);
            console.log(err.stack);
            res.send(err);
        } finally {
            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.')
            gateway.disconnect();
        }
    }
    main().then(() => {
        console.log('Issue program complete.');
    }).catch((e) => {
        console.log('Issue program exception.');
        console.log(e);
        console.log(e.stack);
        // process.exit(-1);
    });
}

exports.input = input;
exports.query = query;
exports.del = del;