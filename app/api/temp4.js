
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');


async function main() {
    const gateway = new Gateway();
    try {
        const wallet = new FileSystemWallet('/home/nawhes/proofit_api/wallet');
        const userName = 'toeic.language.com';
        const connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
        const connectionOptions = {
            identity: userName,
            wallet: wallet,
            clientTlsIdentity: userName,
            discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: { commitTimeout: 100 }
        };

        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        console.log('getNetwork');
        const network = await gateway.getNetwork('language');

        console.log('getContract.');
        const contract = await network.getContract('language');

        console.log('Submit transaction.');
        const response = await contract.submitTransaction('input', 'nawhes330@gmail.com', '1', 'toeic.language.com', "{\"toeicscore\":\"820\",\"expiration\":\"20210509\"}");

        console.log('transaction response.');
        let responseJson = JSON.parse(response.toString());
        console.log(responseJson)
        console.log('Transaction complete.');
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

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
    process.exit(-1);

});