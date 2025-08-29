'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { jwtVerify, decodeJwt, decodeProtectedHeader } from 'jose';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Data and Types ---

const claimDescriptions: { [key: string]: string } = {
  alg: 'Algorithm: The signing algorithm used for the signature.',
  typ: 'Token Type: The type of the token, typically "JWT".',
  cty: 'Content Type: The content type of the token.',
  kid: 'Key ID: A hint indicating which key was used to sign the JWT.',
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

// --- Helper Components ---

function VerificationBadge({ status, error }: { status: VerificationStatus, error: string | null }) {
  if (status === 'verified') {
    return <div className="p-3 text-sm rounded-lg bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-300 dark:border-green-700">✅ Signature Verified</div>;
  }
  if (status === 'invalid') {
    return <div className="p-3 text-sm rounded-lg bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-300 dark:border-red-700">❌ {error || 'Invalid Signature'}</div>;
  }
  return <div className="p-3 text-sm rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700">ℹ️ Enter a secret to verify signature</div>;
}

function JsonViewer({ title, data, color }: { title: string, data: object | null, color: 'blue' | 'purple' }) {
  const titleColor = color === 'blue' ? 'text-blue-500 dark:text-blue-400' : 'text-purple-500 dark:text-purple-400';

  const renderValue = (key: string, value: any): ReactNode => {
    if (timestampKeys.includes(key) && typeof value === 'number') {
      const date = new Date(value * 1000);
      return (
        <>
          <span className="text-red-500 dark:text-red-400">{value}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">{`// ${date.toLocaleString()}`}</span>
        </>
      );
    }
    if (typeof value === 'string') return <span className="text-green-600 dark:text-green-400">"{value}"</span>;
    if (typeof value === 'boolean') return <span className="text-yellow-600 dark:text-yellow-400">{String(value)}</span>;
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'object') {
      return <pre className="pl-4">{JSON.stringify(value, null, 2).split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}</pre>;
    }
    return <span className="text-red-500 dark:text-red-400">{String(value)}</span>;
  };

  return (
    <div>
      <h3 className={`font-semibold text-lg mb-2 ${titleColor}`}>{title}</h3>
      <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg text-sm font-mono overflow-x-auto border border-gray-200 dark:border-gray-700">
        {data ? (
          <pre><code>
            {`{\n`}
            {Object.entries(data).map(([key, value], index, arr) => (
              <div key={key} className="ml-4">
                {claimDescriptions[key] ? (
                  <span className="text-gray-800 dark:text-gray-200 cursor-help underline decoration-dotted underline-offset-2" title={claimDescriptions[key]}>"{key}"</span>
                ) : (
                  <span className="text-gray-800 dark:text-gray-200">"{key}"</span>
                )}
                : {renderValue(key, value)}
                {index < arr.length - 1 ? ',' : ''}
              </div>
            ))}
            {`}`}
          </code></pre>
        ) : '...'}
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function JwtDecoderPage() {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30');
  const [secret, setSecret] = useState('a-string-secret-at-least-256-bits-long');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processToken = async () => {
      if (!token) {
        setHeader(null);
        setPayload(null);
        setStatus('pending');
        setError(null);
        return;
      }

      try {
        const decodedHeader = decodeProtectedHeader(token);
        const decodedPayload = decodeJwt(token);
        setHeader(decodedHeader);
        setPayload(decodedPayload);
        setError(null);

        if (!secret.trim()) {
          setStatus('pending');
          return;
        }

        const secretKey = new TextEncoder().encode(secret);
        await jwtVerify(token, secretKey);
        setStatus('verified');
        setError(null);
      } catch (e: any) {
        setStatus('invalid');
        if (e.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
          setError('Signature verification failed: The secret is incorrect or the token has been tampered with.');
        } else if (e.code === 'ERR_JWT_EXPIRED') {
          setError('Token has expired.');
        } else {
          setError(`Invalid Token: ${e.message}`);
        }
        if (!header) try { setHeader(decodeProtectedHeader(token)); } catch { }
        if (!payload) try { setPayload(decodeJwt(token)); } catch { }
      }
    };
    processToken();
  }, [token, secret, header, payload]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">JWT Decoder & Verifier</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Decode, inspect, and verify JWT tokens in real-time.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="jwt-input" className="block text-sm font-medium mb-1">Encoded Token</label>
                <textarea
                  id="jwt-input"
                  rows={12}
                  className="w-full p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste your JWT here..."
                  value={token}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setToken(e.target.value); triggerHapticFeedback(); }}
                />
              </div>
              <div>
                <label htmlFor="jwt-secret" className="block text-sm font-medium mb-1">Secret / Public Key</label>
                <textarea
                  id="jwt-secret"
                  rows={4}
                  className="w-full p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  placeholder="Your secret for HS256/384/512..."
                  value={secret}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setSecret(e.target.value); triggerHapticFeedback(); }}
                />
                <p className="text-xs text-gray-500 mt-1">Required for signature verification.</p>
              </div>
            </div>

            <div className="space-y-4">
              <VerificationBadge status={status} error={error} />
              <JsonViewer title="Header" data={header} color="blue" />
              <JsonViewer title="Payload" data={payload} color="purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
