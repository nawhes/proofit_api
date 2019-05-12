
'use strict'

const express = require('express');
const router = express.Router();

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('/home/nawhes/proofit_api/wallet');

//firebase
const admin = require('firebase-admin');
const serviceAccount = require('../proofit-firebase-adminsdk-3nhjp-71e627d9d8.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://proofit-api.firebaseio.com'
});

router.post('/join', accountJoin);

router.post('/query', accountQuery);

router.post('/append', proofitAppend);

router.post('/read', proofitRead);

router.post('/delete', proofitDelete);

function accountJoin(req, res, next) {
    if ( !req.body.pin ){
        res.send("something wrong");
	return;
    }
    let email;
    let pin = req.body.pin;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
            email = userRecord.email;
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
	    return;
        });
    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
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
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('getNetwork');
            const network = await gateway.getNetwork('account');

            console.log('getContract.');
            const contract = await network.getContract('account');

            console.log('Submit transaction.');
            const response = await contract.submitTransaction('create', email, pin);

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

function accountQuery(req, res, next) {
    if ( !req.body.pin || !req.body.channel ){
        res.send("something wrong");
	return;
    }
    let email;
    let pin = req.body.pin;
    let channel = req.body.channel;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
            email = userRecord.email;
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
	    return;
        });

    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                clientTlsIdentity: userName,
                discovery: { enabled: true, asLocalhost: true },
                eventHandlerOptions: { commitTimeout: 100 }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('getNetwork');
            const network = await gateway.getNetwork('account');

            console.log('getContract.');
            const contract = await network.getContract('account');

            console.log('Evaluate transaction.');
            const response = await contract.evaluateTransaction('query', email, pin, channel);

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

function proofitAppend(req, res, next) {
    if ( !req.body.pin || !req.body.channel ){
        res.send("something wrong");
	return;
    }
    let email;
    let pin = req.body.pin;
    let channel = req.body.channel;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
            email = userRecord.email;
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
	    return;
        });

    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                clientTlsIdentity: userName,
                discovery: { enabled: true, asLocalhost: true },
                eventHandlerOptions: { commitTimeout: 100 }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('getNetwork');
            const network = await gateway.getNetwork('proofit');

            console.log('getContract.');
            const contract = await network.getContract('proofit');

            console.log('Submit transaction.');
            const response = await contract.submitTransaction('append', email, pin, channel);

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

function proofitRead(req, res, next) {
    let email;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
            email = userRecord.email;
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
	    return;
        });

    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                clientTlsIdentity: userName,
                discovery: { enabled: true, asLocalhost: true },
                eventHandlerOptions: { commitTimeout: 100 }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('getNetwork');
            const network = await gateway.getNetwork('proofit');

            console.log('getContract.');
            const contract = await network.getContract('proofit');

            console.log('Evaluate transaction.');
            const response = await contract.evaluateTransaction('read', email);

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

function proofitDelete(req, res, next) {
    if ( !req.body.pin ){
        res.send("something wrong");
	return;
    }
    let email;
    let pin = req.body.pin;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
            email = userRecord.email;
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
	    return;
        });

    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                clientTlsIdentity: userName,
                discovery: { enabled: true, asLocalhost: true },
                eventHandlerOptions: { commitTimeout: 100 }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('getNetwork');
            const network = await gateway.getNetwork('proofit');

            console.log('getContract.');
            const contract = await network.getContract('proofit');

            console.log('Submit transaction.');
            const response = await contract.submitTransaction('delete', email, pin);

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

module.exports = router;

// module.exports.accountJoin = accountJoin;
// module.exports.accountQuery = accountQuery;
// module.exports.proofitAppend = proofitAppend;
// module.exports.proofitRead = proofitRead;
// module.exports.proofitDelete = proofitDelete;