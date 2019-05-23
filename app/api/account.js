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


function join(req, res, next) {
    if (!req.body.pin) {
        res.send("something wrong");
    }
    let email = req.body.email;
    let pin = req.body.pin;
    // admin.auth().getUser(req.body.uid).then(function (userRecord) {
    //     email = userRecord.email;
    // })
    //     .catch(function (error) {
    //         console.log("Error fetching user data:", error);
    //         res.send(error);
    //     });
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
    //     .catch(function (error) {
    //         console.log("Error fetching user data:", error);
    //         res.send(error);
    //     });

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
        }, 1000);
}

exports.join = join;
exports.query = query;