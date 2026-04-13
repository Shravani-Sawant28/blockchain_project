'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ethers } from 'ethers';
import { getMetaMaskProvider, isUserRejectedError, metaMaskInstallMessage } from './metaMask';

const LOCAL_RPC_URL = process.env.NEXT_PUBLIC_LOCAL_RPC_URL || 'http://127.0.0.1:8545';

export type MembershipWalletContextValue = {
  browserProvider: ethers.BrowserProvider | null;
  readProvider: ethers.BrowserProvider | ethers.JsonRpcProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  connecting: boolean;
  error: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  switchToLocalhost: () => Promise<void>;
  disconnect: () => void;
};

const MembershipWalletContext = createContext<MembershipWalletContextValue | null>(null);

export function MembershipWalletProvider({ children }: { children: React.ReactNode }) {
  const [browserProvider, setBrowserProvider] = useState<ethers.BrowserProvider | null>(null);
  const [readProvider, setReadProvider] = useState<
    ethers.BrowserProvider | ethers.JsonRpcProvider | null
  >(null);
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eth = getMetaMaskProvider();
    if (eth) {
      const p = new ethers.BrowserProvider(eth);
      setBrowserProvider(p);
      setReadProvider(p);
      return;
    }
    setBrowserProvider(null);
    setReadProvider(new ethers.JsonRpcProvider(LOCAL_RPC_URL));
  }, []);

  const syncFromProvider = useCallback(async (provider: ethers.BrowserProvider) => {
    const accounts = (await provider.send('eth_accounts', [])) as string[];
    if (!accounts.length) {
      setAddress(null);
      setSigner(null);
      setChainId(null);
      return;
    }
    setAddress(ethers.getAddress(accounts[0]));
    const s = await provider.getSigner();
    setSigner(s);
    const network = await provider.getNetwork();
    const resolvedChainId = Number(network.chainId);
    console.log('[membership] connected chainId:', resolvedChainId);
    setChainId(resolvedChainId);
    if (resolvedChainId !== 31337) {
      setError(`Wrong network: expected localhost chainId 31337, got ${resolvedChainId}.`);
    }
  }, []);

  useEffect(() => {
    if (!browserProvider) return;
    void syncFromProvider(browserProvider);
  }, [browserProvider, syncFromProvider]);

  useEffect(() => {
    const eth = getMetaMaskProvider();
    if (!eth || !browserProvider) return;

    const onAccountsChanged = () => {
      void syncFromProvider(browserProvider);
    };

    const onChainChanged = () => {
      window.location.reload();
    };

    eth.on?.('accountsChanged', onAccountsChanged);
    eth.on?.('chainChanged', onChainChanged);
    return () => {
      eth.removeListener?.('accountsChanged', onAccountsChanged);
      eth.removeListener?.('chainChanged', onChainChanged);
    };
  }, [browserProvider, syncFromProvider]);

  const connect = useCallback(async () => {
    setError(null);
    const eth = getMetaMaskProvider();
    if (!eth) {
      setError(metaMaskInstallMessage());
      return;
    }
    const provider = new ethers.BrowserProvider(eth);
    setConnecting(true);
    try {
      await provider.send('eth_requestAccounts', []);
      await syncFromProvider(provider);
    } catch (err) {
      if (isUserRejectedError(err)) {
        setError('You rejected the connection request.');
      } else {
        setError('Could not connect. Please try again.');
      }
    } finally {
      setConnecting(false);
    }
  }, [syncFromProvider]);

  const switchToLocalhost = useCallback(async () => {
    const eth = getMetaMaskProvider();
    if (!eth) {
      setError(metaMaskInstallMessage());
      return;
    }
    try {
      await eth.request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7a69' }],
      });
    } catch {
      await eth.request?.({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x7a69',
            chainName: 'Localhost 8545',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: [LOCAL_RPC_URL],
          },
        ],
      });
    }
    const provider = new ethers.BrowserProvider(eth);
    await syncFromProvider(provider);
  }, [syncFromProvider]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSigner(null);
    setChainId(null);
    setError(null);
  }, []);

  const value = useMemo<MembershipWalletContextValue>(
    () => ({
      browserProvider,
      readProvider,
      signer,
      address,
      chainId,
      connecting,
      error,
      isConnected: Boolean(address && signer),
      connect,
      switchToLocalhost,
      disconnect,
    }),
    [address, browserProvider, chainId, connect, connecting, disconnect, error, readProvider, signer, switchToLocalhost],
  );

  return (
    <MembershipWalletContext.Provider value={value}>{children}</MembershipWalletContext.Provider>
  );
}

export function useMembershipWallet(): MembershipWalletContextValue {
  const ctx = useContext(MembershipWalletContext);
  if (!ctx) {
    throw new Error('useMembershipWallet must be used within MembershipWalletProvider');
  }
  return ctx;
}
