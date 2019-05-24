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

// function verifyIdToken(req, res, next) {
//     // idToken comes from the client app
//     admin.auth().verifyIdToken(req.idToken)
//         .then(function (decodedToken) {
//             var uid = decodedToken.uid;
//             req.uid = uid;
//             next();
//             // ...
//         }).catch(function (err) {
//             console.log(err);
//             // Handle err
//         });
// }

function join(req, res, next) {
    if (!req.body.pin) {
        res.send("something wrong");
    }
    let email = req.body.email;
    let pin = req.body.pin;
    // admin.auth().getUser(req.body.uid).then(function (userRecord) {
    //     email = userRecord.email;
    // })
    //     .catch(function (err) {
    //         console.log("Error fetching user data:", err);
    //         res.send(err);
    //     });
    setTimeout(
        async function main() {
            const gateway = new Gateway();
            try {
                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('Get network.');
                const network = await gateway.getNetwork('account');

                console.log('Get contract.');
                const contract = await network.getContract('account');

                let digest = bcrypt.hashSync(pin, 4);
                console.log('Submit transaction.');
                const response = await contract.submitTransaction('create', email, digest);

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

function query(req, res, next) {
    if (!req.body.pin) {
        res.send("something wrong");
    }
    let email = req.body.email;
    let pin = req.body.pin;
    let channel = null;
    let issuer = null;
    if (req.body.channel){
        channel = req.body.channel;
    }
    if (req.body.issuer){
        issuer = req.body.issuer;
    }
    // admin.auth().getUser(req.body.uid).then(function (userRecord) {
    //     email = userRecord.email;
    // })
    //     .catch(function (err) {
    //         console.log("Error fetching user data:", err);
    //         res.send(err);
    //     });

    setTimeout(
        async function main() {
            const gateway = new Gateway();
            try {
                console.log('Connect to Fabric gateway.');
                await gateway.connect(connectionProfile, connectionOptions);

                console.log('Get network.');
                const network = await gateway.getNetwork('account');

                console.log('Get contract.');
                const contract = await network.getContract('account');

                let response;
                console.log('evaluate transaction.');
                if (channel == null) {
                    response = await contract.evaluateTransaction('query', email, pin);
                } else {
                    response = await contract.evaluateTransaction('query', email, pin, channel, issuer);
                }

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

exports.join = join;
exports.query = query;