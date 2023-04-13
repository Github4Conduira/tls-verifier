import React from 'react';
import {
  BodyEmphasized,
  FlexColumn,
  H1,
  H2,
  H3,
  makeMarginTopComponent,
  makeMarginBottomComponent,
  MetaActionBar,
} from '@app/lib/styles/common';
import CancelButton from '@app/components/CancelButton';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { addLink, updateLink } from '@app/redux/links';
import { getUserPublicKey } from '@app/redux/userWallet/selectors';
import { getLastLink, getLinkById } from '@app/redux/links/selectors';
import { RoundCtaButton } from '@app/components/CtaButton';
import theme from '@app/lib/styles/theme';
import ScreenContainer from '@app/components/ScreenContainer';
import Card from '@app/components/Card';
import { Template as TemplateType, TemplateClaim } from '@app/redux/templates/types';
import { transformBaseTemplate } from '@app/redux/templates/transforms';
import ClaimCardContent from '@app/components/ClaimCardContent';
import { getClaimByIdFromLink, getVerifiedClaimsLength } from '@app/redux/links/utils';
import { isAppLoading } from '@app/redux/selectors';
import LoadingIcon from '@app/components/LoadingIcon';
import { addClaim } from '@app/redux/links/actions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/screens';
import { isBaseTemplate, makePayload } from '@app/redux/templates/utils';
import PossibleClaimCard from '@app/components/PossibleClaimCard';
import { getProviderData } from '@app/providers/utils';
import WebView from 'react-native-webview';

type Props = NativeStackScreenProps<RootStackParamList, 'Template'>;

const MarginBottom = makeMarginBottomComponent(0);
const MarginTop = makeMarginTopComponent(0);

const Template: React.FC<Props> = ({ navigation, route }) => {
	const { template: baseTemplate, claimToAdd } = route.params
    const [loading, setLoading] = React.useState(false);

    const [template, setTemplate] = React.useState<TemplateType | undefined>();

    React.useEffect(() => {
        if(isBaseTemplate(baseTemplate))
            setTemplate(transformBaseTemplate(baseTemplate))
        else
            setTemplate(baseTemplate)
    }, [baseTemplate]);

    const dispatch = useReduxDispatch();
    const publicKey = useReduxSelector(getUserPublicKey);
    const link = useReduxSelector(getLinkById(template?.id));

    React.useEffect(() => {
        if(!publicKey || !dispatch || !template) {
            return
        }
        if(link === undefined)
            dispatch(
                addLink({
                    id: template.id,
                    name: template.name,
                    claims: [],
                    userId: publicKey,
                    createdAtS: Math.floor(Date.now() / 1000),
                    views: 0,
                    template,
                    isSubmitted: false
                }),
            );
    }, [publicKey, dispatch, template, link])
    
    React.useEffect(() => {
        if(claimToAdd && link) {
            const provider = getProviderData(claimToAdd.provider);

            if(claimToAdd.params)
                dispatch(addClaim({ id: claimToAdd.id, provider, claimName: claimToAdd.claimProvider, link, inputParams: claimToAdd.params }));
            else
                dispatch(addClaim({ id: claimToAdd.id, provider, claimName: claimToAdd.claimProvider, link }));
                
            navigation.replace('Template', { template: baseTemplate });
        }
    }, [claimToAdd, link, dispatch]);

    const handleCreateClaim = React.useCallback(async (claim: TemplateClaim) => {
        if(link === undefined) return;
        try{
            const provider = getProviderData(claim.provider);

            navigation.navigate('Providers', {
                screen: provider.provider,
                params: {
                    screen: 'Authentication',
                    params: {
                        returnScreen: ['Template', {
                            template: baseTemplate,
                            claimToAdd: claim,
                        }]
                    }
                }
            });
        } catch(e){
            console.log(e);
        }
    }, [dispatch, link]);

    const isLoading = useReduxSelector(isAppLoading);
    const isComplete =
        link && getVerifiedClaimsLength(link) === template?.claims.length && !link.isSubmitted;

    if (isLoading || loading || !template || !link ) return <LoadingIcon />;
    if(link.isSubmitted){
        return  <ScreenContainer
            headerLeft={<CancelButton onPress={() => navigation.navigate('YourLinks')} />}
            headerMiddle={<H2>Template Submit</H2>}
        >
            <WebView
                source={{uri: template.callbackUrl, body: encodeURIComponent(JSON.stringify(makePayload(link))), method:'POST' }}
            />
        </ScreenContainer>
    }
    return (
        <ScreenContainer
        navigation={navigation}
        headerLeft={<CancelButton onPress={() => navigation.navigate('YourLinks')} />}
        footer={
            <>
            <MetaActionBar>
                <FlexColumn>
                <BodyEmphasized>
                    {`${getVerifiedClaimsLength(link)} of ${template.claims.length} claims verified`}
                </BodyEmphasized>
                </FlexColumn>
                <RoundCtaButton
                text="Submit"
                textColor={isComplete ? theme.palette.common.white : theme.palette.common.darkGray}
                backgroundColor={
                    isComplete ? theme.palette.accentColor : theme.palette.common.lightGray
                }
                width="108px"
                onPress={() => {
                    const updatedLink = {
                        ...link,
                        isSubmitted: true,
                    };
                
                    dispatch(updateLink(updatedLink));
                }}
                isDisabled={!isComplete}
                />
            </MetaActionBar>
            <MarginBottom />
            </>
        }
        >
        <H1>{template.name}</H1>
        {/* <H2>{truncVerifier(ethers.utils.computeAddress(template.publicKey))}</H2> */}
        <H3>{template.claims.length} required claims</H3>
        <MarginTop />
        {template.claims.map((claim, index) => {
            const linkClaim = getClaimByIdFromLink(link, claim.id);
            
            if(linkClaim) return <Card key={index}>
                <ClaimCardContent claim={linkClaim} />
            </Card>;
            
            const provider = getProviderData(claim.provider);
            const possibleClaim = provider.possibleClaims[claim.claimProvider]!;
            console.log(claim);
            return (
                <PossibleClaimCard key={index} possibleClaim={possibleClaim} provider={provider} onPress={() => handleCreateClaim(claim)} inputParams={claim.params}/>
            );
        })}
        </ScreenContainer>
    );
};

export default Template;