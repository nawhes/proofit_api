const express = require('express');
const router = express.Router();


// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');

router.post('/input', proofitInput, (req, res, next) => {
    res.send("postJoin");
    console.log("postJoin");
});

router.post('/querybyisuuer', proofitQuery, (req, res, next) => {
    res.send("postQuery");
    console.log("postQuery");
});

router.post('/deletebyissuer', proofitDelete, (req, res, next) => {
    res.send("postAppend");
    console.log("postAppend");
});

function proofitInput(req, res, next) {
    let email = req.body.email;
    let pin = req.body.pin;
    let record = req.body.record;

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
            // email, pin record
            const issueResponse = await contract.submitTransaction('issue', 'input', 'email', 'pin', 'record', '5000000');

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
    let email = req.body.email;
    let pin = req.body.pin;
    let channel = req.body.channel;

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
            const issueResponse = await contract.submitTransaction('issue', 'queryByIssuer', 'email', 'pin', '2020-11-30', '5000000');

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
    let email = req.body.email;
    let pin = req.body.pin;

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
            const issueResponse = await contract.submitTransaction('issue', 'deletebyissuer', 'email', 'pin', '2020-11-30', '5000000');

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