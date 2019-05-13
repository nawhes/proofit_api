
'use strict'

const express = require('express');
const router = express.Router();

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('/home/nawhes/proofit_api/walletapp');
const bcrypt = require('bcrypt');

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
    if (!req.body.pin) {
        res.send(500, "something wrong");
        return;
    }
    var email;
    let pin = req.body.pin;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
            return;
        });
    setTimeout(async function main() {
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

	    let digest = bcrypt.hashSync(pin, 4);
            console.log('Submit transaction.');
            const response = await contract.submitTransaction('create', email, digest);

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
        , 3000);
}

function accountQuery(req, res, next) {
    if (!req.body.pin || !req.body.channel) {
        res.send(500, "something wrong");
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
    setTimeout(async function main() {
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
        , 3000);
}

function proofitAppend(req, res, next) {
    if (!req.body.pin || !req.body.channel) {
        res.send(500, "something wrong");
        return;
    }
    let email;
    let pin = req.body.pin;
    let channel = req.body.channel;
    let channelName
    if (channel == "univ") {
        channelName = "proofitUniv";
    } else if (channel == "license") {
        channelName = "proofitLicense";
    } else if (channel == "language") {
        channelName = "proofitLanguage";
    } else {
        res.send(500, "something wrong");
        return;
    }
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
            return;
        });

    setTimeout(async function main() {
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
            const network = await gateway.getNetwork(channelName);

            console.log('getContract.');
            const contract = await network.getContract(channelName);

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
        , 3000);
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
    setTimeout(async function main() {

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
            let proofit = {};
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('getNetwork');
            const network = await gateway.getNetwork('proofit');

            console.log('getContract.');
            let contract = await network.getContract('proofitUniv');

            console.log('Evaluate transaction.');
            let response = await contract.evaluateTransaction('read', email);

            let responseJson = JSON.parse(response.toString());
            if (responseJson.status == 200 || responseJson.status == 201) {
                Object.assign(proofit, responseJson.payload);
            }

            console.log('getContract.');
            contract = await network.getContract('proofitLicense');

            console.log('Evaluate transaction.');
            response = await contract.evaluateTransaction('read', email);

            let responseJson = JSON.parse(response.toString());
            if (responseJson.status == 200 || responseJson.status == 201) {
                Object.assign(proofit, responseJson.payload);
            }

            console.log('getContract.');
            contract = await network.getContract('proofitLanguage');

            console.log('Evaluate transaction.');
            response = await contract.evaluateTransaction('read', email);

            let responseJson = JSON.parse(response.toString());
            if (responseJson.status == 200 || responseJson.status == 201) {
                Object.assign(proofit, responseJson.payload);
            }

            await res.json(proofit);
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
    }, 3000);
}

function proofitDelete(req, res, next) {
    if (!req.body.pin) {
        res.send(500, "something wrong");
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
    setTimeout(async function main() {
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
        , 3000);
}

module.exports = router;

// module.exports.accountJoin = accountJoin;
// module.exports.accountQuery = accountQuery;
// module.exports.proofitAppend = proofitAppend;
// module.exports.proofitRead = proofitRead;
// module.exports.proofitDelete = proofitDelete;
