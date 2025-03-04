pragma circom 2.0.0;

// Include the circomlib library to access the LessThan template
include "node_modules/circomlib/circuits/comparators.circom";

// Define the DeepfakeDetection template
template DeepfakeDetection(n) {
    signal input pHash;          // Perceptual Hash
    signal input cid;            // IPFS CID
    signal input ai_prediction;  // AI model output
    signal input threshold;      // Fake threshold (e.g., 0.5)
    signal output isFake;        // Result (1 = Fake, 0 = Real)

    // Instantiate the LessThan comparator with the specified bit-width
    component compare = LessThan(n);

    // Assign inputs to the comparator
    compare.in[0] <== threshold;
    compare.in[1] <== ai_prediction;

    // Determine if the AI prediction indicates a fake
    isFake <== compare.out;  // Outputs 1 if ai_prediction >= threshold
}

// Instantiate the main component with public inputs
component main {public [pHash, cid, ai_prediction, threshold]} = DeepfakeDetection(16);
