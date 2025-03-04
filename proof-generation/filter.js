const { create } = require('ipfs-http-client');
const axios = require('axios');
const fs = require('fs');
const { decode } = require('base58-universal');

// Constants
const IPFS_GATEWAY = 'http://127.0.0.1:8080/ipfs';
const ipfs = create({ url: 'http://127.0.0.1:5001' });
const SCALE_FACTOR = 100; // For scaling floating-point numbers

/**
 * Converts a hexadecimal string to a decimal string.
 * @param {string} hex - The hexadecimal string.
 * @returns {string} - The decimal string representation.
 */
const hexToDecimal = (hex) => BigInt(`0x${hex}`).toString(10);

/**
 * Scales a floating-point number to an integer based on the scale factor.
 * @param {number} num - The floating-point number.
 * @param {number} scaleFactor - The scale factor.
 * @returns {string} - The scaled integer as a string.
 */
const scaleFloat = (num, scaleFactor) => Math.round(num * scaleFactor).toString(10);

/**
 * Converts a CIDv0 to a decimal string compatible with Circom.
 * @param {string} cid - The CIDv0 string.
 * @returns {string} - The decimal string representation of the CID.
 */
function cidToDecimal(cid) {
    const bytes = decode(cid);
    const hex = Buffer.from(bytes).toString('hex');
    const bigIntValue = BigInt(`0x${hex}`);
    return bigIntValue.toString(10);
}

/**
 * Fetches JSON data from IPFS and processes it.
 * @param {string} cid - The CID of the IPFS content.
 * @returns {Promise<object|null>} - The processed data or null if an error occurs.
 */
async function fetchFromIPFS(cid) {
    try {
        const response = await axios.get(`${IPFS_GATEWAY}/${cid}`);
        const data = response.data;

        if (!data.video) {
            throw new Error("Invalid JSON structure: Missing 'video' key");
        }

        const videoData = data.video;

        // Extract and convert necessary fields
        const extractedData = {
            pHash: hexToDecimal(videoData.phash),
            cid: cidToDecimal(cid),
            ai_prediction: scaleFloat(Array.isArray(videoData.pred) ? videoData.pred[0] : videoData.pred, SCALE_FACTOR),
            threshold: scaleFloat(0.5, SCALE_FACTOR)
        };

        // Write the transformed data to a JSON file
        fs.writeFileSync('input.json', JSON.stringify(extractedData, null, 4));

        console.log('Transformed data written to input.json');
        return extractedData;
    } catch (error) {
        console.error('Error fetching data from IPFS:', error.message);
        return null;
    }
}

/**
 * Retrieves the latest CID from a given IPFS directory CID.
 * @param {string} directoryCID - The CID of the IPFS directory.
 * @returns {Promise<string|null>} - The latest CID or null if an error occurs.
 */
async function getLatestCID(directoryCID) {
    try {
        let latestCID = null;
        for await (const file of ipfs.ls(directoryCID)) {
            console.log(`Found file: ${file.name}, CID: ${file.cid.toString()}`);
            latestCID = file.cid.toString();
        }
        return latestCID;
    } catch (error) {
        console.error('Error fetching latest CID:', error.message);
        return null;
    }
}

/**
 * Main function to execute the script.
 */
async function main() {
    const directoryCID = 'QmSYngyQTFgzAxkgbWix2erAFZ3ooPzhrprVYhnns6LQJt'; // Replace with your actual directory CID
    const latestCID = await getLatestCID(directoryCID);

    if (latestCID) {
        console.log(`Using latest CID: ${latestCID}`);
        await fetchFromIPFS(latestCID);
    } else {
        console.error('No valid CID found.');
    }
}

// Execute the main function
main();
