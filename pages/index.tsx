import { useEffect, useState } from 'react';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import { SealClient } from '@mysten/seal';

export default function Home() {
  const { currentAccount, signMessage } = useWalletKit();
  const [client, setClient] = useState<any>(null);
  const [secrets, setSecrets] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (currentAccount && signMessage) {
      SealClient.fromWallet({
        signMessage,
        account: currentAccount,
        network: "testnet",
      }).then(setClient);
    }
  }, [currentAccount, signMessage]);

  const createSecret = async () => {
    if (client && input) {
      await client.createSecret(input);
      const s = await client.listSecrets();
      setSecrets(s);
      setInput("");
    }
  };

  const loadSecrets = async () => {
    if (client) {
      const s = await client.listSecrets();
      setSecrets(s);
    }
  };

  const deleteSecret = async (id: string) => {
    if (client) {
      await client.deleteSecret(id);
      const s = await client.listSecrets();
      setSecrets(s);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Seal Web3 Secret Manager</h1>
          <ConnectButton />
        </div>

        {currentAccount && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a secret..."
                className="w-full px-4 py-2 rounded border"
              />
              <button onClick={createSecret} className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>

            <button onClick={loadSecrets} className="text-sm underline">
              Load Secrets
            </button>

            <ul className="space-y-2">
              {secrets.map((secret: any, idx: number) => (
                <li key={idx} className="bg-white dark:bg-gray-800 p-4 rounded flex justify-between items-center">
                  <span>{secret?.value || "No value"}</span>
                  <button onClick={() => deleteSecret(secret.id)} className="text-red-500">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}