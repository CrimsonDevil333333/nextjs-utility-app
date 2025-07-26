'use client';

import { useState, useEffect, ReactNode } from 'react';
import { jwtVerify, decodeJwt, decodeProtectedHeader } from 'jose';
import Tooltip from '@/components/Tooltip';


// Descriptions for common JWT claims
const claimDescriptions: { [key: string]: string } = {
  // Header
  alg: 'Algorithm: The signing algorithm used for the signature.',
  typ: 'Token Type: The type of the token, typically "JWT".',
  cty: 'Content Type: The content type of the token.',
  kid: 'Key ID: A hint indicating which key was used to sign the JWT.',
  
  // Payload
  iss: 'Issuer: The principal that issued the JWT.',
  sub: 'Subject: The principal that is the subject of the JWT.',
  aud: 'Audience: The recipients that the JWT is intended for.',
  exp: 'Expiration Time: The time on or after which the JWT must not be accepted.',
  nbf: 'Not Before: The time before which the JWT must not be accepted.',
  iat: 'Issued At: The time at which the JWT was issued.',
  jti: 'JWT ID: A unique identifier for the JWT.',
};

const timestampKeys = ['exp', 'nbf', 'iat'];

type VerificationStatus = 'verified' | 'invalid' | 'pending';

export default function JwtDecoderPage() {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setHeader(null);
      setPayload(null);
      setStatus('pending');
      setError(null);
      return;
    }

    const verifyToken = async () => {
      try {
        // First, decode for display purposes
        const decodedHeader = decodeProtectedHeader(token);
        const decodedPayload = decodeJwt(token);
        setHeader(decodedHeader);
        setPayload(decodedPayload);
        setError(null);

        // If no secret is provided, we can't verify
        if (!secret.trim()) {
            setStatus('pending');
            return;
        }

        // Now, attempt to verify the signature
        const secretKey = new TextEncoder().encode(secret);
        await jwtVerify(token, secretKey);
        
        setStatus('verified');
        setError(null);
      } catch (e: any) {
        // Handle both decoding and verification errors
        setStatus('invalid');
        if (e.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
          setError('Signature verification failed: The secret is incorrect or the token has been tampered with.');
        } else if (e.code === 'ERR_JWT_EXPIRED') {
          setError('Token has expired.');
        } else {
          setError(`Invalid Token: ${e.message}`);
        }
        // Keep decoded parts for inspection even if verification fails
        if (!header) setHeader(decodeProtectedHeader(token));
        if (!payload) setPayload(decodeJwt(token));
      }
    };
    
    verifyToken();

  }, [token, secret, header, payload]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-2">JWT Decoder & Verifier</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Decode, inspect, and verify JWT tokens in real-time.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: INPUTS */}
        <div className="space-y-4">
          <div>
            <label htmlFor="jwt-input" className="block text-sm font-medium mb-1">Encoded Token</label>
            <textarea
              id="jwt-input"
              rows={12}
              className="w-full p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your JWT here..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="jwt-secret" className="block text-sm font-medium mb-1">Secret / Public Key</label>
            <textarea
              id="jwt-secret"
              rows={4}
              className="w-full p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
              placeholder="Your secret for HS256/384/512..."
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Required for signature verification. For RS/ES algorithms, paste your PEM-encoded public key.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: OUTPUTS */}
        <div className="space-y-4">
            <VerificationBadge status={status} error={error} />
            <JsonViewer title="Header" data={header} color="blue" />
            <JsonViewer title="Payload" data={payload} color="purple" />
        </div>
      </div>
    </div>
  );
}

// -- Reusable Components for the page --

// Component to display the verification status badge
function VerificationBadge({ status, error }: { status: VerificationStatus, error: string | null }) {
    if (status === 'verified') {
        return <div className="p-3 text-sm rounded-lg bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-300 dark:border-green-700">✅ Signature Verified</div>;
    }
    if (status === 'invalid') {
        return <div className="p-3 text-sm rounded-lg bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-300 dark:border-red-700">❌ {error || 'Invalid Signature'}</div>;
    }
    return <div className="p-3 text-sm rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700">ℹ️ Enter a secret to verify signature</div>;
}

// Component to render JSON with tooltips and timestamp conversions
function JsonViewer({ title, data, color }: { title: string, data: object | null, color: 'blue' | 'purple' }) {
    const titleColor = color === 'blue' ? 'text-blue-500' : 'text-purple-500';

    const renderValue = (key: string, value: any): ReactNode => {
        // ... (keep this function as is) ...
        if (timestampKeys.includes(key) && typeof value === 'number') {
            const date = new Date(value * 1000);
            return (
                <>
                    <span className="text-red-500 dark:text-red-400">{value}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                        {`// ${date.toLocaleString()}`}
                    </span>
                </>
            );
        }
        if (typeof value === 'string') {
            return <span className="text-green-600 dark:text-green-400">"{value}"</span>;
        }
        if (typeof value === 'boolean') {
            return <span className="text-yellow-600 dark:text-yellow-400">{String(value)}</span>;
        }
        if (value === null) {
            return <span className="text-gray-500">null</span>;
        }
        if (typeof value === 'object') {
            // For nested objects, ensure they are stringified for display
            return (
                <pre className="pl-4">
                    {JSON.stringify(value, null, 2).split('\n').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                    ))}
                </pre>
            );
        }
        return <span className="text-red-500 dark:text-red-400">{String(value)}</span>;
    };

    return (
        <div>
            <h3 className={`font-semibold text-lg mb-1 ${titleColor}`}>{title}</h3>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto">
                {data ? (
                    <pre>
                        <code>
                            {`{\n`}
                            {Object.entries(data).map(([key, value], index, arr) => (
                                <div key={key} className="ml-4">
                                    {/* Conditional rendering for Tooltip */}
                                    {claimDescriptions[key] ? (
                                        <Tooltip content={claimDescriptions[key]}>
                                            <span
                                                className="text-gray-800 dark:text-gray-200 cursor-help underline decoration-dotted underline-offset-2"
                                            >
                                                "{key}"
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        <span
                                            className="text-gray-800 dark:text-gray-200" // No cursor-help or underline for non-interactive items
                                        >
                                            "{key}"
                                        </span>
                                    )}
                                    : {renderValue(key, value)}
                                    {index < arr.length - 1 ? ',' : ''}
                                </div>
                            ))}
                            {`}`}
                        </code>
                    </pre>
                ) : '...'}
            </div>
        </div>
    );
}