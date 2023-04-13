declare function makeGrpcClient(privateKey: string): Promise<import("nice-grpc-web").RawClient<import("nice-grpc-web/lib/service-definitions/ts-proto").FromTsProtoServiceDefinition<{
    readonly name: "ReclaimBackend";
    readonly fullName: "reclaim_backend.ReclaimBackend";
    readonly methods: {
        readonly getServiceMetadata: {
            readonly name: "GetServiceMetadata";
            readonly requestType: {
                encode(_: import("../proto").GetServiceMetadataRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").GetServiceMetadataRequest;
                fromJSON(_: any): import("../proto").GetServiceMetadataRequest;
                toJSON(_: import("../proto").GetServiceMetadataRequest): unknown;
                create(base?: {} | undefined): import("../proto").GetServiceMetadataRequest;
                fromPartial(_: {}): import("../proto").GetServiceMetadataRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: import("../proto").GetServiceMetadataResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").GetServiceMetadataResponse;
                fromJSON(object: any): import("../proto").GetServiceMetadataResponse;
                toJSON(message: import("../proto").GetServiceMetadataResponse): unknown;
                create(base?: {
                    walletAddress?: string | undefined;
                } | undefined): import("../proto").GetServiceMetadataResponse;
                fromPartial(object: {
                    walletAddress?: string | undefined;
                }): import("../proto").GetServiceMetadataResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getLinks: {
            readonly name: "GetLinks";
            readonly requestType: {
                encode(message: import("../proto").GetLinksRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").GetLinksRequest;
                fromJSON(object: any): import("../proto").GetLinksRequest;
                toJSON(message: import("../proto").GetLinksRequest): unknown;
                create(base?: {
                    id?: string | undefined;
                    view?: boolean | undefined;
                } | undefined): import("../proto").GetLinksRequest;
                fromPartial(object: {
                    id?: string | undefined;
                    view?: boolean | undefined;
                }): import("../proto").GetLinksRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: import("../proto").GetLinksResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").GetLinksResponse;
                fromJSON(object: any): import("../proto").GetLinksResponse;
                toJSON(message: import("../proto").GetLinksResponse): unknown;
                create(base?: {
                    links?: {
                        id?: string | undefined;
                        userId?: string | undefined;
                        name?: string | undefined;
                        claims?: {
                            id?: number | undefined;
                            chainId?: number | undefined;
                            provider?: string | undefined;
                            redactedParameters?: string | undefined;
                            ownerPublicKey?: Uint8Array | undefined;
                            timestampS?: number | undefined;
                            witnessAddresses?: string[] | undefined;
                        }[] | undefined;
                        createdAtS?: number | undefined;
                        views?: number | undefined;
                    }[] | undefined;
                } | undefined): import("../proto").GetLinksResponse;
                fromPartial(object: {
                    links?: {
                        id?: string | undefined;
                        userId?: string | undefined;
                        name?: string | undefined;
                        claims?: {
                            id?: number | undefined;
                            chainId?: number | undefined;
                            provider?: string | undefined;
                            redactedParameters?: string | undefined;
                            ownerPublicKey?: Uint8Array | undefined;
                            timestampS?: number | undefined;
                            witnessAddresses?: string[] | undefined;
                        }[] | undefined;
                        createdAtS?: number | undefined;
                        views?: number | undefined;
                    }[] | undefined;
                }): import("../proto").GetLinksResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly createLink: {
            readonly name: "CreateLink";
            readonly requestType: {
                encode(message: import("../proto").CreateLinkRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").CreateLinkRequest;
                fromJSON(object: any): import("../proto").CreateLinkRequest;
                toJSON(message: import("../proto").CreateLinkRequest): unknown;
                create(base?: {
                    name?: string | undefined;
                    claims?: {
                        id?: number | undefined;
                        chainId?: number | undefined;
                        provider?: string | undefined;
                        redactedParameters?: string | undefined;
                        ownerPublicKey?: Uint8Array | undefined;
                        timestampS?: number | undefined;
                        witnessAddresses?: string[] | undefined;
                    }[] | undefined;
                } | undefined): import("../proto").CreateLinkRequest;
                fromPartial(object: {
                    name?: string | undefined;
                    claims?: {
                        id?: number | undefined;
                        chainId?: number | undefined;
                        provider?: string | undefined;
                        redactedParameters?: string | undefined;
                        ownerPublicKey?: Uint8Array | undefined;
                        timestampS?: number | undefined;
                        witnessAddresses?: string[] | undefined;
                    }[] | undefined;
                }): import("../proto").CreateLinkRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: import("../proto").CreateLinkResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").CreateLinkResponse;
                fromJSON(object: any): import("../proto").CreateLinkResponse;
                toJSON(message: import("../proto").CreateLinkResponse): unknown;
                create(base?: {
                    id?: string | undefined;
                } | undefined): import("../proto").CreateLinkResponse;
                fromPartial(object: {
                    id?: string | undefined;
                }): import("../proto").CreateLinkResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly createVerificationRequest: {
            readonly name: "CreateVerificationRequest";
            readonly requestType: {
                encode(message: import("../proto").CreateVerificationRequestRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").CreateVerificationRequestRequest;
                fromJSON(object: any): import("../proto").CreateVerificationRequestRequest;
                toJSON(message: import("../proto").CreateVerificationRequestRequest): unknown;
                create(base?: {
                    linkId?: string | undefined;
                    communicationPublicKey?: Uint8Array | undefined;
                    communicationSignature?: Uint8Array | undefined;
                    context?: string | undefined;
                } | undefined): import("../proto").CreateVerificationRequestRequest;
                fromPartial(object: {
                    linkId?: string | undefined;
                    communicationPublicKey?: Uint8Array | undefined;
                    communicationSignature?: Uint8Array | undefined;
                    context?: string | undefined;
                }): import("../proto").CreateVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: import("../proto").CreateVerificationRequestResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").CreateVerificationRequestResponse;
                fromJSON(object: any): import("../proto").CreateVerificationRequestResponse;
                toJSON(message: import("../proto").CreateVerificationRequestResponse): unknown;
                create(base?: {
                    id?: string | undefined;
                } | undefined): import("../proto").CreateVerificationRequestResponse;
                fromPartial(object: {
                    id?: string | undefined;
                }): import("../proto").CreateVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly acceptVerificationRequest: {
            readonly name: "AcceptVerificationRequest";
            readonly requestType: {
                encode(message: import("../proto").AcceptVerificationRequestRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").AcceptVerificationRequestRequest;
                fromJSON(object: any): import("../proto").AcceptVerificationRequestRequest;
                toJSON(message: import("../proto").AcceptVerificationRequestRequest): unknown;
                create(base?: {
                    id?: string | undefined;
                    encryptedClaimProofs?: {
                        id?: number | undefined;
                        enc?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined): import("../proto").AcceptVerificationRequestRequest;
                fromPartial(object: {
                    id?: string | undefined;
                    encryptedClaimProofs?: {
                        id?: number | undefined;
                        enc?: Uint8Array | undefined;
                    }[] | undefined;
                }): import("../proto").AcceptVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: import("../proto").AcceptVerificationRequestResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").AcceptVerificationRequestResponse;
                fromJSON(_: any): import("../proto").AcceptVerificationRequestResponse;
                toJSON(_: import("../proto").AcceptVerificationRequestResponse): unknown;
                create(base?: {} | undefined): import("../proto").AcceptVerificationRequestResponse;
                fromPartial(_: {}): import("../proto").AcceptVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly rejectVerificationRequest: {
            readonly name: "RejectVerificationRequest";
            readonly requestType: {
                encode(message: import("../proto").RejectVerificationRequestRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").RejectVerificationRequestRequest;
                fromJSON(object: any): import("../proto").RejectVerificationRequestRequest;
                toJSON(message: import("../proto").RejectVerificationRequestRequest): unknown;
                create(base?: {
                    id?: string | undefined;
                } | undefined): import("../proto").RejectVerificationRequestRequest;
                fromPartial(object: {
                    id?: string | undefined;
                }): import("../proto").RejectVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: import("../proto").RejectVerificationRequestResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").RejectVerificationRequestResponse;
                fromJSON(_: any): import("../proto").RejectVerificationRequestResponse;
                toJSON(_: import("../proto").RejectVerificationRequestResponse): unknown;
                create(base?: {} | undefined): import("../proto").RejectVerificationRequestResponse;
                fromPartial(_: {}): import("../proto").RejectVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly succeedVerificationRequest: {
            readonly name: "SucceedVerificationRequest";
            readonly requestType: {
                encode(message: import("../proto").SucceedVerificationRequestRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").SucceedVerificationRequestRequest;
                fromJSON(object: any): import("../proto").SucceedVerificationRequestRequest;
                toJSON(message: import("../proto").SucceedVerificationRequestRequest): unknown;
                create(base?: {
                    id?: string | undefined;
                } | undefined): import("../proto").SucceedVerificationRequestRequest;
                fromPartial(object: {
                    id?: string | undefined;
                }): import("../proto").SucceedVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: import("../proto").SucceedVerificationRequestResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").SucceedVerificationRequestResponse;
                fromJSON(_: any): import("../proto").SucceedVerificationRequestResponse;
                toJSON(_: import("../proto").SucceedVerificationRequestResponse): unknown;
                create(base?: {} | undefined): import("../proto").SucceedVerificationRequestResponse;
                fromPartial(_: {}): import("../proto").SucceedVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly failVerificationRequest: {
            readonly name: "FailVerificationRequest";
            readonly requestType: {
                encode(message: import("../proto").FailVerificationRequestRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").FailVerificationRequestRequest;
                fromJSON(object: any): import("../proto").FailVerificationRequestRequest;
                toJSON(message: import("../proto").FailVerificationRequestRequest): unknown;
                create(base?: {
                    id?: string | undefined;
                    communicationPrivateKey?: Uint8Array | undefined;
                } | undefined): import("../proto").FailVerificationRequestRequest;
                fromPartial(object: {
                    id?: string | undefined;
                    communicationPrivateKey?: Uint8Array | undefined;
                }): import("../proto").FailVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: import("../proto").FailVerificationRequestResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").FailVerificationRequestResponse;
                fromJSON(_: any): import("../proto").FailVerificationRequestResponse;
                toJSON(_: import("../proto").FailVerificationRequestResponse): unknown;
                create(base?: {} | undefined): import("../proto").FailVerificationRequestResponse;
                fromPartial(_: {}): import("../proto").FailVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getVerificationRequests: {
            readonly name: "GetVerificationRequests";
            readonly requestType: {
                encode(message: import("../proto").GetVerificationRequestsRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").GetVerificationRequestsRequest;
                fromJSON(object: any): import("../proto").GetVerificationRequestsRequest;
                toJSON(message: import("../proto").GetVerificationRequestsRequest): unknown;
                create(base?: {
                    id?: string | undefined;
                    pagination?: {
                        page?: number | undefined;
                        pageSize?: number | undefined;
                    } | undefined;
                } | undefined): import("../proto").GetVerificationRequestsRequest;
                fromPartial(object: {
                    id?: string | undefined;
                    pagination?: {
                        page?: number | undefined;
                        pageSize?: number | undefined;
                    } | undefined;
                }): import("../proto").GetVerificationRequestsRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: import("../proto").GetVerificationRequestsResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").GetVerificationRequestsResponse;
                fromJSON(object: any): import("../proto").GetVerificationRequestsResponse;
                toJSON(message: import("../proto").GetVerificationRequestsResponse): unknown;
                create(base?: {
                    requests?: {
                        id?: string | undefined;
                        link?: {
                            id?: string | undefined;
                            userId?: string | undefined;
                            name?: string | undefined;
                            claims?: {
                                id?: number | undefined;
                                chainId?: number | undefined;
                                provider?: string | undefined;
                                redactedParameters?: string | undefined;
                                ownerPublicKey?: Uint8Array | undefined;
                                timestampS?: number | undefined;
                                witnessAddresses?: string[] | undefined;
                            }[] | undefined;
                            createdAtS?: number | undefined;
                            views?: number | undefined;
                        } | undefined;
                        context?: string | undefined;
                        status?: import("../proto").VerificationRequestStatus | undefined;
                        communicationPublicKey?: Uint8Array | undefined;
                        communicationSignature?: Uint8Array | undefined;
                        requestorId?: string | undefined;
                        createdAtS?: number | undefined;
                        updatedAtS?: number | undefined;
                        expiresAtS?: number | undefined;
                        encryptedClaimProofs?: {
                            id?: number | undefined;
                            enc?: Uint8Array | undefined;
                        }[] | undefined;
                    }[] | undefined;
                    nextPage?: number | undefined;
                } | undefined): import("../proto").GetVerificationRequestsResponse;
                fromPartial(object: {
                    requests?: {
                        id?: string | undefined;
                        link?: {
                            id?: string | undefined;
                            userId?: string | undefined;
                            name?: string | undefined;
                            claims?: {
                                id?: number | undefined;
                                chainId?: number | undefined;
                                provider?: string | undefined;
                                redactedParameters?: string | undefined;
                                ownerPublicKey?: Uint8Array | undefined;
                                timestampS?: number | undefined;
                                witnessAddresses?: string[] | undefined;
                            }[] | undefined;
                            createdAtS?: number | undefined;
                            views?: number | undefined;
                        } | undefined;
                        context?: string | undefined;
                        status?: import("../proto").VerificationRequestStatus | undefined;
                        communicationPublicKey?: Uint8Array | undefined;
                        communicationSignature?: Uint8Array | undefined;
                        requestorId?: string | undefined;
                        createdAtS?: number | undefined;
                        updatedAtS?: number | undefined;
                        expiresAtS?: number | undefined;
                        encryptedClaimProofs?: {
                            id?: number | undefined;
                            enc?: Uint8Array | undefined;
                        }[] | undefined;
                    }[] | undefined;
                    nextPage?: number | undefined;
                }): import("../proto").GetVerificationRequestsResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly updateUser: {
            readonly name: "UpdateUser";
            readonly requestType: {
                encode(message: import("../proto").UpdateUserRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").UpdateUserRequest;
                fromJSON(object: any): import("../proto").UpdateUserRequest;
                toJSON(message: import("../proto").UpdateUserRequest): unknown;
                create(base?: {
                    firebaseToken?: string | undefined;
                } | undefined): import("../proto").UpdateUserRequest;
                fromPartial(object: {
                    firebaseToken?: string | undefined;
                }): import("../proto").UpdateUserRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: import("../proto").UpdateUserResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").UpdateUserResponse;
                fromJSON(_: any): import("../proto").UpdateUserResponse;
                toJSON(_: import("../proto").UpdateUserResponse): unknown;
                create(base?: {} | undefined): import("../proto").UpdateUserResponse;
                fromPartial(_: {}): import("../proto").UpdateUserResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        readonly startClaimCreation: {
            readonly name: "StartClaimCreation";
            readonly requestType: {
                encode(message: import("../proto").StartClaimCreationRequest, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").StartClaimCreationRequest;
                fromJSON(object: any): import("../proto").StartClaimCreationRequest;
                toJSON(message: import("../proto").StartClaimCreationRequest): unknown;
                create(base?: {
                    infoHash?: Uint8Array | undefined;
                    authorisationSignature?: Uint8Array | undefined;
                    expiryTimestampMs?: number | undefined;
                    captchaToken?: string | undefined;
                } | undefined): import("../proto").StartClaimCreationRequest;
                fromPartial(object: {
                    infoHash?: Uint8Array | undefined;
                    authorisationSignature?: Uint8Array | undefined;
                    expiryTimestampMs?: number | undefined;
                    captchaToken?: string | undefined;
                }): import("../proto").StartClaimCreationRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: import("../proto").StartClaimCreationResponse, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
                decode(input: Uint8Array | import("protobufjs").Reader, length?: number | undefined): import("../proto").StartClaimCreationResponse;
                fromJSON(object: any): import("../proto").StartClaimCreationResponse;
                toJSON(message: import("../proto").StartClaimCreationResponse): unknown;
                create(base?: {
                    claimId?: number | undefined;
                    chainId?: number | undefined;
                    witnessHosts?: string[] | undefined;
                } | undefined): import("../proto").StartClaimCreationResponse;
                fromPartial(object: {
                    claimId?: number | undefined;
                    chainId?: number | undefined;
                    witnessHosts?: string[] | undefined;
                }): import("../proto").StartClaimCreationResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
    };
}>, {}>>;
export { makeGrpcClient };
