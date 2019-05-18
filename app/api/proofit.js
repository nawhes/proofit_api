
const express = require('express');
const router = express.Router();

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

const wallet = new FileSystemWallet('/home/nawhes/proofit_api/walletapp');
const bcrypt = require('bcrypt');
const userName = 'app.app.com';
const connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
const connectionOptions = {
    identity: userName,
    wallet: wallet,
    clientTlsIdentity: userName,
    discovery: { enabled: true, asLocalhost: true },
    eventHandlerOptions: { commitTimeout: 100 }
};

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

function accountJoin(req, res, next) {
    if (!req.body.pin || !req.body.channel) {
        // res.send("something wrong");
    }
    let email;
    let pin = req.body.pin;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            // res.send(error);
        });
    setTimeout(
        async function main() {
            const gateway = new Gateway();
            try {

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
                res.json(error);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();

            }
        }, 3500);
}

function accountQuery(req, res, next) {
    if (!req.body.pin) {
        res.send("something wrong");
    }
    let email;
    let pin = req.body.pin;
    let channel = null;
    let issuer = null;
    channel = req.body.channel;
    issuer = req.body.issuer;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
        });

    setTimeout(
        async function main() {
            const gateway = new Gateway();
            try {

                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('GetNetwork.');
                const network = await gateway.getNetwork('account');

                console.log('GetContract.');
                const contract = await network.getContract('account');

                let response;
                if (channel == null) {
                    console.log('Submit transaction.');
                    response = await contract.evaluateTransaction('query', email, pin);
                } else {
                    console.log('Submit transaction.');
                    response = await contract.evaluateTransaction('query', email, pin, channel, issuer);
                }

                console.log('transaction response.');
                let responseJson = JSON.parse(response.toString());
                await res.json(responseJson);

                console.log('Transaction complete.');
            } catch (error) {
                console.log(`Error processing transaction. ${error}`);
                console.log(error.stack);
                res.json(error);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();

            }
        }, 3500);
}

function proofitAppend(req, res, next) {
    if (!req.body.pin || !req.body.channel) {
        res.send("something wrong");
    }
    let email;
    let pin = req.body.pin;
    let channel = req.body.channel;
    let issuer = req.body.issuer;
    let chaincode;
    if (channel == "univ") {
        chaincode = "proofitUniv";
    } else if (channel == "license") {
        chaincode = "proofitLicense";
    } else if (channel == "language") {
        chaincode = "proofitLanguage";
    }
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
        });

    setTimeout(
        async function main() {
            const gateway = new Gateway();
            try {

                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('GetNetwork.');
                const network = await gateway.getNetwork('proofit');

                console.log('GetContract.');
                const contract = await network.getContract(chaincode);

                console.log('Submit transaction.');
                const response = await contract.submitTransaction('append', email, pin, channel, issuer);

                console.log('transaction response.');
                let responseJson = JSON.parse(response.toString());
                await res.json(responseJson);

                console.log('Transaction complete.');
            } catch (error) {
                console.log(`Error processing transaction. ${error}`);
                console.log(error.stack);
                res.json(error);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();
            }
        }, 3500);
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
    setTimeout(
        async function main() {
            let proofit = {};
            const gateway = new Gateway();
            try {

                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('getNetwork');
                const network = await gateway.getNetwork('proofit');

                //proofitUniv
                console.log('getContract.');
                let contract = await network.getContract('proofitUniv');

                console.log('Evaluate transaction.');
                let response = await contract.evaluateTransaction('read', email);

                let response1 = JSON.parse(response.toString());
                if (response1.status == 200) {
                    Object.assign(proofit, response1.payload);
                }

                //proofitLicense
                console.log('getContract.');
                contract = await network.getContract('proofitLicense');

                console.log('Evaluate transaction.');
                response = await contract.evaluateTransaction('read', email);

                let response2 = JSON.parse(response.toString());
                if (response2.status == 200) {
                    Object.assign(proofit, response2.payload);
                }

                //proofitLanguage
                console.log('getContract.');
                contract = await network.getContract('proofitLanguage');

                console.log('Evaluate transaction.');
                response = await contract.evaluateTransaction('read', email);

                let response3 = JSON.parse(response.toString());
                if (response3.status == 200) {
                    Object.assign(proofit, response3.payload);
                }

                res.json(proofit);
                console.log('Transaction complete.');
            } catch (error) {
                console.log(`Error processing transaction. ${error}`);
                console.log(error.stack);
                res.json(error);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();
            }

        }, 3500);
}

function proofitDelete(req, res, next) {
    if (!req.body.pin) {
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

    setTimeout(
        async function main() {
            const gateway = new Gateway();
            try {

                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('GetNetwork.');
                let network = await gateway.getNetwork('proofit');


                //proofitUniv
                console.log('getContract.');
                let contract = await network.getContract('proofitUniv');

                console.log('Submit transaction.');
                let response = await contract.submitTransaction('delete', email, pin);

                let responseJson = JSON.parse(response.toString());
                if (or(responseJson.status == 200, responseJson.status == 201)) {
                    done = responseJson;
                }

                //proofitLicense
                console.log('getContract.');
                contract = await network.getContract('proofitLicense');

                console.log('Submit transaction.');
                const response = await contract.submitTransaction('delete', email, pin);

                let responseJson = JSON.parse(response.toString());
                if (or(responseJson.status == 200, responseJson.status == 201)) {
                    done = responseJson;
                }

                //proofitLanguage
                console.log('getContract.');
                contract = await network.getContract('proofitLanguage');

                console.log('Submit transaction.');
                let response = await contract.submitTransaction('delete', email, pin);

                let responseJson = JSON.parse(response.toString());
                if (or(responseJson.status == 200, responseJson.status == 201)) {
                    done = responseJson;
                }

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
        }, 3500);
}

module.exports = router;
