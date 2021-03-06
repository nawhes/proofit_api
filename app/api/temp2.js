
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway, DefaultEventHandlerStrategies } = require('fabric-network');
const bcrypt = require('bcrypt');




async function main() {
    const gateway = new Gateway();
    try {
        const wallet = new FileSystemWallet('/home/nawhes/proofit_api/wallet');
        const userName = 'app.app.com';
        const connectionProfile = yaml.safeLoad(fs.readFileSync('/home/nawhes/proofit_api/gateway/networkConnection.yaml', 'utf8'));
        const connectionOptions = {
            identity: userName,
            wallet: wallet,
            clientTlsIdentity: userName,
            discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: { commitTimeout: 0,strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX }
  
        };

        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);
        console.log(gateway.getOptions());
        
        console.log('getNetwork');
        const network = await gateway.getNetwork('account');
        

        console.log('getContract.');
        const contract = await network.getContract('account');
        

        let pwd = '1';
        let digest = bcrypt.hashSync(pwd, 4);
        console.log('Submit transaction.');
        response = await contract.evaluateTransaction('query', 'nawhes330@gmail.com', '1', 'univ', 'smu.univ.com');
        // const response = await contract.submitTransaction('create', 'nawhes330@gmail.com', '2', digest);
        
        // console.log('transaction response.');
        // let responseJson = JSON.parse(response.toString());

        // console.log(responseJson);
       
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