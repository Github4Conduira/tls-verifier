/* eslint-disable */
import Long from "long";
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "reclaim_backend";

export enum VerificationRequestStatus {
  /** VERIFICATION_REQUEST_STATUS_PENDING - when then requestor initially asks for verification */
  VERIFICATION_REQUEST_STATUS_PENDING = 0,
  /**
   * VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL - when the claimer has responded,
   * waiting for the requestor to accept/reject the proof
   */
  VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL = 1,
  /** VERIFICATION_REQUEST_STATUS_DONE - successfully verified the request */
  VERIFICATION_REQUEST_STATUS_DONE = 2,
  /** VERIFICATION_REQUEST_STATUS_EXPIRED - the request expired, either party failed to respond in time */
  VERIFICATION_REQUEST_STATUS_EXPIRED = 4,
  /** VERIFICATION_REQUEST_STATUS_FAILED - the requestor failed to provide a valid proof */
  VERIFICATION_REQUEST_STATUS_FAILED = 5,
  /** VERIFICATION_REQUEST_STATUS_REJECTED - claimer rejected the request */
  VERIFICATION_REQUEST_STATUS_REJECTED = 6,
  UNRECOGNIZED = -1,
}

export function verificationRequestStatusFromJSON(object: any): VerificationRequestStatus {
  switch (object) {
    case 0:
    case "VERIFICATION_REQUEST_STATUS_PENDING":
      return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING;
    case 1:
    case "VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL":
      return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL;
    case 2:
    case "VERIFICATION_REQUEST_STATUS_DONE":
      return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_DONE;
    case 4:
    case "VERIFICATION_REQUEST_STATUS_EXPIRED":
      return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_EXPIRED;
    case 5:
    case "VERIFICATION_REQUEST_STATUS_FAILED":
      return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_FAILED;
    case 6:
    case "VERIFICATION_REQUEST_STATUS_REJECTED":
      return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_REJECTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VerificationRequestStatus.UNRECOGNIZED;
  }
}

export function verificationRequestStatusToJSON(object: VerificationRequestStatus): string {
  switch (object) {
    case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING:
      return "VERIFICATION_REQUEST_STATUS_PENDING";
    case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL:
      return "VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL";
    case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_DONE:
      return "VERIFICATION_REQUEST_STATUS_DONE";
    case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_EXPIRED:
      return "VERIFICATION_REQUEST_STATUS_EXPIRED";
    case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_FAILED:
      return "VERIFICATION_REQUEST_STATUS_FAILED";
    case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_REJECTED:
      return "VERIFICATION_REQUEST_STATUS_REJECTED";
    case VerificationRequestStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface LinkClaim {
  /** ID of the claim from the smart contract creation */
  id: number;
  /** the chain on which the claim lies */
  chainId: number;
  /** eg. google-login */
  provider: string;
  /**
   * Eg. if parameters = alice@creatoros.co,
   * redactedParameters = *****@creatoros.co
   */
  redactedParameters: string;
  /**
   * public key of the owner address,
   * that generated the claim
   */
  ownerPublicKey: Uint8Array;
  /** when the claim was created */
  timestampS: number;
  /**
   * list of addresses that attested to the claim's validity
   * note: this is the wallet address of the witness & not the host
   * eg. "0x123456789"
   * not required to be submitted in the request. Backend will
   * fetch the witness addresses from the smart contract
   */
  witnessAddresses: string[];
}

export interface Link {
  /** ID of the link; would be unique & pseudo-random */
  id: string;
  /**
   * the user that created the link
   * is blank when requested by anybody other than the creator
   */
  userId: string;
  /** name of the link */
  name: string;
  /** list of claims belonging to the link */
  claims: LinkClaim[];
  /**
   * when the link was created
   * unix timestamp in seconds
   */
  createdAtS: number;
  /** number of views the link has */
  views: number;
}

export interface ClaimProof {
  /** the full parameters of the claim */
  parameters: string;
  /**
   * signatures of the claim done by the witnesses
   * that attested to the claim's validity
   */
  signatures: Uint8Array[];
}

export interface EncryptedClaimProof {
  /** ID of the encrypted claim */
  id: number;
  /** encrypted claim proof */
  enc: Uint8Array;
}

export interface VerificationRequest {
  /** unique ID of this verification request */
  id: string;
  /** the link being verified */
  link:
    | Link
    | undefined;
  /** reason for request; eg.: "we'd like to hire you" */
  context: string;
  /** status of the request */
  status: VerificationRequestStatus;
  /** Ephemeral public key for encrypted communication */
  communicationPublicKey: Uint8Array;
  /**
   * Signature of the ephemeral public key,
   * with the master key of the requestor
   */
  communicationSignature: Uint8Array;
  /** ID of the requestor; their wallet address */
  requestorId: string;
  /** when the request was created */
  createdAtS: number;
  /** when the request was updated */
  updatedAtS: number;
  /** request expiration date; unix timestamp in seconds */
  expiresAtS: number;
  /**
   * proofs sent in by the claimer;
   * should be encrypted "ClaimProof" structure
   */
  encryptedClaimProofs: EncryptedClaimProof[];
}

export interface Pagination {
  page: number;
  pageSize: number;
}

/** empty */
export interface GetServiceMetadataRequest {
}

export interface GetServiceMetadataResponse {
  walletAddress: string;
}

export interface GetLinksRequest {
  /** fetch a link with a specific ID */
  id: string;
  /**
   * if true, increments the view count of the links returned
   * will only increment if ID is set
   */
  view: boolean;
}

export interface GetLinksResponse {
  links: Link[];
}

export interface CreateLinkRequest {
  name: string;
  claims: LinkClaim[];
}

export interface CreateLinkResponse {
  /** ID of the link */
  id: string;
}

export interface UpdateUserRequest {
  /**
   * Token for notifications
   * Pass empty string to remove
   */
  firebaseToken: string;
}

export interface UpdateUserResponse {
}

export interface CreateVerificationRequestRequest {
  /** ID of the link to request verification from */
  linkId: string;
  /** Ephemeral public key for encrypted communication */
  communicationPublicKey: Uint8Array;
  /**
   * Signature of the ephemeral public key,
   * with the master key of the requestor
   */
  communicationSignature: Uint8Array;
  /** reason for the request */
  context: string;
}

export interface CreateVerificationRequestResponse {
  /** id of verification request */
  id: string;
}

export interface AcceptVerificationRequestRequest {
  /** ID of the verification request */
  id: string;
  /**
   * proofs of the claims;
   * for every claim =>
   *  K = DHKE(Pri(claim),communicationPublicKey)
   *  Encrypt(proto(ClaimProof), K)
   */
  encryptedClaimProofs: EncryptedClaimProof[];
}

/** empty */
export interface AcceptVerificationRequestResponse {
}

export interface RejectVerificationRequestRequest {
  /** ID of the verification request */
  id: string;
}

/** empty */
export interface RejectVerificationRequestResponse {
}

export interface SucceedVerificationRequestRequest {
  /** ID of the verification request */
  id: string;
}

/** empty */
export interface SucceedVerificationRequestResponse {
}

export interface FailVerificationRequestRequest {
  /** ID of the verification request */
  id: string;
  /**
   * the private key of the public key earlier
   * submitted in CreateVerificationRequest
   */
  communicationPrivateKey: Uint8Array;
}

/** empty */
export interface FailVerificationRequestResponse {
}

export interface GetVerificationRequestsRequest {
  /** optional ID of the verification request */
  id: string;
  pagination: Pagination | undefined;
}

export interface GetVerificationRequestsResponse {
  requests: VerificationRequest[];
  /** next page of requests; 0 if no more data */
  nextPage: number;
}

export interface StartClaimCreationRequest {
  /**
   * hash of the information in the claim
   * infoHash = Hash(provider,providerParams)
   */
  infoHash: Uint8Array;
  /** signature done by the owner to authorise the claim by QB */
  authorisationSignature: Uint8Array;
  /**
   * unix timestamp (in ms) after which
   * the signature cannot be used anymore
   */
  expiryTimestampMs: number;
  /** token from the captcha check */
  captchaToken: string;
}

export interface StartClaimCreationResponse {
  /** ID of the claim on the smart contract */
  claimId: number;
  /** the chain ID on which the creation was done */
  chainId: number;
  /**
   * the hosts of the witnesses
   * where the user needs to make the request
   */
  witnessHosts: string[];
}

function createBaseLinkClaim(): LinkClaim {
  return {
    id: 0,
    chainId: 0,
    provider: "",
    redactedParameters: "",
    ownerPublicKey: new Uint8Array(),
    timestampS: 0,
    witnessAddresses: [],
  };
}

export const LinkClaim = {
  encode(message: LinkClaim, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.chainId !== 0) {
      writer.uint32(16).uint32(message.chainId);
    }
    if (message.provider !== "") {
      writer.uint32(26).string(message.provider);
    }
    if (message.redactedParameters !== "") {
      writer.uint32(34).string(message.redactedParameters);
    }
    if (message.ownerPublicKey.length !== 0) {
      writer.uint32(42).bytes(message.ownerPublicKey);
    }
    if (message.timestampS !== 0) {
      writer.uint32(48).uint32(message.timestampS);
    }
    for (const v of message.witnessAddresses) {
      writer.uint32(58).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LinkClaim {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLinkClaim();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.chainId = reader.uint32();
          break;
        case 3:
          message.provider = reader.string();
          break;
        case 4:
          message.redactedParameters = reader.string();
          break;
        case 5:
          message.ownerPublicKey = reader.bytes();
          break;
        case 6:
          message.timestampS = reader.uint32();
          break;
        case 7:
          message.witnessAddresses.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LinkClaim {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      chainId: isSet(object.chainId) ? Number(object.chainId) : 0,
      provider: isSet(object.provider) ? String(object.provider) : "",
      redactedParameters: isSet(object.redactedParameters) ? String(object.redactedParameters) : "",
      ownerPublicKey: isSet(object.ownerPublicKey) ? bytesFromBase64(object.ownerPublicKey) : new Uint8Array(),
      timestampS: isSet(object.timestampS) ? Number(object.timestampS) : 0,
      witnessAddresses: Array.isArray(object?.witnessAddresses)
        ? object.witnessAddresses.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: LinkClaim): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.chainId !== undefined && (obj.chainId = Math.round(message.chainId));
    message.provider !== undefined && (obj.provider = message.provider);
    message.redactedParameters !== undefined && (obj.redactedParameters = message.redactedParameters);
    message.ownerPublicKey !== undefined &&
      (obj.ownerPublicKey = base64FromBytes(
        message.ownerPublicKey !== undefined ? message.ownerPublicKey : new Uint8Array(),
      ));
    message.timestampS !== undefined && (obj.timestampS = Math.round(message.timestampS));
    if (message.witnessAddresses) {
      obj.witnessAddresses = message.witnessAddresses.map((e) => e);
    } else {
      obj.witnessAddresses = [];
    }
    return obj;
  },

  create(base?: DeepPartial<LinkClaim>): LinkClaim {
    return LinkClaim.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<LinkClaim>): LinkClaim {
    const message = createBaseLinkClaim();
    message.id = object.id ?? 0;
    message.chainId = object.chainId ?? 0;
    message.provider = object.provider ?? "";
    message.redactedParameters = object.redactedParameters ?? "";
    message.ownerPublicKey = object.ownerPublicKey ?? new Uint8Array();
    message.timestampS = object.timestampS ?? 0;
    message.witnessAddresses = object.witnessAddresses?.map((e) => e) || [];
    return message;
  },
};

function createBaseLink(): Link {
  return { id: "", userId: "", name: "", claims: [], createdAtS: 0, views: 0 };
}

export const Link = {
  encode(message: Link, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    for (const v of message.claims) {
      LinkClaim.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.createdAtS !== 0) {
      writer.uint32(40).uint32(message.createdAtS);
    }
    if (message.views !== 0) {
      writer.uint32(48).uint32(message.views);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Link {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLink();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.claims.push(LinkClaim.decode(reader, reader.uint32()));
          break;
        case 5:
          message.createdAtS = reader.uint32();
          break;
        case 6:
          message.views = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Link {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      name: isSet(object.name) ? String(object.name) : "",
      claims: Array.isArray(object?.claims) ? object.claims.map((e: any) => LinkClaim.fromJSON(e)) : [],
      createdAtS: isSet(object.createdAtS) ? Number(object.createdAtS) : 0,
      views: isSet(object.views) ? Number(object.views) : 0,
    };
  },

  toJSON(message: Link): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.userId !== undefined && (obj.userId = message.userId);
    message.name !== undefined && (obj.name = message.name);
    if (message.claims) {
      obj.claims = message.claims.map((e) => e ? LinkClaim.toJSON(e) : undefined);
    } else {
      obj.claims = [];
    }
    message.createdAtS !== undefined && (obj.createdAtS = Math.round(message.createdAtS));
    message.views !== undefined && (obj.views = Math.round(message.views));
    return obj;
  },

  create(base?: DeepPartial<Link>): Link {
    return Link.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<Link>): Link {
    const message = createBaseLink();
    message.id = object.id ?? "";
    message.userId = object.userId ?? "";
    message.name = object.name ?? "";
    message.claims = object.claims?.map((e) => LinkClaim.fromPartial(e)) || [];
    message.createdAtS = object.createdAtS ?? 0;
    message.views = object.views ?? 0;
    return message;
  },
};

function createBaseClaimProof(): ClaimProof {
  return { parameters: "", signatures: [] };
}

export const ClaimProof = {
  encode(message: ClaimProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parameters !== "") {
      writer.uint32(18).string(message.parameters);
    }
    for (const v of message.signatures) {
      writer.uint32(26).bytes(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClaimProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClaimProof();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.parameters = reader.string();
          break;
        case 3:
          message.signatures.push(reader.bytes());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClaimProof {
    return {
      parameters: isSet(object.parameters) ? String(object.parameters) : "",
      signatures: Array.isArray(object?.signatures) ? object.signatures.map((e: any) => bytesFromBase64(e)) : [],
    };
  },

  toJSON(message: ClaimProof): unknown {
    const obj: any = {};
    message.parameters !== undefined && (obj.parameters = message.parameters);
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
    } else {
      obj.signatures = [];
    }
    return obj;
  },

  create(base?: DeepPartial<ClaimProof>): ClaimProof {
    return ClaimProof.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ClaimProof>): ClaimProof {
    const message = createBaseClaimProof();
    message.parameters = object.parameters ?? "";
    message.signatures = object.signatures?.map((e) => e) || [];
    return message;
  },
};

function createBaseEncryptedClaimProof(): EncryptedClaimProof {
  return { id: 0, enc: new Uint8Array() };
}

export const EncryptedClaimProof = {
  encode(message: EncryptedClaimProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.enc.length !== 0) {
      writer.uint32(18).bytes(message.enc);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedClaimProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedClaimProof();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.enc = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncryptedClaimProof {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      enc: isSet(object.enc) ? bytesFromBase64(object.enc) : new Uint8Array(),
    };
  },

  toJSON(message: EncryptedClaimProof): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.enc !== undefined &&
      (obj.enc = base64FromBytes(message.enc !== undefined ? message.enc : new Uint8Array()));
    return obj;
  },

  create(base?: DeepPartial<EncryptedClaimProof>): EncryptedClaimProof {
    return EncryptedClaimProof.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<EncryptedClaimProof>): EncryptedClaimProof {
    const message = createBaseEncryptedClaimProof();
    message.id = object.id ?? 0;
    message.enc = object.enc ?? new Uint8Array();
    return message;
  },
};

function createBaseVerificationRequest(): VerificationRequest {
  return {
    id: "",
    link: undefined,
    context: "",
    status: 0,
    communicationPublicKey: new Uint8Array(),
    communicationSignature: new Uint8Array(),
    requestorId: "",
    createdAtS: 0,
    updatedAtS: 0,
    expiresAtS: 0,
    encryptedClaimProofs: [],
  };
}

export const VerificationRequest = {
  encode(message: VerificationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.link !== undefined) {
      Link.encode(message.link, writer.uint32(18).fork()).ldelim();
    }
    if (message.context !== "") {
      writer.uint32(26).string(message.context);
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    if (message.communicationPublicKey.length !== 0) {
      writer.uint32(42).bytes(message.communicationPublicKey);
    }
    if (message.communicationSignature.length !== 0) {
      writer.uint32(50).bytes(message.communicationSignature);
    }
    if (message.requestorId !== "") {
      writer.uint32(58).string(message.requestorId);
    }
    if (message.createdAtS !== 0) {
      writer.uint32(64).uint32(message.createdAtS);
    }
    if (message.updatedAtS !== 0) {
      writer.uint32(72).uint32(message.updatedAtS);
    }
    if (message.expiresAtS !== 0) {
      writer.uint32(80).uint32(message.expiresAtS);
    }
    for (const v of message.encryptedClaimProofs) {
      EncryptedClaimProof.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerificationRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerificationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.link = Link.decode(reader, reader.uint32());
          break;
        case 3:
          message.context = reader.string();
          break;
        case 4:
          message.status = reader.int32() as any;
          break;
        case 5:
          message.communicationPublicKey = reader.bytes();
          break;
        case 6:
          message.communicationSignature = reader.bytes();
          break;
        case 7:
          message.requestorId = reader.string();
          break;
        case 8:
          message.createdAtS = reader.uint32();
          break;
        case 9:
          message.updatedAtS = reader.uint32();
          break;
        case 10:
          message.expiresAtS = reader.uint32();
          break;
        case 11:
          message.encryptedClaimProofs.push(EncryptedClaimProof.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): VerificationRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      link: isSet(object.link) ? Link.fromJSON(object.link) : undefined,
      context: isSet(object.context) ? String(object.context) : "",
      status: isSet(object.status) ? verificationRequestStatusFromJSON(object.status) : 0,
      communicationPublicKey: isSet(object.communicationPublicKey)
        ? bytesFromBase64(object.communicationPublicKey)
        : new Uint8Array(),
      communicationSignature: isSet(object.communicationSignature)
        ? bytesFromBase64(object.communicationSignature)
        : new Uint8Array(),
      requestorId: isSet(object.requestorId) ? String(object.requestorId) : "",
      createdAtS: isSet(object.createdAtS) ? Number(object.createdAtS) : 0,
      updatedAtS: isSet(object.updatedAtS) ? Number(object.updatedAtS) : 0,
      expiresAtS: isSet(object.expiresAtS) ? Number(object.expiresAtS) : 0,
      encryptedClaimProofs: Array.isArray(object?.encryptedClaimProofs)
        ? object.encryptedClaimProofs.map((e: any) => EncryptedClaimProof.fromJSON(e))
        : [],
    };
  },

  toJSON(message: VerificationRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.link !== undefined && (obj.link = message.link ? Link.toJSON(message.link) : undefined);
    message.context !== undefined && (obj.context = message.context);
    message.status !== undefined && (obj.status = verificationRequestStatusToJSON(message.status));
    message.communicationPublicKey !== undefined &&
      (obj.communicationPublicKey = base64FromBytes(
        message.communicationPublicKey !== undefined ? message.communicationPublicKey : new Uint8Array(),
      ));
    message.communicationSignature !== undefined &&
      (obj.communicationSignature = base64FromBytes(
        message.communicationSignature !== undefined ? message.communicationSignature : new Uint8Array(),
      ));
    message.requestorId !== undefined && (obj.requestorId = message.requestorId);
    message.createdAtS !== undefined && (obj.createdAtS = Math.round(message.createdAtS));
    message.updatedAtS !== undefined && (obj.updatedAtS = Math.round(message.updatedAtS));
    message.expiresAtS !== undefined && (obj.expiresAtS = Math.round(message.expiresAtS));
    if (message.encryptedClaimProofs) {
      obj.encryptedClaimProofs = message.encryptedClaimProofs.map((e) => e ? EncryptedClaimProof.toJSON(e) : undefined);
    } else {
      obj.encryptedClaimProofs = [];
    }
    return obj;
  },

  create(base?: DeepPartial<VerificationRequest>): VerificationRequest {
    return VerificationRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<VerificationRequest>): VerificationRequest {
    const message = createBaseVerificationRequest();
    message.id = object.id ?? "";
    message.link = (object.link !== undefined && object.link !== null) ? Link.fromPartial(object.link) : undefined;
    message.context = object.context ?? "";
    message.status = object.status ?? 0;
    message.communicationPublicKey = object.communicationPublicKey ?? new Uint8Array();
    message.communicationSignature = object.communicationSignature ?? new Uint8Array();
    message.requestorId = object.requestorId ?? "";
    message.createdAtS = object.createdAtS ?? 0;
    message.updatedAtS = object.updatedAtS ?? 0;
    message.expiresAtS = object.expiresAtS ?? 0;
    message.encryptedClaimProofs = object.encryptedClaimProofs?.map((e) => EncryptedClaimProof.fromPartial(e)) || [];
    return message;
  },
};

function createBasePagination(): Pagination {
  return { page: 0, pageSize: 0 };
}

export const Pagination = {
  encode(message: Pagination, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.page !== 0) {
      writer.uint32(8).uint32(message.page);
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).uint32(message.pageSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Pagination {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePagination();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.page = reader.uint32();
          break;
        case 2:
          message.pageSize = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Pagination {
    return {
      page: isSet(object.page) ? Number(object.page) : 0,
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
    };
  },

  toJSON(message: Pagination): unknown {
    const obj: any = {};
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    return obj;
  },

  create(base?: DeepPartial<Pagination>): Pagination {
    return Pagination.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<Pagination>): Pagination {
    const message = createBasePagination();
    message.page = object.page ?? 0;
    message.pageSize = object.pageSize ?? 0;
    return message;
  },
};

function createBaseGetServiceMetadataRequest(): GetServiceMetadataRequest {
  return {};
}

export const GetServiceMetadataRequest = {
  encode(_: GetServiceMetadataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetServiceMetadataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetServiceMetadataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetServiceMetadataRequest {
    return {};
  },

  toJSON(_: GetServiceMetadataRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<GetServiceMetadataRequest>): GetServiceMetadataRequest {
    return GetServiceMetadataRequest.fromPartial(base ?? {});
  },

  fromPartial(_: DeepPartial<GetServiceMetadataRequest>): GetServiceMetadataRequest {
    const message = createBaseGetServiceMetadataRequest();
    return message;
  },
};

function createBaseGetServiceMetadataResponse(): GetServiceMetadataResponse {
  return { walletAddress: "" };
}

export const GetServiceMetadataResponse = {
  encode(message: GetServiceMetadataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.walletAddress !== "") {
      writer.uint32(10).string(message.walletAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetServiceMetadataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetServiceMetadataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.walletAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetServiceMetadataResponse {
    return { walletAddress: isSet(object.walletAddress) ? String(object.walletAddress) : "" };
  },

  toJSON(message: GetServiceMetadataResponse): unknown {
    const obj: any = {};
    message.walletAddress !== undefined && (obj.walletAddress = message.walletAddress);
    return obj;
  },

  create(base?: DeepPartial<GetServiceMetadataResponse>): GetServiceMetadataResponse {
    return GetServiceMetadataResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<GetServiceMetadataResponse>): GetServiceMetadataResponse {
    const message = createBaseGetServiceMetadataResponse();
    message.walletAddress = object.walletAddress ?? "";
    return message;
  },
};

function createBaseGetLinksRequest(): GetLinksRequest {
  return { id: "", view: false };
}

export const GetLinksRequest = {
  encode(message: GetLinksRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.view === true) {
      writer.uint32(16).bool(message.view);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLinksRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLinksRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.view = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLinksRequest {
    return { id: isSet(object.id) ? String(object.id) : "", view: isSet(object.view) ? Boolean(object.view) : false };
  },

  toJSON(message: GetLinksRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.view !== undefined && (obj.view = message.view);
    return obj;
  },

  create(base?: DeepPartial<GetLinksRequest>): GetLinksRequest {
    return GetLinksRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<GetLinksRequest>): GetLinksRequest {
    const message = createBaseGetLinksRequest();
    message.id = object.id ?? "";
    message.view = object.view ?? false;
    return message;
  },
};

function createBaseGetLinksResponse(): GetLinksResponse {
  return { links: [] };
}

export const GetLinksResponse = {
  encode(message: GetLinksResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.links) {
      Link.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLinksResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLinksResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.links.push(Link.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLinksResponse {
    return { links: Array.isArray(object?.links) ? object.links.map((e: any) => Link.fromJSON(e)) : [] };
  },

  toJSON(message: GetLinksResponse): unknown {
    const obj: any = {};
    if (message.links) {
      obj.links = message.links.map((e) => e ? Link.toJSON(e) : undefined);
    } else {
      obj.links = [];
    }
    return obj;
  },

  create(base?: DeepPartial<GetLinksResponse>): GetLinksResponse {
    return GetLinksResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<GetLinksResponse>): GetLinksResponse {
    const message = createBaseGetLinksResponse();
    message.links = object.links?.map((e) => Link.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreateLinkRequest(): CreateLinkRequest {
  return { name: "", claims: [] };
}

export const CreateLinkRequest = {
  encode(message: CreateLinkRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    for (const v of message.claims) {
      LinkClaim.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateLinkRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateLinkRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.claims.push(LinkClaim.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateLinkRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      claims: Array.isArray(object?.claims) ? object.claims.map((e: any) => LinkClaim.fromJSON(e)) : [],
    };
  },

  toJSON(message: CreateLinkRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    if (message.claims) {
      obj.claims = message.claims.map((e) => e ? LinkClaim.toJSON(e) : undefined);
    } else {
      obj.claims = [];
    }
    return obj;
  },

  create(base?: DeepPartial<CreateLinkRequest>): CreateLinkRequest {
    return CreateLinkRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<CreateLinkRequest>): CreateLinkRequest {
    const message = createBaseCreateLinkRequest();
    message.name = object.name ?? "";
    message.claims = object.claims?.map((e) => LinkClaim.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreateLinkResponse(): CreateLinkResponse {
  return { id: "" };
}

export const CreateLinkResponse = {
  encode(message: CreateLinkResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateLinkResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateLinkResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateLinkResponse {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: CreateLinkResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create(base?: DeepPartial<CreateLinkResponse>): CreateLinkResponse {
    return CreateLinkResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<CreateLinkResponse>): CreateLinkResponse {
    const message = createBaseCreateLinkResponse();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseUpdateUserRequest(): UpdateUserRequest {
  return { firebaseToken: "" };
}

export const UpdateUserRequest = {
  encode(message: UpdateUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.firebaseToken !== "") {
      writer.uint32(18).string(message.firebaseToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.firebaseToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateUserRequest {
    return { firebaseToken: isSet(object.firebaseToken) ? String(object.firebaseToken) : "" };
  },

  toJSON(message: UpdateUserRequest): unknown {
    const obj: any = {};
    message.firebaseToken !== undefined && (obj.firebaseToken = message.firebaseToken);
    return obj;
  },

  create(base?: DeepPartial<UpdateUserRequest>): UpdateUserRequest {
    return UpdateUserRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<UpdateUserRequest>): UpdateUserRequest {
    const message = createBaseUpdateUserRequest();
    message.firebaseToken = object.firebaseToken ?? "";
    return message;
  },
};

function createBaseUpdateUserResponse(): UpdateUserResponse {
  return {};
}

export const UpdateUserResponse = {
  encode(_: UpdateUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateUserResponse {
    return {};
  },

  toJSON(_: UpdateUserResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<UpdateUserResponse>): UpdateUserResponse {
    return UpdateUserResponse.fromPartial(base ?? {});
  },

  fromPartial(_: DeepPartial<UpdateUserResponse>): UpdateUserResponse {
    const message = createBaseUpdateUserResponse();
    return message;
  },
};

function createBaseCreateVerificationRequestRequest(): CreateVerificationRequestRequest {
  return {
    linkId: "",
    communicationPublicKey: new Uint8Array(),
    communicationSignature: new Uint8Array(),
    context: "",
  };
}

export const CreateVerificationRequestRequest = {
  encode(message: CreateVerificationRequestRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.linkId !== "") {
      writer.uint32(10).string(message.linkId);
    }
    if (message.communicationPublicKey.length !== 0) {
      writer.uint32(18).bytes(message.communicationPublicKey);
    }
    if (message.communicationSignature.length !== 0) {
      writer.uint32(26).bytes(message.communicationSignature);
    }
    if (message.context !== "") {
      writer.uint32(34).string(message.context);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateVerificationRequestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateVerificationRequestRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.linkId = reader.string();
          break;
        case 2:
          message.communicationPublicKey = reader.bytes();
          break;
        case 3:
          message.communicationSignature = reader.bytes();
          break;
        case 4:
          message.context = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateVerificationRequestRequest {
    return {
      linkId: isSet(object.linkId) ? String(object.linkId) : "",
      communicationPublicKey: isSet(object.communicationPublicKey)
        ? bytesFromBase64(object.communicationPublicKey)
        : new Uint8Array(),
      communicationSignature: isSet(object.communicationSignature)
        ? bytesFromBase64(object.communicationSignature)
        : new Uint8Array(),
      context: isSet(object.context) ? String(object.context) : "",
    };
  },

  toJSON(message: CreateVerificationRequestRequest): unknown {
    const obj: any = {};
    message.linkId !== undefined && (obj.linkId = message.linkId);
    message.communicationPublicKey !== undefined &&
      (obj.communicationPublicKey = base64FromBytes(
        message.communicationPublicKey !== undefined ? message.communicationPublicKey : new Uint8Array(),
      ));
    message.communicationSignature !== undefined &&
      (obj.communicationSignature = base64FromBytes(
        message.communicationSignature !== undefined ? message.communicationSignature : new Uint8Array(),
      ));
    message.context !== undefined && (obj.context = message.context);
    return obj;
  },

  create(base?: DeepPartial<CreateVerificationRequestRequest>): CreateVerificationRequestRequest {
    return CreateVerificationRequestRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<CreateVerificationRequestRequest>): CreateVerificationRequestRequest {
    const message = createBaseCreateVerificationRequestRequest();
    message.linkId = object.linkId ?? "";
    message.communicationPublicKey = object.communicationPublicKey ?? new Uint8Array();
    message.communicationSignature = object.communicationSignature ?? new Uint8Array();
    message.context = object.context ?? "";
    return message;
  },
};

function createBaseCreateVerificationRequestResponse(): CreateVerificationRequestResponse {
  return { id: "" };
}

export const CreateVerificationRequestResponse = {
  encode(message: CreateVerificationRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateVerificationRequestResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateVerificationRequestResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateVerificationRequestResponse {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: CreateVerificationRequestResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create(base?: DeepPartial<CreateVerificationRequestResponse>): CreateVerificationRequestResponse {
    return CreateVerificationRequestResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<CreateVerificationRequestResponse>): CreateVerificationRequestResponse {
    const message = createBaseCreateVerificationRequestResponse();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseAcceptVerificationRequestRequest(): AcceptVerificationRequestRequest {
  return { id: "", encryptedClaimProofs: [] };
}

export const AcceptVerificationRequestRequest = {
  encode(message: AcceptVerificationRequestRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    for (const v of message.encryptedClaimProofs) {
      EncryptedClaimProof.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AcceptVerificationRequestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAcceptVerificationRequestRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.encryptedClaimProofs.push(EncryptedClaimProof.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AcceptVerificationRequestRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      encryptedClaimProofs: Array.isArray(object?.encryptedClaimProofs)
        ? object.encryptedClaimProofs.map((e: any) => EncryptedClaimProof.fromJSON(e))
        : [],
    };
  },

  toJSON(message: AcceptVerificationRequestRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    if (message.encryptedClaimProofs) {
      obj.encryptedClaimProofs = message.encryptedClaimProofs.map((e) => e ? EncryptedClaimProof.toJSON(e) : undefined);
    } else {
      obj.encryptedClaimProofs = [];
    }
    return obj;
  },

  create(base?: DeepPartial<AcceptVerificationRequestRequest>): AcceptVerificationRequestRequest {
    return AcceptVerificationRequestRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<AcceptVerificationRequestRequest>): AcceptVerificationRequestRequest {
    const message = createBaseAcceptVerificationRequestRequest();
    message.id = object.id ?? "";
    message.encryptedClaimProofs = object.encryptedClaimProofs?.map((e) => EncryptedClaimProof.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAcceptVerificationRequestResponse(): AcceptVerificationRequestResponse {
  return {};
}

export const AcceptVerificationRequestResponse = {
  encode(_: AcceptVerificationRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AcceptVerificationRequestResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAcceptVerificationRequestResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): AcceptVerificationRequestResponse {
    return {};
  },

  toJSON(_: AcceptVerificationRequestResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<AcceptVerificationRequestResponse>): AcceptVerificationRequestResponse {
    return AcceptVerificationRequestResponse.fromPartial(base ?? {});
  },

  fromPartial(_: DeepPartial<AcceptVerificationRequestResponse>): AcceptVerificationRequestResponse {
    const message = createBaseAcceptVerificationRequestResponse();
    return message;
  },
};

function createBaseRejectVerificationRequestRequest(): RejectVerificationRequestRequest {
  return { id: "" };
}

export const RejectVerificationRequestRequest = {
  encode(message: RejectVerificationRequestRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RejectVerificationRequestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRejectVerificationRequestRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RejectVerificationRequestRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: RejectVerificationRequestRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create(base?: DeepPartial<RejectVerificationRequestRequest>): RejectVerificationRequestRequest {
    return RejectVerificationRequestRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<RejectVerificationRequestRequest>): RejectVerificationRequestRequest {
    const message = createBaseRejectVerificationRequestRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseRejectVerificationRequestResponse(): RejectVerificationRequestResponse {
  return {};
}

export const RejectVerificationRequestResponse = {
  encode(_: RejectVerificationRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RejectVerificationRequestResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRejectVerificationRequestResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): RejectVerificationRequestResponse {
    return {};
  },

  toJSON(_: RejectVerificationRequestResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<RejectVerificationRequestResponse>): RejectVerificationRequestResponse {
    return RejectVerificationRequestResponse.fromPartial(base ?? {});
  },

  fromPartial(_: DeepPartial<RejectVerificationRequestResponse>): RejectVerificationRequestResponse {
    const message = createBaseRejectVerificationRequestResponse();
    return message;
  },
};

function createBaseSucceedVerificationRequestRequest(): SucceedVerificationRequestRequest {
  return { id: "" };
}

export const SucceedVerificationRequestRequest = {
  encode(message: SucceedVerificationRequestRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SucceedVerificationRequestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSucceedVerificationRequestRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SucceedVerificationRequestRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: SucceedVerificationRequestRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create(base?: DeepPartial<SucceedVerificationRequestRequest>): SucceedVerificationRequestRequest {
    return SucceedVerificationRequestRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<SucceedVerificationRequestRequest>): SucceedVerificationRequestRequest {
    const message = createBaseSucceedVerificationRequestRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseSucceedVerificationRequestResponse(): SucceedVerificationRequestResponse {
  return {};
}

export const SucceedVerificationRequestResponse = {
  encode(_: SucceedVerificationRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SucceedVerificationRequestResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSucceedVerificationRequestResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): SucceedVerificationRequestResponse {
    return {};
  },

  toJSON(_: SucceedVerificationRequestResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<SucceedVerificationRequestResponse>): SucceedVerificationRequestResponse {
    return SucceedVerificationRequestResponse.fromPartial(base ?? {});
  },

  fromPartial(_: DeepPartial<SucceedVerificationRequestResponse>): SucceedVerificationRequestResponse {
    const message = createBaseSucceedVerificationRequestResponse();
    return message;
  },
};

function createBaseFailVerificationRequestRequest(): FailVerificationRequestRequest {
  return { id: "", communicationPrivateKey: new Uint8Array() };
}

export const FailVerificationRequestRequest = {
  encode(message: FailVerificationRequestRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.communicationPrivateKey.length !== 0) {
      writer.uint32(18).bytes(message.communicationPrivateKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FailVerificationRequestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFailVerificationRequestRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.communicationPrivateKey = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FailVerificationRequestRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      communicationPrivateKey: isSet(object.communicationPrivateKey)
        ? bytesFromBase64(object.communicationPrivateKey)
        : new Uint8Array(),
    };
  },

  toJSON(message: FailVerificationRequestRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.communicationPrivateKey !== undefined &&
      (obj.communicationPrivateKey = base64FromBytes(
        message.communicationPrivateKey !== undefined ? message.communicationPrivateKey : new Uint8Array(),
      ));
    return obj;
  },

  create(base?: DeepPartial<FailVerificationRequestRequest>): FailVerificationRequestRequest {
    return FailVerificationRequestRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<FailVerificationRequestRequest>): FailVerificationRequestRequest {
    const message = createBaseFailVerificationRequestRequest();
    message.id = object.id ?? "";
    message.communicationPrivateKey = object.communicationPrivateKey ?? new Uint8Array();
    return message;
  },
};

function createBaseFailVerificationRequestResponse(): FailVerificationRequestResponse {
  return {};
}

export const FailVerificationRequestResponse = {
  encode(_: FailVerificationRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FailVerificationRequestResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFailVerificationRequestResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): FailVerificationRequestResponse {
    return {};
  },

  toJSON(_: FailVerificationRequestResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<FailVerificationRequestResponse>): FailVerificationRequestResponse {
    return FailVerificationRequestResponse.fromPartial(base ?? {});
  },

  fromPartial(_: DeepPartial<FailVerificationRequestResponse>): FailVerificationRequestResponse {
    const message = createBaseFailVerificationRequestResponse();
    return message;
  },
};

function createBaseGetVerificationRequestsRequest(): GetVerificationRequestsRequest {
  return { id: "", pagination: undefined };
}

export const GetVerificationRequestsRequest = {
  encode(message: GetVerificationRequestsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.pagination !== undefined) {
      Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVerificationRequestsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVerificationRequestsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.pagination = Pagination.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVerificationRequestsRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      pagination: isSet(object.pagination) ? Pagination.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: GetVerificationRequestsRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination ? Pagination.toJSON(message.pagination) : undefined);
    return obj;
  },

  create(base?: DeepPartial<GetVerificationRequestsRequest>): GetVerificationRequestsRequest {
    return GetVerificationRequestsRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<GetVerificationRequestsRequest>): GetVerificationRequestsRequest {
    const message = createBaseGetVerificationRequestsRequest();
    message.id = object.id ?? "";
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? Pagination.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseGetVerificationRequestsResponse(): GetVerificationRequestsResponse {
  return { requests: [], nextPage: 0 };
}

export const GetVerificationRequestsResponse = {
  encode(message: GetVerificationRequestsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.requests) {
      VerificationRequest.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPage !== 0) {
      writer.uint32(16).uint32(message.nextPage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVerificationRequestsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVerificationRequestsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requests.push(VerificationRequest.decode(reader, reader.uint32()));
          break;
        case 2:
          message.nextPage = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVerificationRequestsResponse {
    return {
      requests: Array.isArray(object?.requests) ? object.requests.map((e: any) => VerificationRequest.fromJSON(e)) : [],
      nextPage: isSet(object.nextPage) ? Number(object.nextPage) : 0,
    };
  },

  toJSON(message: GetVerificationRequestsResponse): unknown {
    const obj: any = {};
    if (message.requests) {
      obj.requests = message.requests.map((e) => e ? VerificationRequest.toJSON(e) : undefined);
    } else {
      obj.requests = [];
    }
    message.nextPage !== undefined && (obj.nextPage = Math.round(message.nextPage));
    return obj;
  },

  create(base?: DeepPartial<GetVerificationRequestsResponse>): GetVerificationRequestsResponse {
    return GetVerificationRequestsResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<GetVerificationRequestsResponse>): GetVerificationRequestsResponse {
    const message = createBaseGetVerificationRequestsResponse();
    message.requests = object.requests?.map((e) => VerificationRequest.fromPartial(e)) || [];
    message.nextPage = object.nextPage ?? 0;
    return message;
  },
};

function createBaseStartClaimCreationRequest(): StartClaimCreationRequest {
  return {
    infoHash: new Uint8Array(),
    authorisationSignature: new Uint8Array(),
    expiryTimestampMs: 0,
    captchaToken: "",
  };
}

export const StartClaimCreationRequest = {
  encode(message: StartClaimCreationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.infoHash.length !== 0) {
      writer.uint32(10).bytes(message.infoHash);
    }
    if (message.authorisationSignature.length !== 0) {
      writer.uint32(18).bytes(message.authorisationSignature);
    }
    if (message.expiryTimestampMs !== 0) {
      writer.uint32(24).uint64(message.expiryTimestampMs);
    }
    if (message.captchaToken !== "") {
      writer.uint32(34).string(message.captchaToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartClaimCreationRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartClaimCreationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.infoHash = reader.bytes();
          break;
        case 2:
          message.authorisationSignature = reader.bytes();
          break;
        case 3:
          message.expiryTimestampMs = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.captchaToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartClaimCreationRequest {
    return {
      infoHash: isSet(object.infoHash) ? bytesFromBase64(object.infoHash) : new Uint8Array(),
      authorisationSignature: isSet(object.authorisationSignature)
        ? bytesFromBase64(object.authorisationSignature)
        : new Uint8Array(),
      expiryTimestampMs: isSet(object.expiryTimestampMs) ? Number(object.expiryTimestampMs) : 0,
      captchaToken: isSet(object.captchaToken) ? String(object.captchaToken) : "",
    };
  },

  toJSON(message: StartClaimCreationRequest): unknown {
    const obj: any = {};
    message.infoHash !== undefined &&
      (obj.infoHash = base64FromBytes(message.infoHash !== undefined ? message.infoHash : new Uint8Array()));
    message.authorisationSignature !== undefined &&
      (obj.authorisationSignature = base64FromBytes(
        message.authorisationSignature !== undefined ? message.authorisationSignature : new Uint8Array(),
      ));
    message.expiryTimestampMs !== undefined && (obj.expiryTimestampMs = Math.round(message.expiryTimestampMs));
    message.captchaToken !== undefined && (obj.captchaToken = message.captchaToken);
    return obj;
  },

  create(base?: DeepPartial<StartClaimCreationRequest>): StartClaimCreationRequest {
    return StartClaimCreationRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<StartClaimCreationRequest>): StartClaimCreationRequest {
    const message = createBaseStartClaimCreationRequest();
    message.infoHash = object.infoHash ?? new Uint8Array();
    message.authorisationSignature = object.authorisationSignature ?? new Uint8Array();
    message.expiryTimestampMs = object.expiryTimestampMs ?? 0;
    message.captchaToken = object.captchaToken ?? "";
    return message;
  },
};

function createBaseStartClaimCreationResponse(): StartClaimCreationResponse {
  return { claimId: 0, chainId: 0, witnessHosts: [] };
}

export const StartClaimCreationResponse = {
  encode(message: StartClaimCreationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.claimId !== 0) {
      writer.uint32(8).uint32(message.claimId);
    }
    if (message.chainId !== 0) {
      writer.uint32(16).uint32(message.chainId);
    }
    for (const v of message.witnessHosts) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartClaimCreationResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartClaimCreationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.claimId = reader.uint32();
          break;
        case 2:
          message.chainId = reader.uint32();
          break;
        case 3:
          message.witnessHosts.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartClaimCreationResponse {
    return {
      claimId: isSet(object.claimId) ? Number(object.claimId) : 0,
      chainId: isSet(object.chainId) ? Number(object.chainId) : 0,
      witnessHosts: Array.isArray(object?.witnessHosts) ? object.witnessHosts.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: StartClaimCreationResponse): unknown {
    const obj: any = {};
    message.claimId !== undefined && (obj.claimId = Math.round(message.claimId));
    message.chainId !== undefined && (obj.chainId = Math.round(message.chainId));
    if (message.witnessHosts) {
      obj.witnessHosts = message.witnessHosts.map((e) => e);
    } else {
      obj.witnessHosts = [];
    }
    return obj;
  },

  create(base?: DeepPartial<StartClaimCreationResponse>): StartClaimCreationResponse {
    return StartClaimCreationResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<StartClaimCreationResponse>): StartClaimCreationResponse {
    const message = createBaseStartClaimCreationResponse();
    message.claimId = object.claimId ?? 0;
    message.chainId = object.chainId ?? 0;
    message.witnessHosts = object.witnessHosts?.map((e) => e) || [];
    return message;
  },
};

export type ReclaimBackendDefinition = typeof ReclaimBackendDefinition;
export const ReclaimBackendDefinition = {
  name: "ReclaimBackend",
  fullName: "reclaim_backend.ReclaimBackend",
  methods: {
    /** Get metadata (including wallet address) about the service */
    getServiceMetadata: {
      name: "GetServiceMetadata",
      requestType: GetServiceMetadataRequest,
      requestStream: false,
      responseType: GetServiceMetadataResponse,
      responseStream: false,
      options: {},
    },
    /** get links created by the user */
    getLinks: {
      name: "GetLinks",
      requestType: GetLinksRequest,
      requestStream: false,
      responseType: GetLinksResponse,
      responseStream: false,
      options: {},
    },
    /** create a new link */
    createLink: {
      name: "CreateLink",
      requestType: CreateLinkRequest,
      requestStream: false,
      responseType: CreateLinkResponse,
      responseStream: false,
      options: {},
    },
    /** request verification for a link */
    createVerificationRequest: {
      name: "CreateVerificationRequest",
      requestType: CreateVerificationRequestRequest,
      requestStream: false,
      responseType: CreateVerificationRequestResponse,
      responseStream: false,
      options: {},
    },
    /** as a claimer, accept a verification request */
    acceptVerificationRequest: {
      name: "AcceptVerificationRequest",
      requestType: AcceptVerificationRequestRequest,
      requestStream: false,
      responseType: AcceptVerificationRequestResponse,
      responseStream: false,
      options: {},
    },
    /** as a claimer, reject a verification request */
    rejectVerificationRequest: {
      name: "RejectVerificationRequest",
      requestType: RejectVerificationRequestRequest,
      requestStream: false,
      responseType: RejectVerificationRequestResponse,
      responseStream: false,
      options: {},
    },
    /** as a requestor, mark the verification request as complete */
    succeedVerificationRequest: {
      name: "SucceedVerificationRequest",
      requestType: SucceedVerificationRequestRequest,
      requestStream: false,
      responseType: SucceedVerificationRequestResponse,
      responseStream: false,
      options: {},
    },
    /**
     * as a requestor, mark the verification request as failed;
     * invalid proof submitted by the claimer
     */
    failVerificationRequest: {
      name: "FailVerificationRequest",
      requestType: FailVerificationRequestRequest,
      requestStream: false,
      responseType: FailVerificationRequestResponse,
      responseStream: false,
      options: {},
    },
    /** get verification requests */
    getVerificationRequests: {
      name: "GetVerificationRequests",
      requestType: GetVerificationRequestsRequest,
      requestStream: false,
      responseType: GetVerificationRequestsResponse,
      responseStream: false,
      options: {},
    },
    /** update your own user */
    updateUser: {
      name: "UpdateUser",
      requestType: UpdateUserRequest,
      requestStream: false,
      responseType: UpdateUserResponse,
      responseStream: false,
      options: {},
    },
    /**
     * start claim creation, sponsored by QB
     * Note: this RPC must be authorised by the wallet
     * that is going to create the claim
     */
    startClaimCreation: {
      name: "StartClaimCreation",
      requestType: StartClaimCreationRequest,
      requestStream: false,
      responseType: StartClaimCreationResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface ReclaimBackendServiceImplementation<CallContextExt = {}> {
  /** Get metadata (including wallet address) about the service */
  getServiceMetadata(
    request: GetServiceMetadataRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetServiceMetadataResponse>>;
  /** get links created by the user */
  getLinks(request: GetLinksRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetLinksResponse>>;
  /** create a new link */
  createLink(
    request: CreateLinkRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<CreateLinkResponse>>;
  /** request verification for a link */
  createVerificationRequest(
    request: CreateVerificationRequestRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<CreateVerificationRequestResponse>>;
  /** as a claimer, accept a verification request */
  acceptVerificationRequest(
    request: AcceptVerificationRequestRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<AcceptVerificationRequestResponse>>;
  /** as a claimer, reject a verification request */
  rejectVerificationRequest(
    request: RejectVerificationRequestRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<RejectVerificationRequestResponse>>;
  /** as a requestor, mark the verification request as complete */
  succeedVerificationRequest(
    request: SucceedVerificationRequestRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<SucceedVerificationRequestResponse>>;
  /**
   * as a requestor, mark the verification request as failed;
   * invalid proof submitted by the claimer
   */
  failVerificationRequest(
    request: FailVerificationRequestRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<FailVerificationRequestResponse>>;
  /** get verification requests */
  getVerificationRequests(
    request: GetVerificationRequestsRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetVerificationRequestsResponse>>;
  /** update your own user */
  updateUser(
    request: UpdateUserRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<UpdateUserResponse>>;
  /**
   * start claim creation, sponsored by QB
   * Note: this RPC must be authorised by the wallet
   * that is going to create the claim
   */
  startClaimCreation(
    request: StartClaimCreationRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<StartClaimCreationResponse>>;
}

export interface ReclaimBackendClient<CallOptionsExt = {}> {
  /** Get metadata (including wallet address) about the service */
  getServiceMetadata(
    request: DeepPartial<GetServiceMetadataRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetServiceMetadataResponse>;
  /** get links created by the user */
  getLinks(request: DeepPartial<GetLinksRequest>, options?: CallOptions & CallOptionsExt): Promise<GetLinksResponse>;
  /** create a new link */
  createLink(
    request: DeepPartial<CreateLinkRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<CreateLinkResponse>;
  /** request verification for a link */
  createVerificationRequest(
    request: DeepPartial<CreateVerificationRequestRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<CreateVerificationRequestResponse>;
  /** as a claimer, accept a verification request */
  acceptVerificationRequest(
    request: DeepPartial<AcceptVerificationRequestRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<AcceptVerificationRequestResponse>;
  /** as a claimer, reject a verification request */
  rejectVerificationRequest(
    request: DeepPartial<RejectVerificationRequestRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<RejectVerificationRequestResponse>;
  /** as a requestor, mark the verification request as complete */
  succeedVerificationRequest(
    request: DeepPartial<SucceedVerificationRequestRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<SucceedVerificationRequestResponse>;
  /**
   * as a requestor, mark the verification request as failed;
   * invalid proof submitted by the claimer
   */
  failVerificationRequest(
    request: DeepPartial<FailVerificationRequestRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<FailVerificationRequestResponse>;
  /** get verification requests */
  getVerificationRequests(
    request: DeepPartial<GetVerificationRequestsRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetVerificationRequestsResponse>;
  /** update your own user */
  updateUser(
    request: DeepPartial<UpdateUserRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<UpdateUserResponse>;
  /**
   * start claim creation, sponsored by QB
   * Note: this RPC must be authorised by the wallet
   * that is going to create the claim
   */
  startClaimCreation(
    request: DeepPartial<StartClaimCreationRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<StartClaimCreationResponse>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
