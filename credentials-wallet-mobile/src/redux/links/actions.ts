import { AppThunk } from '@app/redux/config';

import { addLink, setTempLink, updateClaim, updateLink, updateTempClaim } from "@app/redux/links";
import { ClaimStatus, Link } from "@app/redux/links/types";
import { getEphemeralPrivateKey, getEphemeralPublicKey, getUserPrivateKey, getUserPublicKey } from "@app/redux/userWallet/selectors";
import { Claim } from "@app/redux/links/types";
import {getClient, getNewClientInstance } from "@app/lib/client";
import { generateWallet, getWalletFromPrivateKey, REACT_NATIVE_TLS_CRYPTO } from "@app/lib/utils/crypto";
import { createClaim, CreateClaimOptions, CreateStep, ProviderName } from "@questbook/reclaim-node";
import { createChannel, createClient } from "nice-grpc-web";
import { CommonTransport } from "@questbook/common-grpc-web-transport";
import { Socket } from "net";
import { TLSSocket } from "tls";
import { ReclaimWitnessDefinition } from "@questbook/reclaim-node/lib/proto/api";
import { createRedactedParams } from "@app/lib/utils/helpers";
import uuid from 'react-native-uuid';
import { getLinkById, getTempLink } from "@app/redux/links/selectors";
import { typedCreateAsyncThunk } from "@app/redux/extraConfig";
import { ProviderData } from "@app/providers";
import { transformLink } from '@app/redux/links/transforms';


const claimAlreadyExists = (link: Link, claim: Claim) => {
  return link.claims.some((existingClaim) => existingClaim.id === claim.id);
}

export const submitTempLink = typedCreateAsyncThunk<void, {}>(
  'links/submitTempLinkStatus',
  async ({}, { dispatch, getState }) => {
    const tempLink = getTempLink(getState());
    const privateKey = getUserPrivateKey(getState());

    const claimsListOutput = tempLink.claims.map((claim) => {
      return {
        id: claim.id,
        chainId: 420,
        provider: claim.claimProvider as string,
        redactedParameters: claim.redactedParameters,
        ownerPublicKey: Buffer.from(claim.ownerPublicKey, 'hex'),
        timestampS: claim.timestampS,
        witnessAddresses: claim.witnessAddresses,
      };
    });

    const client = getClient(privateKey);

    const response = await client.createLink({
      name: tempLink.name,
      claims: claimsListOutput,
    });

    const claimsListInput = tempLink.claims.map((claim) => {
      return {
        ...claim,
        ownerpublickey: Buffer.from(claim.ownerPublicKey).toString('hex'),
      };
    });

    const link = {
      ...tempLink,
      createdAtS: Math.floor(Date.now() / 1000),
      id: response.id,
      claims: claimsListInput,
    };

    dispatch(addLink(link));
  }
);

export const addClaim = typedCreateAsyncThunk<
  void,
  {
    id?: number;
    provider: ProviderData;
    claimName: ProviderName;
    link: Link;
    inputParams?: CreateClaimOptions<ProviderName>['params'];
    isTemp?: boolean;
    retry?: boolean;
  }
>(
  'links/addClaimStatus',
  async ({ id, provider, claimName, link, isTemp, inputParams }, { dispatch, getState }) => {
    const privateKey = getUserPrivateKey(getState());

    const ephemeralPublicKey = getEphemeralPublicKey(getState());
    const ephemeralPrivateKey = getEphemeralPrivateKey(getState());

    const claim = provider.possibleClaims[claimName];
    if (!claim) throw Error('Claim not found');

    const params = inputParams ?? claim.getParams(getState());
    let secretParams = claim.getSecretParams(getState());


    if (claim.providerName === 'github-contributor') {
      secretParams = {
        ...secretParams,
        ...params,
      };
    }   
   

    console.log("Provider is: ", provider.provider)
    console.log("Claim name is: ", claimName);

    const newClaim: Claim = {
      internalId: id ?? link.claims.length,
      id: 0,
      chainId: 420,
      title: 'untitled',
      provider: provider.provider,
      params,
      claimProvider: claimName,
      status: ClaimStatus.PENDING,
      ownerPublicKey: ephemeralPublicKey,
      timestampS: Math.floor(Date.now() / 1000),
      redactedParameters: '',
      witnessAddresses: [],
    };

    if(claimAlreadyExists(link, newClaim)) return;
 

    const updatedLink = {
      ...link,
      claims: [...link.claims, newClaim],
    };

    if (isTemp) dispatch(setTempLink(updatedLink));
    else dispatch(updateLink(updatedLink));

    const client = getClient(privateKey);
    const requestor = await client.getServiceMetadata();

    const ephemeralWallet = getWalletFromPrivateKey(ephemeralPrivateKey);
    const ephemeralWalletClient = getNewClientInstance(ephemeralPrivateKey);

    try{
      const response = await createClaim({
        name: claimName,
        params,
        secretParams,
        additionalConnectOpts: {
          crypto: REACT_NATIVE_TLS_CRYPTO,
        },
        didUpdateCreateStep: (step: CreateStep) => {
          const updatedClaim = {
            ...newClaim,
            statusMessage: step.name
          };
          if(isTemp) dispatch(setTempLink({ ...link, claims: [...link.claims, updatedClaim] }));
          dispatch(updateClaim({ link: updatedLink, claim: updatedClaim }));
        },
        makeGrpcClient: (grpcUrl) => {
          const channel = createChannel(
            grpcUrl,
            CommonTransport({
              makeSocket: () => new Socket(),
              makeTLSSocket: (socket) => new TLSSocket(socket),
            })
          );
          const client = createClient(ReclaimWitnessDefinition, channel);
          return client;
        },
        requestCreate: async (infoHash) => {
          const result = await ephemeralWalletClient.startClaimCreation(
            ephemeralWallet,
            requestor.walletAddress,
            infoHash
          );
          return result;
        },
      });
  
      const claimData = response.claimData;
      const paramObj = JSON.parse(claimData.parameters);
      const paramKey = Object.keys(paramObj)[0];
      const verifiedClaim: Claim = {
        ...newClaim,
        id: claimData.claimId,
        signatures: response.signatures,
        timestampS: claimData.timestampS,
        witnessAddresses: response.witnessHosts,
        ownerPublicKey: ephemeralPublicKey,
        status: ClaimStatus.MINTED,
        redactedParameters: createRedactedParams(
          paramObj[paramKey],
          paramKey,
          claimName,
          )
      };
  
      const updatedTempLink = {
        ...link,
        claims: [...link.claims, verifiedClaim],
      };
  
      if (isTemp) {
        dispatch(setTempLink(updatedTempLink));
      } else dispatch(updateClaim({ link: updatedLink, claim: verifiedClaim }));
    }
    catch(e){
      const rejectedClaim = {
        ...newClaim,
        status: ClaimStatus.REJECTED,
        errorMessage: e!.toString()
      };
      const updatedTempLink = {
        ...link,
        claims: [...link.claims, rejectedClaim],
      };
      if (isTemp) {
        dispatch(setTempLink(updatedTempLink));
      } else dispatch(updateClaim({ link: updatedLink, claim: rejectedClaim }));
    }
  }
);

export const createNewLink =
  (publicKey: string): AppThunk =>
  (dispatch) => {
    const link: Link = {
      id: uuid.v4().toString(),
      name: '',
      claims: [],
      userId: publicKey,
      createdAtS: Math.floor(Date.now() / 1000),
      views: 0,
    };
    dispatch(setTempLink(link));
};

export const fetchLinkDetails = (linkId: string): AppThunk => async (dispatch, getState) => {
	const privateKey = getUserPrivateKey(getState());

	const storedLink = getLinkById(linkId)(getState());
	if(storedLink) return storedLink;

	const client = getClient(privateKey, true);
	const response = await client.getLinks({ id: linkId, view: true });

  const link = transformLink(response.links[0]);
	dispatch(addLink(link));
}