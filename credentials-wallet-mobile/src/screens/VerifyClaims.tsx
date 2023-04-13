import React, { useCallback, useMemo, useRef } from 'react'
import { SvgXml } from 'react-native-svg'
import { securityLockIconXml } from '@app/assets/svgs'
import BottomSheetView from '@app/components/BottomSheet'
import { BottomSheetFooter, LinkContainer, LinkHeader } from '@app/components/BottomSheet/styles'
import ByAddress from '@app/components/ByAddress'
import CancelButton from '@app/components/CancelButton'
import Card from '@app/components/Card'
import ClaimCardContent from '@app/components/ClaimCardContent'
import { RoundCtaButton } from '@app/components/CtaButton'
import { CtaButton } from '@app/components/CtaButton'
import Footer from '@app/components/Footer'
import LinkView from '@app/components/LinkView'
import LoadingIcon from '@app/components/LoadingIcon'
import { Container } from '@app/components/RequestsView/styles'
import ScreenContainer from '@app/components/ScreenContainer'
import { getClient } from '@app/lib/client'
import messages from '@app/lib/messages.json'
import { ClaimsContainer, FlexColumn, FlexRow, H3, RightView } from '@app/lib/styles/common'
import { BodyEmphasized } from '@app/lib/styles/common'
import theme from '@app/lib/styles/theme'
import { getProviderType } from '@app/lib/utils'
import { PROVIDERS } from '@app/providers'
import { useReduxSelector } from '@app/redux/config'
import { Claim, ClaimStatus, Link } from '@app/redux/links/types'
import { getUserPrivateKey } from '@app/redux/userWallet/selectors'
import { getEphemeralPrivateKey } from '@app/redux/userWallet/selectors'
import { RootStackParamList } from '@app/screens'
import BottomSheet from '@gorhom/bottom-sheet'
import {
	GetVerificationRequestsResponse,
	VerificationRequestStatus,
} from '@questbook/reclaim-client-sdk'
import { ProviderName } from '@questbook/reclaim-node'
import Clipboard from '@react-native-clipboard/clipboard'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { verifyEncryptedClaims } from '@reclaimprotocol/crypto-sdk'
import { utils } from 'ethers'
import { BottomSheetBody } from './styles'

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyClaims'>;

const VerifyClaims: React.FC<Props> = ({ navigation, route }) => {
	const masterPrivateKey = useReduxSelector(getUserPrivateKey)
	const ephemeralPrivateKey = useReduxSelector(getEphemeralPrivateKey)

	const verificationReqId = route.params.id
	const [isOpenShareSheet, setIsOpenShareSheet] = React.useState(false)
	const [request, setRequest] = React.useState<GetVerificationRequestsResponse['requests'][0]>()
	const [tempLink, setTempLink] = React.useState<Link>()
	const [link, setLink] = React.useState<Link>()
	const [loading, setLoading] = React.useState<boolean>(true)

	const client = getClient(masterPrivateKey)

	const copyToClipboard = () => {
		Clipboard.setString(`http://share.reclaimprotocol.org/link/${link?.id}`)
	}

	const bottomSheetRef = useRef<BottomSheet>(null)
	const snapPointsShare = useMemo(() => ['25%', '50%'], [])

	// callbacks
	const handleSheetChanges = useCallback(() => {}, [])

	const getVerificationRequestDetails = async() => {
		if(verificationReqId) {
			const response = await client.getVerificationReq({
				id: verificationReqId,
				pagination: {
					page: 1,
					pageSize: 10,
				},
			})

			const link = response.requests[0].link!

			const formattedLink: Link = {
				...link,
				claims: link.claims.map((claim) => {
					return {
						...claim,
						ownerPublicKey: Buffer.from(claim.ownerPublicKey).toString('hex'),
						internalId: 0,
						status: ClaimStatus.MINTED,
						title: '',
						claimProvider: claim.provider as ProviderName,
						provider: getProviderType(claim.provider),
					}
				}),
			}

			setRequest(response.requests[0])
			setTempLink(formattedLink)
		}
	}

	const verifyClaims = useCallback(async() => {
		const privateKey = utils.arrayify(ephemeralPrivateKey)
		if(tempLink === null || !tempLink?.id) {
			return
		}

		const claims = tempLink?.claims.map((claim: Claim) => {
			const provider = PROVIDERS.find((p) => p.provider === claim.provider) ?? PROVIDERS[0]
			const claimProvider =
        provider?.possibleClaims[claim.claimProvider] ?? provider?.possibleClaims['google-login']
			return {
				id: claim.id,
				provider: claimProvider?.providerName,
				redactedParameters: claim.redactedParameters,
				ownerPublicKey: Buffer.from(claim.ownerPublicKey, 'hex'),
				timestampS: claim.timestampS,
				witnessAddresses: claim.witnessAddresses,
			}
		})

		const proofs = request?.encryptedClaimProofs.map((curRequest) => {
			return {
				enc: Buffer.from(curRequest.enc, 'base64'),
				id: curRequest.id,
			}
		})

		const response = verifyEncryptedClaims(claims, proofs, privateKey)

		const revealedClaims = tempLink?.claims.map((claim: Claim) => {
			return {
				...claim,
				params: JSON.parse(response[claim.id].parameters),
			}
		})
		setLink({ ...tempLink, claims: revealedClaims! })
		setLoading(false)
	}, [tempLink, request])

	React.useEffect(() => {
		getVerificationRequestDetails()
	}, [verificationReqId])

	React.useEffect(() => {
		if(tempLink !== null) {
			if(request?.status === VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_REJECTED) {
				setLink(tempLink)
				setLoading(false)
			} else {
				verifyClaims()
			}
		}
	}, [tempLink, request])

	return (
		<>
			{
				link !== null && link !== undefined && !loading ? (
					<>
						<Footer
							footer={
								<Container>
									<FlexRow>
										<FlexColumn>
											<H3
												color='black'
												weight='700'>
												Only you
											</H3>
											<H3>
												Share to give others access
											</H3>
										</FlexColumn>
										<RightView />
										<RoundCtaButton
											onPress={() => setIsOpenShareSheet(true)}
											text={messages.common.share}
											width='20%'
										/>
									</FlexRow>
								</Container>
							}
							unfocused={isOpenShareSheet}
						>
							<ScreenContainer
								headerLeft={<CancelButton onPress={() => navigation.navigate('NotificationHome')} />}
								title={link.name}
								unfocused={isOpenShareSheet}
							>
								<ByAddress address={link.userId} />
								<H3>
									{link.claims.length}
									{' '}
									{link.claims.length > 1 ? 'claims' : 'claim'}
									{' '}
									. Private
								</H3>
								<ClaimsContainer>
									{
										link?.claims.map((claim: Claim, index: number) => {
											return (
												<Card key={index}>
													<ClaimCardContent
														claim={
															{
																...claim,
																status: ClaimStatus.MINTED,
																timestampS: claim.timestampS,
																witnessAddresses: claim.witnessAddresses,
																redactedParameters: claim.redactedParameters,
															}
														}
														unfocused={isOpenShareSheet}
													/>
												</Card>
											)
										})
									}
								</ClaimsContainer>
							</ScreenContainer>
						</Footer>
						{
							isOpenShareSheet && (
								<BottomSheetView
									title='Share'
									bottomSheetRef={bottomSheetRef}
									snapPoints={snapPointsShare}
									onChange={handleSheetChanges}
									setOpenSheet={setIsOpenShareSheet}
								>
									<LinkView
										linkTitle={link.name}
										owner='owner' />
									<BottomSheetBody>
										<LinkContainer>
											<SvgXml xml={securityLockIconXml} />
											<LinkHeader>
												<BodyEmphasized>
													Only be visible to you
												</BodyEmphasized>
												<H3>
													Links are encrypted by default. To allow others to view it, they need to send
													a request.
												</H3>
											</LinkHeader>
										</LinkContainer>
									</BottomSheetBody>
									<BottomSheetFooter>
										<CtaButton
											text={messages.editLink.copyUrl}
											onPress={copyToClipboard}
											width='48%' />
										<CtaButton
											text={messages.editLink.moreOptions}
											onPress={() => {}}
											width='48%'
											backgroundColor={theme.palette.common.lightGray}
											textColor={theme.palette.common.black}
										/>
									</BottomSheetFooter>
								</BottomSheetView>
							)
						}
					</>
				) : (
					<LoadingIcon />
				)
			}
		</>
	)
}

export default VerifyClaims
