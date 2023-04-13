set -e
echo "building circuit..."
circom circuits/circuit.circom --r1cs --wasm --sym -o resources
mv resources/circuit_js/circuit.wasm resources/circuit.wasm
rm -rf resources/circuit_js
echo "generating verification key..."
snarkjs groth16 setup resources/circuit.r1cs pot/pot18_final.ptau resources/circuit_0000.zkey
snarkjs zkey contribute resources/circuit_0000.zkey resources/circuit_0001.zkey --name="1st Contributor" -v -e=$(openssl rand -hex 10240)
snarkjs zkey contribute resources/circuit_0001.zkey resources/circuit_0002.zkey --name="2nd Contributor" -v -e=$(openssl rand -hex 10240)
# last circuit_000x.zkey should go in here
snarkjs zkey beacon resources/circuit_0002.zkey resources/circuit_final.zkey $(curl https://beacon.nist.gov/beacon/2.0/pulse/last | jq -r ".pulse.outputValue") 20 -n="Final Beacon phase2"
snarkjs zkey verify resources/circuit.r1cs pot/pot18_final.ptau resources/circuit_final.zkey
rm -rf resources/circuit_0000.zkey
rm -rf resources/circuit_0001.zkey
rm -rf resources/circuit_0002.zkey