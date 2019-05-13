
'use strict'

const express = require('express');
const router = express.Router();

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');


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
    function or(x, y) {
        if (x) {
            return true;
        } else if (y) {
            return true;
        } else {
            return false;
        }
    }

function accountJoin(req, res, next) {
    var result = function (req) {
        return new Promise(function (resolve, reject) {
            if (!req.body.pin) {
                reject("Something's wrong");
            }
            let email;
            let pin = req.body.pin;
            admin.auth().getUser(req.body.uid).then((userRecord) => { email = userRecord.email; }).catch((error) => {
                console.log("Error fetching user data:", error);
                reject(error);
            });
            resolve(email, pin);
        });
    }
    result(req).then((email, pin) => {
        async () => {
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
        }
    }, (error) => {
        res.json(error);
    });
}

function accountQuery(req, res, next) {
    var result = function (req) {
        return new Promise(function (resolve, reject) {
            if (or(!req.body.issuer, or(!req.body.pin, !req.body.channel))) {
                reject("Something's wrong");
            }
            let email;
            let pin = req.body.pin;
            let channel = req.body.channel;
            let issuer = req.body.issuer;
            admin.auth().getUser(req.body.uid).then((userRecord) => { email = userRecord.email; }).catch((error) => {
                console.log("Error fetching user data:", error);
                reject(error);
            });
            resolve(email, pin, channel, issuer);
        });
    }
    result(req).then((email, pin, channel, issuer) => {
        async () => {
            const gateway = new Gateway();
            try {
                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('GetNetwork.');
                const network = await gateway.getNetwork('account');

                console.log('GetContract.');
                const contract = await network.getContract('account');

                console.log('Submit transaction.');
                const response = await contract.evaluateTransaction('query', email, pin, channel, issuer);

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
        }
    }, (error) => {
        res.json(error);
    });
}

function proofitAppend(req, res, next) {
    var result = function (req) {
        return new Promise(function (resolve, reject) {
            if (or(!req.body.issuer, or(!req.body.pin, !req.body.channel))) {
                reject("Something's wrong");
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
            } else {
                reject("something wrong");
            }
            admin.auth().getUser(req.body.uid).then((userRecord) => { email = userRecord.email; }).catch((error) => {
                console.log("Error fetching user data:", error);
                reject(error);
            });
            resolve(email, pin, channel, chaincode, issuer);
        });
    }
    result(req).then((email, pin, channel, chaincode, issuer) => {
        async () => {
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
        }
    }, (error) => {
        res.json(error);
    });
}


function proofitRead(req, res, next) {
    var result = function (req) {
        return new Promise(function (resolve, reject) {
            let email;
            admin.auth().getUser(req.body.uid).then((userRecord) => { email = userRecord.email; }).catch((error) => {
                console.log("Error fetching user data:", error);
                reject(error);
            });
            resolve(email);
        });
    }
    result(req).then((email) => {
        async () => {
            const gateway = new Gateway();
            let proofit = {};
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

                let responseJson = JSON.parse(response.toString());
                if (or(responseJson.status == 200, responseJson.status == 201)) {
                    Object.assign(proofit, responseJson.payload);
                }

                //proofitLicense
                console.log('getContract.');
                contract = await network.getContract('proofitLicense');

                console.log('Evaluate transaction.');
                response = await contract.evaluateTransaction('read', email);

                let responseJson = JSON.parse(response.toString());
                if (or(responseJson.status == 200, responseJson.status == 201)) {
                    Object.assign(proofit, responseJson.payload);
                }

                //proofitLanguage
                console.log('getContract.');
                contract = await network.getContract('proofitLanguage');

                console.log('Evaluate transaction.');
                response = await contract.evaluateTransaction('read', email);

                let responseJson = JSON.parse(response.toString());
                if (or(responseJson.status == 200, responseJson.status == 201)) {
                    Object.assign(proofit, responseJson.payload);
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
        }
    }, (error) => {
        res.json(error);
    });
}

function proofitDelete(req, res, next) {
    var result = function (req) {
        return new Promise(function (resolve, reject) {
            if (!req.body.pin) {
                reject("Something's wrong");
            }
            let email;
            let pin = req.body.pin;
            admin.auth().getUser(req.body.uid).then((userRecord) => { email = userRecord.email; }).catch((error) => {
                console.log("Error fetching user data:", error);
                reject(error);
            });
            resolve(email, pin);
        });
    }
    result(req).then((email, pin) => {
        async () => {
            const gateway = new Gateway();
            let done;
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
                res.json(error);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();
            }
        }
    }, (error) => {
        res.json(error);
    });
}


module.exports = router;

// module.exports.accountJoin = accountJoin;
// module.exports.accountQuery = accountQuery;
// module.exports.proofitAppend = proofitAppend;
// module.exports.proofitRead = proofitRead;
// module.exports.proofitDelete = proofitDelete;
