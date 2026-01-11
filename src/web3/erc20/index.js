require("dotenv").config();
const Web3 = require("web3");
const config = require("./config");
const contractFile = require("./compile");
const { L } = require("@raydium-io/raydium-sdk-v2/lib/raydium-6fecdc52");

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.INFURA_API_URL)
);

// Receiver address
const receiver = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";

// Create account
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

const account_from = {
  privateKey: process.env.PRIVATE_KEY,
  accountAddress: account.address,
};

// Get contract bytecode and ABI
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

const main = async () => {
  const contract = new web3.eth.Contract(abi);
  try {
    // Deploy contract
    const deployer = new ContractDeployer(web3, account_from);
    const contract = await deployer.deploy(abi, bytecode);
    console.log("Contract deployed at address:", contract.options.address);
    // Create contract interaction instance
    const interactor = new ContractInteractor(web3, contract);

    // Transfer tokens
    await interactor.transfer(account_from, receiver, 100000);
    // Query receiver balance
    const balance = await interactor.balanceOf(receiver);
    console.log("Receiver balance:", balance);

    // Create Websocket connection for listening to events
    const web3Socket = new Web3(
      "wss://sepolia.infura.io/ws/v3/" + process.env.INFURA_PROJECT_ID
    );
    const contractSocket = new web3Socket.eth.Contract(
      abi,
      contract.options.address
    );

    // 6. Setup event listener
    const eventListener = new EventListener(web3Socket, socketContract);
    await eventListener.subscribeToTransfers();

    // Wait for a while to receive events
    console.log("Waiting for events...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // 7. Get historical transfer events
    const deployBlock = await web3.eth.getBlockNumber();
    await eventListener.getPastTransfers(deployBlock);

    // 8. Cleanup event subscriptions
    eventListener.unsubscribeAll();

    console.log("Transfer complete");
  } catch (error) {
    console.log("An error occurred while deploying the contract:", error);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
