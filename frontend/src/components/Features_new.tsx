'use client';

import { useEffect, useRef, useState } from 'react';

const FEATURES = [
  {
    icon: '📊',
    title: 'Smart Sourcing',
    description: 'AI-powered supplier matching and real-time market intelligence to find the best deals.',
  },
  {
    icon: '🔄',
    title: 'Streamlined Orders',
    description: 'Automate purchase orders and track deliveries with full visibility across your supply chain.',
  },
  {
    icon: '💰',
    title: 'Spend Analytics',
    description: 'Gain complete control with detailed spend analysis and budget forecasting.',
  },
  {
    icon: '🤝',
    title: 'Supplier Portal',
    description: 'Collaborate seamlessly with suppliers through a dedicated, secure portal.',
  },
  {
    icon: '⚡',
    title: 'Fast Integration',
    description: 'Connect to your ERP or accounting system in minutes, not months.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'Bank-level security, SOC 2 compliant, with role-based access controls.',
  },
];

export default function Features() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 8vw, 8rem) clamp(1.5rem, 6vw, 3rem)',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Animated blob backgrounds */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '5%',
          left: '-10%',
          width: 400,
          height: 400,
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
          background: 'radial-gradient(circle, rgba(26,86,219,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: 350,
          height: 350,
          borderRadius: '50% 60% 40% 50% / 70% 30% 50% 40%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '-3s',
        }}
      />

      <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
            animation: isLoaded ? 'fadeInDown 0.6s ease-out' : 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--brand-pale)',
              border: '1px solid rgba(26,86,219,0.15)',
              borderRadius: 100,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--brand)',
              marginBottom: '1.5rem',
              animation: isLoaded ? 'fadeInUp 0.6s ease-out 0.1s both' : 'none',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--brand)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            Everything you need
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: 16,
              animation: isLoaded ? 'fadeInUp 0.7s ease-out 0.15s both' : 'none',
            }}
          >
            Powerful features for modern procurement
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              color: 'var(--slate)',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.6,
              animation: isLoaded ? 'fadeInUp 0.7s ease-out 0.25s both' : 'none',
            }}
          >
            A complete suite of tools designed to simplify procurement, reduce costs, and strengthen supplier relationships.
          </p>
        </div>

        {/* Feature Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2rem)',
          }}
        >
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              style={{
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                borderRadius: 12,
                background: 'white',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                animation: isLoaded ? `slideInUp 0.6s ease-out ${0.3 + idx * 0.08}s both` : 'none',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-8px)';
                el.style.boxShadow = '0 20px 40px rgba(26,86,219,0.15)';
                el.style.borderColor = 'var(--brand)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                el.style.borderColor = 'var(--border)';
              }}
            >
              {/* Icon Container with animation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  background: 'var(--brand-pale)',
                  marginBottom: 16,
                  fontSize: 28,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: 'var(--mist)',
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {feature.description}
              </p>

              {/* Learn more link with animation */}
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--brand)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateX(4px)';
                  el.style.color = 'var(--brand-dark)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateX(0)';
                  el.style.color = 'var(--brand)';
                }}
              >
                Learn more
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <path
                    d="M6 12l4-4-4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Comparison section */}
        <div
          style={{
            marginTop: 'clamp(5rem, 10vw, 8rem)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            background: 'linear-gradient(135deg, var(--brand-pale) 0%, rgba(26,86,219,0.08) 100%)',
            borderRadius: 16,
            border: '1px solid rgba(26,86,219,0.2)',
            animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.4s both' : 'none',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'clamp(2rem, 4vw, 3rem)',
              textAlign: 'center',
            }}
          >
            {[
              { stat: '85%', label: 'Cost reduction achieved by customers' },
              { stat: '50%', label: 'Faster procurement cycles' },
              { stat: '98%', label: 'User satisfaction rating' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  animation: isLoaded ? `fadeInUp 0.7s ease-out ${0.5 + idx * 0.1}s both` : 'none',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                    fontWeight: 800,
                    color: 'var(--brand)',
                    marginBottom: 8,
                  }}
                >
                  {item.stat}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--slate)',
                    lineHeight: 1.6,
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>
    </section>
  );
}
