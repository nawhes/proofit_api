
'use strict'

const express = require('express');
const router = express.Router();

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('/home/nawhes/proofit_api/wallet');

const userName = 'qnet.license.com';
const channelName = 'license';

let connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
let connectionOptions = {
    identity: userName,
    wallet: wallet,
    clientTlsIdentity: userName,
    discovery: {
            enabled: true,
            asLocalhost: true
    },
    eventHandlerOptions: {
            commitTimeout: 100
    }
};

router.post('/input', input);

router.post('/query', query);

router.post('/delete', del);

function input(req, res, next) {
    if ( !req.body.email || !req.body.pin || !req.body.record ){
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

            console.log('getNetwork');
            const network = await gateway.getNetwork(channelName);
            const networkAccount = await gatewayAccount.getNetwork('account');


            console.log('getContract.');
            const contract = await network.getContract(channelName);
            const contractAccount = await networkAccount.getContract('account');


            console.log('Submit transaction.');
            const response = await contract.submitTransaction('input', email, pin, userName, record);
            const responseAccount = await contractAccount.submitTransaction('update', email, pin, channelName, userName);

            console.log('transaction response.');
            let responseJson = JSON.parse(response.toString());
            await res.json(responseJson);

            console.log('Transaction complete.');
        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
            res.send(error);
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

function query(req, res, next) {
    if ( !req.body.email || !req.body.pin ){
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

            console.log('getNetwork');
            const network = await gateway.getNetwork(channelName);

            console.log('getContract.');
            const contract = await network.getContract(channelName);
            
            console.log('Submit transaction.');
            const response = await contract.evaluateTransaction('input', email, pin, userName);

            console.log('transaction response.');
            let responseJson = JSON.parse(response.toString());
            await res.json(responseJson);

            console.log('Transaction complete.');
        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
            res.send(error);
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
    if ( !req.body.email || !req.body.pin ){
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

            console.log('getNetwork');
            const network = await gateway.getNetwork(channelName);

            console.log('getContract.');
            const contract = await network.getContract(channelName);

            console.log('Submit transaction.');
            const response = await contract.evaluateTransaction('delete', email, pin, userName);

            console.log('transaction response.');
            let responseJson = JSON.parse(response.toString());
            await res.json(responseJson);

            console.log('Transaction complete.');
        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
            res.send(error);
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

module.exports = router;
