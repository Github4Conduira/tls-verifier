import { useState } from 'react';
import './App.css';
import { useMintCredential } from './hooks/useMintCredential';

const EXEC_STATES = ['idle', 'error']

function App() {
  const {
    provider,
    step,
    resumableMintStep,
    executeMintCredential
  } = useMintCredential()
  const [emailAddress, setEmailAddress] = useState('')
  const [googleToken, setGoogleToken] = useState('')

  async function generateProof() {
    if(!emailAddress) {
      alert('Please enter the email address')
      return
    }

    if(!googleToken) {
      alert('Please enter your google token')
      return
    }

    await executeMintCredential({
      name: 'google-login',
      params: { emailAddress },
      secretParams: { token: googleToken },
      requestMint: undefined
    })
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      <h4>
        Reclaim Protocol Browser Example
      </h4>

      <p>
        This is an example of how to use the Reclaim Protocol in a browser
        to mint a credential.
        <br/>
        We'll be using the "google-login" application
        to mint ownership of a gmail account.
        <br/><br/>
        You'll need Metamask installed & some ETH to mint.
      </p>

      <p>
        Connected Chain:
        {' '}
        <b>
          {provider?.network?.name || provider?.network?.chainId || 'N/A'}
        </b>
      </p>

      <hr />

      <div>
        <div>
          <label>
            Email Address
          </label>
          {' '}
          <input
            type="text"
            value={emailAddress}
            onChange={e => setEmailAddress(e.target.value)}
          />
          {' '}
          <p style={{ fontSize: '0.9rem' }}>
            (The email address you want to mint ownership of)
          </p>
        </div>
        <br />
        <div>
          <label>
            Google Token
          </label>
          {' '}
          <input
            type="text"
            value={googleToken}
            onChange={e => setGoogleToken(e.target.value)}
          />
          <br />
          <p style={{ fontSize: '0.9rem' }}>
            (
              The google access token you get from the google login flow.
              Obtain from the
              {' '}
              <a
                target='_blank'
                href='https://developers.google.com/oauthplayground/'
                rel="noreferrer"
              >
                oauth2 playground.
              </a>
              <br/>
              Ensure you add the "https://www.googleapis.com/auth/userinfo.email" and "https://www.googleapis.com/auth/userinfo.profile" scope.
            )
          </p>
        </div>
        
        <button
          disabled={!EXEC_STATES.includes(step.name)}
          onClick={generateProof}
        >
          {!!resumableMintStep ? 'Resume Mint' : 'Mint Claim'}
        </button>

        {
          step.name === 'error' && (
            <div style={{ color: 'red' }}>
              {step.error.message}
            </div>
          )
        }
        {
          step.name !== 'idle' && (
            <div>
              {step.name}...
            </div>
          )
        }
        {
          step?.name === 'minted' && (
            <div>
              Claim ID: <b>{step.claimData.claimId.toString()}</b>
              <br />
              Claim Signatures: <>
                {step.signatures.map((sig, i) => (
                  <div key={sig}>
                    <b>
                      {sig}
                    </b>
                    <br />
                  </div>
                ))}
              </>
              <br />
              Claim Data:
              <pre>
                {JSON.stringify(step.claimData, null, 2)}
              </pre>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
