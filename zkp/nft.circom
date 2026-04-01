pragma circom 2.0.0;

template NFTProof() {
    signal input ownerHash;
    signal input expectedOwnerHash;

    signal input collectionId;
    signal input expectedCollectionId;

    // Make expected values PUBLIC
    signal output pubOwnerHash;
    signal output pubCollectionId;

    ownerHash === expectedOwnerHash;
    collectionId === expectedCollectionId;

    pubOwnerHash <== expectedOwnerHash;
    pubCollectionId <== expectedCollectionId;
}

component main = NFTProof();