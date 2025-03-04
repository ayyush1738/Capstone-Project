# Circom Setup and Proof Generation Guide

## Step 1: Clone the Repository
```sh
git clone https://github.com/iden3/circom.git
```

## Step 2: Check Rustup Version
```sh
rustup --version
```

## Step 3: Install Rustup (if not detected)
```sh
iwr -Uri https://win.rustup.rs/ -OutFile rustup-init.exe; Start-Process .\rustup-init.exe -Wait
```

## Step 4: Verify `.cargo` Folder
Check if the `.cargo` folder is detected in your `Program Files` or `Users` directory.

## Step 5: Add Cargo Path (if not added already)
Example path:
```sh
C:\Users\Lenovo\.cargo\bin
```

## Step 6: Navigate to Circom Directory
```sh
cd circom
```

## Step 7: Build Circom
```sh
cargo build --release
```

## Step 8: Install Circom
```sh
cargo install --path circom
```

## Step 9: Verify Circom Version
```sh
circom --version
```
Ensure that it has the latest version installed.

## Step 10: Navigate Back to Root Folder
```sh
cd ..
```

## Step 11: Enter Proof Generation Directory
```sh
cd proof-generation
```

## Step 12: Configure `filter.js`
- Modify `filter.js` with your IPFS configuration.
- Add files from sample outputs to your IPFS.
- Copy the CID to `filter.js` and update the correct URLs.

## Step 13: Install Dependencies
```sh
npm i
```

## Step 14: Run `filter.js`
```sh
node filter.js
```
This will generate an `input.json` file.

## For Every New `input.json`

### Step 15: Generate Witness
```sh
node deepfake_detection_js/generate_witness.js deepfake_detection.wasm input.json witness.wtns
```

### Step 16: Generate Proof
```sh
snarkjs groth16 prove deepfake_detection.zkey witness.wtns proof.json public.json
```

