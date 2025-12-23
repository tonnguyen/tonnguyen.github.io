'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles/Terminal.module.css';

const checkoutStatusesDone = ['completed', 'paid', 'succeeded', 'fulfilled'];

const skateboardCatalog = [
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

export default function SkateboardStore() {
  const [checkoutState, setCheckoutState] = useState({
    status: 'idle',
    message: 'Choose a skateboard to start a Polar sandbox checkout.',
    checkoutId: null,
    checkoutUrl: null,
    product: null
  });
  const [statusHistory, setStatusHistory] = useState([]);
  const [manualProductId, setManualProductId] = useState('');
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

  const clearPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const updateStatus = (next) => {
    setCheckoutState((prev) => ({ ...prev, ...next }));
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

  const createCheckout = async (productId, productName) => {
    if (!productId) {
      updateStatus({
        status: 'error',
        message: 'Missing Polar product ID. Set the env var noted on the card.'
      });
      return;
    }

    clearPoll();
    updateStatus({
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
        updateStatus({
          status: 'error',
          message:
            data?.error ||
            'Unable to create checkout. Confirm the Polar key and product id.'
        });
        return;
      }

      updateStatus({
        status: 'pending',
        message: 'Checkout created. Opening Polar sandbox checkout...',
        checkoutId: data.checkoutId,
        checkoutUrl: data.checkoutUrl,
        product: productName
      });

      setStatusHistory((prev) => [
        ...prev,
        { status: data.status || 'created', at: new Date().toISOString() }
      ]);

      if (typeof window !== 'undefined' && data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
      }

      startPolling(data.checkoutId);
    } catch (error) {
      updateStatus({
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
        updateStatus({
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

      updateStatus({
        status: nextStatus,
        message: `Checkout status: ${data.status}`,
        checkoutId: targetId
      });

      if (isDone) {
        clearPoll();
      }
    } catch (error) {
      updateStatus({
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
    <div className={styles.storeContainer}>
      <div className={styles.storeHeader}>
        <div className={styles.storeTitle}>Skateboard Store (Polar Sandbox)</div>
        <div className={styles.outputSecondary}>
          Uses your Polar sandbox key to create a checkout and poll for status.
        </div>
        <div className={styles.outputMuted}>
          Set Polar product ids via env vars noted on each card
          (e.g. NEXT_PUBLIC_POLAR_PRODUCT_AURORA).
        </div>
      </div>

      <div className={styles.storeGrid}>
        {boards.map((board) => (
          <div key={board.id} className={`${styles.storeCard} ${board.type === 'subscription' ? styles.storeCardSubscription : ''}`}>
            {board.type === 'subscription' && (
              <div className={styles.subscriptionBadge}>Subscription</div>
            )}
            <div className={styles.storeName}>{board.name}</div>
            <div className={styles.storeDescription}>{board.description}</div>
            <div className={styles.storePriceContainer}>
              <div className={styles.storePrice}>{board.price}</div>
              {board.originalPrice && (
                <div className={styles.storeOriginalPrice}>{board.originalPrice}</div>
              )}
              {board.discount && (
                <div className={styles.storeDiscount}>{board.discount}</div>
              )}
            </div>
            {board.type === 'subscription' && (
              <div className={styles.storeSubscriptionNote}>
                New board delivered annually
              </div>
            )}
            <div className={styles.storeMeta}>
              <span className={styles.outputMuted}>Polar Product ID:</span>{' '}
              {board.polarProductId ? (
                <span className={styles.outputSecondary}>{board.polarProductId}</span>
              ) : (
                <span className={styles.errorMessage}>Set {board.envVar}</span>
              )}
            </div>
            <button
              className={
                board.configured ? styles.storeButton : styles.storeButtonDisabled
              }
              disabled={!board.configured || checkoutState.status === 'creating'}
              onClick={() => createCheckout(board.polarProductId, board.name)}
            >
              {checkoutState.status === 'creating'
                ? 'Working...'
                : board.type === 'subscription' ? 'Subscribe with Polar' : 'Buy with Polar'}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.storeManual}>
        <div className={styles.outputSecondary}>
          Or paste a Polar sandbox product id to test directly:
        </div>
        <div className={styles.storeManualRow}>
          <input
            className={styles.storeInput}
            placeholder="polar_prod_..."
            value={manualProductId}
            onChange={(e) => setManualProductId(e.target.value)}
          />
          <button
            className={
              manualProductId ? styles.storeButton : styles.storeButtonDisabled
            }
            disabled={!manualProductId}
            onClick={() => createCheckout(manualProductId, 'Custom skateboard')}
          >
            Start Checkout
          </button>
        </div>
      </div>

      <div className={styles.storeStatus}>
        <div className={styles.outputSecondary}>Checkout status</div>
        <div className={statusToneClass}>{checkoutState.message}</div>
        {checkoutState.checkoutUrl && (
          <div className={styles.outputSecondary}>
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
        <div className={styles.storeActions}>
          <button
            className={
              checkoutState.checkoutId
                ? styles.storeButtonSecondary
                : styles.storeButtonDisabled
            }
            disabled={!checkoutState.checkoutId}
            onClick={() => refreshStatus()}
          >
            Refresh status now
          </button>
          <button className={styles.storeButtonSecondary} onClick={clearPoll}>
            Stop polling
          </button>
        </div>
        {statusHistory.length > 0 && (
          <div className={styles.storeLog}>
            {statusHistory.map((entry, idx) => (
              <div key={idx} className={styles.outputMuted}>
                [{new Date(entry.at).toLocaleTimeString()}] {entry.status}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

