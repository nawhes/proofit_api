const express = require('express');
const router = express.Router();


// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');


//firebase
const admin = require('firebase-admin');
const serviceAccount = require('../proofit-firebase-adminsdk-3nhjp-71e627d9d8.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://proofit-api.firebaseio.com'
});


router.post('/join', proofitJoin, (req, res, next) => {
    res.send("postJoin");
    console.log("postJoin");
});

router.post('/query', proofitQuery, (req, res, next) => {
    res.send("postQuery");
    console.log("postQuery");
});

router.post('/append', proofitAppend, (req, res, next) => {
    res.send("postAppend");
    console.log("postAppend");
});

router.post('/read', proofitRead, (req, res, next) => {
    res.send("postRead");
    console.log("postRead");
});

router.post('/delete', proofitDelete, (req, res, next) => {
    res.send("postDelete");
    console.log("postDelete");
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
            const userName = 'User1@org1.example.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                discovery: { enabled: false, asLocalhost: true }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('Use network channel: mychannel.');

            const network = await gateway.getNetwork('mychannel');

            console.log('Use org.papernet.commercialpaper smart contract.');

            const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

            // issue commercial paper
            console.log('Submit commercial paper issue transaction.');
            // email, pin
            const issueResponse = await contract.submitTransaction('issue', 'join', 'req.params.id', '2020-05-31', '2020-11-30', '5000000');

            // process response
            console.log('Process issue transaction response.');

            let paper = JSON.parse(issueResponse.toString());
            res.json(paper);

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

function proofitQuery(req, res, next) {
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
            const userName = 'User1@org1.example.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                discovery: { enabled: false, asLocalhost: true }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('Use network channel: mychannel.');

            const network = await gateway.getNetwork('mychannel');

            console.log('Use org.papernet.commercialpaper smart contract.');

            const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

            // issue commercial paper
            console.log('Submit commercial paper issue transaction.');
            // email, pin, channel
            const issueResponse = await contract.submitTransaction('issue', 'query', 'req.params.id', '2020-05-31', '2020-11-30', '5000000');

            // process response
            console.log('Process issue transaction response.');

            let paper = JSON.parse(issueResponse.toString());
            res.json(paper);

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
            const userName = 'User1@org1.example.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                discovery: { enabled: false, asLocalhost: true }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('Use network channel: mychannel.');

            const network = await gateway.getNetwork('mychannel');

            console.log('Use org.papernet.commercialpaper smart contract.');

            const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

            // issue commercial paper
            console.log('Submit commercial paper issue transaction.');
            // email, pin, channel
            const issueResponse = await contract.submitTransaction('issue', 'append', 'req.params.id', '2020-05-31', '2020-11-30', '5000000');

            // process response
            console.log('Process issue transaction response.');

            let paper = JSON.parse(issueResponse.toString());
            res.json(paper);

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
            const userName = 'User1@org1.example.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                discovery: { enabled: false, asLocalhost: true }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('Use network channel: mychannel.');

            const network = await gateway.getNetwork('mychannel');

            console.log('Use org.papernet.commercialpaper smart contract.');

            const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

            // issue commercial paper
            console.log('Submit commercial paper issue transaction.');
            // email, pin, channel
            const issueResponse = await contract.submitTransaction('issue', 'read', 'req.params.id', '2020-05-31', '2020-11-30', '5000000');

            // process response
            console.log('Process issue transaction response.');

            let paper = JSON.parse(issueResponse.toString());
            res.json(paper);

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
            const userName = 'User1@org1.example.com';
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                discovery: { enabled: false, asLocalhost: true }
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);

            console.log('Use network channel: mychannel.');

            const network = await gateway.getNetwork('mychannel');

            console.log('Use org.papernet.commercialpaper smart contract.');

            const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

            // issue commercial paper
            console.log('Submit commercial paper issue transaction.');
            // email, pin, channel
            const issueResponse = await contract.submitTransaction('issue', 'delete', 'req.params.id', '2020-05-31', '2020-11-30', '5000000');

            // process response
            console.log('Process issue transaction response.');

            let paper = JSON.parse(issueResponse.toString());
            res.json(paper);

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