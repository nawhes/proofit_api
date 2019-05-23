
'use strict'

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('/home/nawhes/proofit_api/wallet');

const userName = 'sk.recruit.com';
const channelName = 'proofit';

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

function read(req, res, next) {
    if ( !req.body.email ){
        res.send(500, "something wrong");
        return;
    }
    let email = req.body.email;
    let id = req.body.id;
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
            const response = await contract.evaluateTransaction('read', email, id);

            console.log('Transaction response.');
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

exports.read = read;