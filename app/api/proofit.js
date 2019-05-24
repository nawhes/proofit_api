const admin = require('firebase-admin');

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const bcrypt = require('bcrypt');
const { FileSystemWallet, Gateway, DefaultEventHandlerStrategies } = require('fabric-network');

const wallet = new FileSystemWallet('/home/nawhes/proofit_api/wallet');

const identity = 'app.app.com';

const connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
const connectionOptions = {
    identity: identity,
    wallet: wallet,
    clientTlsIdentity: identity,
    discovery: { enabled: true, asLocalhost: true },
    eventHandlerOptions: { commitTimeout: 0,strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX }
};

function create(req, res, next) {
    if (!req.body.id || !req.body.pwd) {
        res.send("something wrong");
    }
    let email = req.body.email;
    let id = req.body.id;
    let pwd = req.body.pwd;
    // admin.auth().getUser(req.body.uid).then(function (userRecord) {
    //     email = userRecord.email;
    // }).catch(function (err) {
    //         console.log("Error fetching user data:", err);
    //         res.send(err);
    //     });
    setTimeout(
        async function main() {
            let gateway = new Gateway();
            try {
                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('Get network.');
                let network = await gateway.getNetwork('proofit');

                console.log('Get contract.');
                let contract = await network.getContract('proofit');

                let digest = bcrypt.hashSync(pwd, 4);
                console.log('Submit transaction.');
                let response = await contract.submitTransaction('create', email, id, digest);

                console.log('Transaction response.');
                let responseJson = JSON.parse(response.toString());
                await res.json(responseJson);
                console.log('Transaction complete.');
            } catch (err) {
                console.log(`Error processing transaction. ${err}`);
                console.log(err.stack);
                res.json(err);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();
            }
        }, 1000);
}

function append(req, res, next) {
    if (!req.body.pin) {
        if (!req.body.channel) {
            res.send("something wrong");
        }
    }
    let email = req.body.email;
    let id = req.body.id;
    let pwd = req.body.pwd;
    let pin = req.body.pin;
    let channel = req.body.channel;
    let issuer = req.body.issuer;
    let parameters = req.body.parameters;
    // admin.auth().getUser(req.body.uid).then(function (userRecord) {
    //     email = userRecord.email;
    // }).catch(function (err) {
    //         console.log("Error fetching user data:", err);
    //         res.send(err);
    //     });
    setTimeout(
        async function main() {
            let gateway = new Gateway();
            try {
                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);
                console.log(gateway.getOptions());

                console.log('Get network.');
                let network = await gateway.getNetwork('proofit');

                console.log('Get contract.');
                let contract = await network.getContract('proofit');

                let response;
                console.log('Submit transaction.');
                if (Array.isArray(parameters)){
                    console.log("parameters count : ", parameters.length);
                    if (parameters.length == 1){
                        response = await contract.submitTransaction('append', email, id, pwd, pin, channel, issuer, parameters[0]);
                    }
                    if (parameters.length == 2){
                        response = await contract.submitTransaction('append', email, id, pwd, pin, channel, issuer, parameters[0], parameters[1]);
                    }
                    if (parameters.length == 3){
                        response = await contract.submitTransaction('append', email, id, pwd, pin, channel, issuer, parameters[0], parameters[1], parameters[2]);
                    }
                    if (parameters.length == 4){
                        response = await contract.submitTransaction('append', email, id, pwd, pin, channel, issuer, parameters[0], parameters[1], parameters[2], parameters[3]);
                    }
                    if (parameters.length == 5){
                        response = await contract.submitTransaction('append', email, id, pwd, pin, channel, issuer, parameters[0], parameters[1], parameters[2], parameters[3], parameters[4]);
                    }
                } else {
                    response = await contract.submitTransaction('append', email, id, pwd, pin, channel, issuer);
                }
                console.log('transaction response.');
                let responseJson = JSON.parse(response.toString());
                await res.json(responseJson);
                console.log('Transaction complete.');
            } catch (err) {
                console.log(`Error processing transaction. ${err}`);
                console.log(err.stack);
                res.json(err);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();
            }
        }, 1000);
}

function appendEmail(req, res, next) {
    if (!req.body.id) {
        res.send("something wrong");
    }
    let email = req.body.email;
    let id = req.body.id;
    let pwd = req.body.pwd;
    // admin.auth().getUser(req.body.uid).then(function (userRecord) {
    //     email = userRecord.email;
    // }).catch(function (err) {
    //         console.log("Error fetching user data:", err);
    //         res.send(err);
    //     });
    setTimeout(
        async function main() {
            let gateway = new Gateway();
            try {
                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('Get network.');
                let network = await gateway.getNetwork('proofit');

                console.log('Get contract.');
                let contract = await network.getContract('proofit');

                console.log('Submit transaction.');
                let response = await contract.submitTransaction('appendEmail', email, id, pwd);

                console.log('Transaction response.');
                let responseJson = JSON.parse(response.toString());
                await res.json(responseJson);
                console.log('Transaction complete.');
            } catch (err) {
                console.log(`Error processing transaction. ${err}`);
                console.log(err.stack);
                res.json(err);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();
            }
        }, 1000);
}

function read(req, res, next) {
    if (!req.body.id) {
        res.send("something wrong");
    }
    let email = req.body.email;
    let id = req.body.id;
    // admin.auth().getUser(req.body.uid).then(function (userRecord) {
    //     email = userRecord.email;
    // }).catch(function (err) {
    //         console.log("Error fetching user data:", err);
    //         res.send(err);
    //     });
    setTimeout(
        async function main() {
            let gateway = new Gateway();
            try {
                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('Get network.');
                let network = await gateway.getNetwork('proofit');

                console.log('Get contract.');
                let contract = await network.getContract('proofit');

                console.log('Evaluate transaction.');
                let response = await contract.evaluateTransaction('read', email, id);

                console.log('Transaction response.');
                let responseJson = JSON.parse(response.toString());
                await res.json(responseJson);
                console.log('Transaction complete.');
            } catch (err) {
                console.log(`Error processing transaction. ${err}`);
                console.log(err.stack);
                res.json(err);
            } finally {
                // Disconnect from the gateway
                console.log('Disconnect from Fabric gateway.')
                gateway.disconnect();
            }

        }, 1000);
}

function del(req, res, next) {
    if (!req.body.id) {
        res.send("something wrong");
    }
    let email = req.body.email;
    let id = req.body.id;
    let pwd = req.body.pwd;
    // admin.auth().getUser(req.body.uid).then(function (userRecord) {
    //     email = userRecord.email;
    // })
    //     .catch(function (err) {
    //         console.log("Error fetching user data:", err);
    //         res.send(err);
    //     });
    setTimeout(
        async function main() {
            let gateway = new Gateway();
            try {
                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('Get network.');
                let network = await gateway.getNetwork('proofit');

                console.log('Get contract.');
                let contract = await network.getContract('proofit');

                console.log('Submit transaction.');
                let response = await contract.submitTransaction('delete', email, id, pwd);

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
        }, 1000);
}

exports.create = create;
exports.append = append;
exports.appendEmail = appendEmail;
exports.read = read;
exports.del = del;