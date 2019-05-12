const express = require('express');
const router = express.Router();


// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('../wallet');
const bcrypt = require('bcrypt');

//firebase
const admin = require('firebase-admin');
const serviceAccount = require('../proofit-firebase-adminsdk-3nhjp-71e627d9d8.json');

var func = require('./proofit2');

router.post('/join', (req, res, next) => {
    func.accountJoin(req, res, next);
});

router.post('/query', proofitQuery, (req, res, next) => {
});

router.post('/append', proofitAppend, (req, res, next) => {
});

router.post('/read', proofitRead, (req, res, next) => {
});

router.post('/delete', proofitDelete, (req, res, next) => {
});

// function verifyIdToken(req, res, next) {
//     // idToken comes from the client app
//     admin.auth().verifyIdToken(req.idToken)
//         .then(function (decodedToken) {
//             var uid = decodedToken.uid;
//             req.uid = uid;
//             next();
//             // ...
//         }).catch(function (error) {
//             console.log(error);
//             // Handle error
//         });
// }

function proofitJoin(req, res, next) {
   var tt = require('/home/nawhes/proofit/appcli/issue');
}

function proofitQuery(req, res, next) {
    if ( !req.body.pin || !req.body.channel ){
        res.send("something wrong");
    }
	console.log(wallet);
    let email;
    let pin = req.body.pin;
    let channel = req.body.channel;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
            email = userRecord.email;
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
        });

    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));
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
        });

    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../../gateway/networkConnection.yaml', 'utf8'));
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
        });

    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../../gateway/networkConnection.yaml', 'utf8'));
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
    }
    let email;
    let pin = req.body.pin;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
            email = userRecord.email;
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
        });

    async function main() {
        const gateway = new Gateway();
        try {
            const userName = 'app.app.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../../gateway/networkConnection.yaml', 'utf8'));
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
