pragma circom 2.0.0;

include "./chacha20.circom";

component main{public [in]} = ChaCha20(16);