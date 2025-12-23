'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles/Terminal.module.css';

const checkoutStatusesDone = ['completed', 'paid', 'succeeded', 'fulfilled'];

export const skateboardCatalog = [
  {
    id: 'aurora-cruiser',
    name: 'Aurora Cruiser',
    price: '$129',
    description: 'Lightweight maple cruiser built for smooth city rides.',
    envVar: 'NEXT_PUBLIC_POLAR_PRODUCT_AURORA',
    polarProductId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_AURORA,
    type: 'one-time'
  },
  {
    id: 'midnight-freestyle',
    name: 'Midnight Freestyle',
    price: '$149',
    description: 'Responsive deck with medium concave for park and flat tricks.',
    envVar: 'NEXT_PUBLIC_POLAR_PRODUCT_MIDNIGHT',
    polarProductId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_MIDNIGHT,
    type: 'one-time'
  },
  {
    id: 'ember-downhill',
    name: 'Ember Downhill',
    price: '$189',
    description: 'Stiff downhill setup for stable high-speed carving.',
    envVar: 'NEXT_PUBLIC_POLAR_PRODUCT_EMBER',
    polarProductId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_EMBER,
    type: 'one-time'
  },
  {
    id: 'skateboard-subscription-monthly',
    name: 'Skateboard Subscription',
    price: '$29/month',
    description: 'Get a new skateboard delivered every year. Cancel anytime.',
    envVar: 'NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_MONTHLY',
    polarProductId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_MONTHLY,
    type: 'subscription',
    billingPeriod: 'monthly'
  },
  {
    id: 'skateboard-subscription-yearly',
    name: 'Skateboard Subscription (Yearly)',
    price: '$278.40/year',
    originalPrice: '$348/year',
    description: 'Get a new skateboard delivered every year. Save 20% with yearly billing.',
    envVar: 'NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_YEARLY',
    polarProductId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_YEARLY,
    type: 'subscription',
    billingPeriod: 'yearly',
    discount: '20% off'
  }
];

export function SkateboardsList() {
  const boards = useMemo(
    () =>
      skateboardCatalog.map((board) => ({
        ...board,
        configured: Boolean(board.polarProductId)
      })),
    []
  );

  return (
    <div className={styles.skateboardList}>
      <div className={styles.outputSecondary} style={{ marginBottom: '0.75rem' }}>
        Available skateboards (use 'buy &lt;number&gt;' to purchase):
      </div>
      {boards.map((board, index) => (
        <div key={board.id} className={styles.skateboardListItem}>
          <span className={styles.skateboardIndex}>{index + 1}.</span>
          <div className={styles.skateboardListContent}>
            <div className={styles.skateboardListName}>
              {board.name}
              {board.type === 'subscription' && (
                <span className={styles.skateboardSubscriptionTag}> [Subscription]</span>
              )}
            </div>
            <div className={styles.skateboardListPrice}>{board.price}</div>
            {board.originalPrice && (
              <div className={styles.skateboardListOriginalPrice}>
                Was: {board.originalPrice} ({board.discount})
              </div>
            )}
            {!board.configured && (
              <div className={styles.errorMessage} style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}>
                ⚠ Product ID not configured ({board.envVar})
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BuySkateboard({ index }) {
  const [checkoutState, setCheckoutState] = useState({
    status: 'idle',
    message: '',
    checkoutId: null,
    checkoutUrl: null,
    product: null
  });
  const [statusHistory, setStatusHistory] = useState([]);
  const pollRef = useRef(null);

  const boards = useMemo(
    () =>
      skateboardCatalog.map((board) => ({
        ...board,
        configured: Boolean(board.polarProductId)
      })),
    []
  );

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (index !== undefined && index !== null) {
      handleBuy(index);
    }
  }, [index]);

  const clearPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startPolling = (checkoutId) => {
    clearPoll();
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts += 1;
      await refreshStatus(checkoutId);
      if (attempts > 60) {
        clearPoll();
      }
    }, 4000);
  };

  const handleBuy = async (productIndex) => {
    const productIndexZeroBased = productIndex - 1;
    
    if (productIndexZeroBased < 0 || productIndexZeroBased >= boards.length) {
      setCheckoutState({
        status: 'error',
        message: `Invalid product index: ${productIndex}. Use 'skateboards' to see available products (1-${boards.length}).`
      });
      return;
    }

    const board = boards[productIndexZeroBased];
    
    if (!board.configured) {
      setCheckoutState({
        status: 'error',
        message: `Product "${board.name}" is not configured. Set ${board.envVar} in .env.local`
      });
      return;
    }

    await createCheckout(board.polarProductId, board.name);
  };

  const createCheckout = async (productId, productName) => {
    if (!productId) {
      setCheckoutState({
        status: 'error',
        message: 'Missing Polar product ID.'
      });
      return;
    }

    clearPoll();
    setCheckoutState({
      status: 'creating',
      message: `Creating checkout for ${productName}...`,
      checkoutId: null,
      checkoutUrl: null,
      product: productName
    });

    try {
      const response = await fetch('/api/polar/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: 1,
          metadata: { productName }
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setCheckoutState({
          status: 'error',
          message: data?.error || 'Unable to create checkout. Confirm the Polar key and product id.'
        });
        return;
      }

      setCheckoutState({
        status: 'pending',
        message: `Checkout created for ${productName}. Opening Polar sandbox checkout...`,
        checkoutId: data.checkoutId,
        checkoutUrl: data.checkoutUrl,
        product: productName
      });

      // Store checkout_id in localStorage for redirect handling
      if (typeof window !== 'undefined' && data.checkoutId) {
        localStorage.setItem('polar_checkout_id', data.checkoutId);
        localStorage.setItem('polar_checkout_product', productName);
      }

      setStatusHistory((prev) => [
        ...prev,
        { status: data.status || 'created', at: new Date().toISOString() }
      ]);

      if (typeof window !== 'undefined' && data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
      }

      startPolling(data.checkoutId);
    } catch (error) {
      setCheckoutState({
        status: 'error',
        message: `Unexpected error creating checkout: ${error.message}`
      });
    }
  };

  const refreshStatus = async (checkoutId) => {
    const targetId = checkoutId || checkoutState.checkoutId;
    if (!targetId) {
      return;
    }

    try {
      const response = await fetch(`/api/polar/checkout/status?id=${targetId}`);
      const data = await response.json();

      if (!response.ok) {
        setCheckoutState({
          status: 'error',
          message: data?.error || 'Unable to fetch checkout status'
        });
        clearPoll();
        return;
      }

      setStatusHistory((prev) => [
        ...prev,
        { status: data.status, at: new Date().toISOString() }
      ]);

      const isDone = checkoutStatusesDone.includes(data.status);
      const nextStatus = isDone ? 'completed' : 'pending';

      setCheckoutState((prev) => ({
        ...prev,
        status: nextStatus,
        message: `Checkout status: ${data.status}`
      }));

      if (isDone) {
        clearPoll();
      }
    } catch (error) {
      setCheckoutState({
        status: 'error',
        message: `Unable to refresh status: ${error.message}`
      });
      clearPoll();
    }
  };

  const statusToneClass = {
    idle: styles.outputSecondary,
    creating: styles.outputSecondary,
    pending: styles.outputSecondary,
    completed: styles.outputSuccess,
    error: styles.errorMessage
  }[checkoutState.status] || styles.outputSecondary;

  return (
    <div className={styles.buyOutput}>
      {checkoutState.status === 'idle' && (
        <div className={styles.outputSecondary}>Processing purchase...</div>
      )}
      {checkoutState.status !== 'idle' && (
        <>
          <div className={statusToneClass}>{checkoutState.message}</div>
          {checkoutState.checkoutUrl && (
            <div className={styles.outputSecondary} style={{ marginTop: '0.5rem' }}>
              Checkout URL:{' '}
              <a
                href={checkoutState.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.projectLink}
              >
                {checkoutState.checkoutUrl}
              </a>
            </div>
          )}
          {statusHistory.length > 0 && (
            <div className={styles.statusHistory} style={{ marginTop: '0.75rem' }}>
              <div className={styles.outputMuted} style={{ marginBottom: '0.25rem' }}>Status history:</div>
              {statusHistory.map((entry, idx) => (
                <div key={idx} className={styles.outputMuted} style={{ fontSize: '0.8125rem' }}>
                  [{new Date(entry.at).toLocaleTimeString()}] {entry.status}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

