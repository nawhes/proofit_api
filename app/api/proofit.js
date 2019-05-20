const admin = require('firebase-admin');

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

const wallet = new FileSystemWallet('/home/nawhes/proofit_api/wallet');
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



function create(req, res, next) {
    if (!req.body.id || !req.body.pwd) {
        res.send("something wrong");
    }
    let email;
    let id = req.body.id;
    let pwd = req.body.pwd;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    }).catch(function (error) {
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
                const contract = await network.getContract('proofit');

                let digest = bcrypt.hashSync(pwd, 4);
                console.log('Submit transaction.');
                const response = await contract.submitTransaction('create', email, id, digest);

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

function append(req, res, next) {
    if (!req.body.pin) {
        if (!req.body.channel) {
            res.send("something wrong");
        }
    }
    let email;
    let id = req.body.id;
    let pwd = req.body.pwd;
    let pin = req.body.pin;
    let channel = req.body.channel;
    let issuer = req.body.issuer;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    }).catch(function (error) {
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
                const contract = await network.getContract('proofit');

                console.log('Submit transaction.');
                const response = await contract.submitTransaction('append', email, id, pwd, pin, channel, issuer);

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

function appendEmail(req, res, next) {
    if (!req.body.id) {
        res.send("something wrong");
    }
    let email;
    let id = req.body.id;
    let pwd = req.body.pwd;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    }).catch(function (error) {
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
                const contract = await network.getContract('proofit');

                console.log('Submit transaction.');
                const response = await contract.submitTransaction('appendEmail', email, id, pwd);

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

function read(req, res, next) {
    if (!req.body.id) {
        res.send("something wrong");
    }
    let email;
    let id = req.body.id;
    admin.auth().getUser(req.body.uid).then(function (userRecord) {
        email = userRecord.email;
    }).catch(function (error) {
            console.log("Error fetching user data:", error);
            res.send(error);
        });
    setTimeout(
        async function main() {
            const gateway = new Gateway();
            try {

                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('getNetwork');
                const network = await gateway.getNetwork('proofit');

                console.log('getContract.');
                let contract = await network.getContract('proofit');

                console.log('Evaluate transaction.');
                let response = await contract.evaluateTransaction('read', email, id);

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

function del(req, res, next) {
    if (!req.body.id) {
        res.send("something wrong");
    }
    let email;
    let id = req.body.id;
    let pwd = req.body.pwd;
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

                console.log('getContract.');
                let contract = await network.getContract('proofit');

                console.log('Submit transaction.');
                let response = await contract.submitTransaction('delete', email, id, pwd);

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
        }, 3500);
}

exports.create = create;
exports.append = append;
exports.appendEmail = appendEmail;
exports.read = read;
exports.del = del;