const { expect } = require("chai");
const hre = require("hardhat");

describe("Verifier", function () {
  let verifier;

  beforeEach(async function () {
    const Verifier = await hre.ethers.getContractFactory("Verifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it("Should verify valid proofs", async function () {
    // Using the proof from ../zkp/proof.json
    const validProof = [
      "15267227708852740335196582380883410892178007313451935169005726303280277012715",
      "1490274544344482848758990744063672904269046262261165532203706708322071599441",
      "19787995048963072703495144184962409123837051163363283495202799360107166611250",
      "20499075674602052760365252835955629288320541330708270478981961464442801752258",
      "16307568769597410872716107621672755153473760958836848894414270860385568939673",
      "20228832420283250229960936343284563679018143139563791477694082438130193353665",
      "14086012837051905074803340871516174996146457941371271855386259012160876575958",
      "19209509701722399015102180922867039018956883051030702428229507577421873540715",
    ];

    const publicSignals = ["123", "456"];

    const result = await verifier.verifyProof(validProof, publicSignals);
    expect(result).to.equal(true);
  });

  it("Should reject invalid proofs", async function () {
    const invalidProof = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
    ];

    const publicSignals = ["999", "999"];

    const result = await verifier.verifyProof(invalidProof, publicSignals);
    expect(result).to.equal(false);
  });

  it("Should reject wrong number of public signals", async function () {
    const validProof = [
      "15267227708852740335196582380883410892178007313451935169005726303280277012715",
      "1490274544344482848758990744063672904269046262261165532203706708322071599441",
      "19787995048963072703495144184962409123837051163363283495202799360107166611250",
      "20499075674602052760365252835955629288320541330708270478981961464442801752258",
      "16307568769597410872716107621672755153473760958836848894414270860385568939673",
      "20228832420283250229960936343284563679018143139563791477694082438130193353665",
      "14086012837051905074803340871516174996146457941371271855386259012160876575958",
      "19209509701722399015102180922867039018956883051030702428229507577421873540715",
    ];

    const invalidSignals = ["123"]; // Only 1 signal

    await expect(
      verifier.verifyProof(validProof, invalidSignals)
    ).to.be.revertedWith("Invalid public signals");
  });
});

describe("NFTVerification", function () {
  let nftVerification, verifier;
  const validProof = [
    "15267227708852740335196582380883410892178007313451935169005726303280277012715",
    "1490274544344482848758990744063672904269046262261165532203706708322071599441",
    "19787995048963072703495144184962409123837051163363283495202799360107166611250",
    "20499075674602052760365252835955629288320541330708270478981961464442801752258",
    "16307568769597410872716107621672755153473760958836848894414270860385568939673",
    "20228832420283250229960936343284563679018143139563791477694082438130193353665",
    "14086012837051905074803340871516174996146457941371271855386259012160876575958",
    "19209509701722399015102180922867039018956883051030702428229507577421873540715",
  ];

  beforeEach(async function () {
    const Verifier = await hre.ethers.getContractFactory("Verifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();

    const NFTVerification = await hre.ethers.getContractFactory("NFTVerification");
    nftVerification = await NFTVerification.deploy(verifier.address);
    await nftVerification.deployed();
  });

  it("Should verify NFT ownership with valid proof", async function () {
    const [user] = await hre.ethers.getSigners();
    const publicSignals = ["123", "456"];

    const tx = await nftVerification.verifyNFTOwnership(validProof, publicSignals);
    const receipt = await tx.wait();

    // Check event was emitted
    expect(receipt.events).to.have.length.greaterThan(0);

    // Check user is marked as verified
    const isVerified = await nftVerification.isVerified(user.address);
    expect(isVerified).to.equal(true);
  });

  it("Should track last verification time", async function () {
    const [user] = await hre.ethers.getSigners();
    const publicSignals = ["123", "456"];

    const blockBefore = await hre.ethers.provider.getBlockNumber();
    await nftVerification.verifyNFTOwnership(validProof, publicSignals);
    const blockAfter = await hre.ethers.provider.getBlockNumber();

    const lastTime = await nftVerification.getLastVerificationTime(user.address);
    expect(lastTime).to.be.greaterThan(0);
  });

  it("Should allow clearing verification", async function () {
    const [user] = await hre.ethers.getSigners();
    const publicSignals = ["123", "456"];

    await nftVerification.verifyNFTOwnership(validProof, publicSignals);
    expect(await nftVerification.isVerified(user.address)).to.equal(true);

    await nftVerification.clearVerification(user.address);
    expect(await nftVerification.isVerified(user.address)).to.equal(false);
  });
});
