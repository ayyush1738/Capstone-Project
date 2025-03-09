import { Provider, types } from "zksync-ethers";
import { ethers, BigNumber } from "ethers";

// Connect to zkSync Sepolia
const provider = new ethers.providers.JsonRpcProvider("https://sepolia.era.zksync.dev");

// Deployed contract address
const contractAddress = "0x9DeE5cEa17eE79e6517e02c8875f074eF69F5EC4";

// Verifier Contract ABI
const contractABI = [
    {
        "inputs": [
            { "internalType": "uint256[2]", "name": "_pA", "type": "uint256[2]" },
            { "internalType": "uint256[2][2]", "name": "_pB", "type": "uint256[2][2]" },
            { "internalType": "uint256[2]", "name": "_pC", "type": "uint256[2]" },
            { "internalType": "uint256[5]", "name": "_pubSignals", "type": "uint256[5]" }
        ],
        "name": "verifyProof",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }
];

// Connect contract using provider (No signing required)
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Format proof data correctly
const proof = {
    a: [
        BigNumber.from("19636599738207049123176494830847895321611107346320219264292307315904452869329"),
        BigNumber.from("18194825845379751588748901458018588030835191457246108737670451775983168362364")
    ],
    b: [
        [
            BigNumber.from("19464153774342917495596502357387521656300570769130555957258498076383221555968"),
            BigNumber.from("7447799352521037427976130086202537147967629735492569959826793712634204764256")
        ],
        [
            BigNumber.from("16940724062238422436862187881792186507736886162979344436309663765796630621042"),
            BigNumber.from("15035125294905415804198838058529541276172566462096075304974533038311360102745")
        ]
    ],
    c: [
        BigNumber.from("17043613045689438061056855140717228692531551742715116345653282458044562913340"),
        BigNumber.from("2370817089159921682686518647883641102271166365792674813892789124915210429511")
    ],
    input: [
        BigNumber.from("1"),
        BigNumber.from("7266121184836080623"),
        BigNumber.from("18452008762427335492603889699117522560425278222635387789816231022087821553722"),
        BigNumber.from("70"),
        BigNumber.from("50")
    ]
};

// Function to call verifyProof
async function sendProof() {
    console.log("Calling zk-SNARK proof verification on zkSync Sepolia...");

    try {
        // Call the view function (no gas needed)
        const result = await contract.verifyProof(proof.a, proof.b, proof.c, proof.input);
        console.log("Proof verification result on zkSync Sepolia:", result);
    } catch (error) {
        console.error("Error verifying proof on zkSync Sepolia:", error);
    }
}

// Execute function
sendProof();
