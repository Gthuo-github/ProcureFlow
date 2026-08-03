'use client'

import Hero     from '@/components/Hero';
import Features  from '@/components/Features_new';
import Footer    from '@/components/Footer';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Hero />
      <Features />

      {/* CTA banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-soft) 100%)',
        padding:    'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 3rem)',
        textAlign:  'center',
        position:   'relative',
        overflow:   'hidden',
      }}>
        {/* Animated background elements */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(26, 86, 219, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}/>
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(26, 86, 219, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '-2s',
        }}/>
        
        {/* Additional decorative elements */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 120,
          height: 120,
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '-4s',
        }}/>

        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight:   700,
            letterSpacing: '-0.025em',
            color:        'white',
            marginBottom: 16,
            animation:   isLoaded ? 'fadeInDown 0.6s ease-out' : 'none',
          }}>
            Ready to streamline your procurement?
          </h2>
          <p style={{ 
            fontSize: 16, 
            color: 'rgba(255,255,255,0.8)', 
            marginBottom: 32, 
            lineHeight: 1.6,
            animation:   isLoaded ? 'fadeInUp 0.6s ease-out 0.1s both' : 'none',
          }}>
            Join thousands of procurement teams who closed the spreadsheet and never looked back.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: 12, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            animation:   isLoaded ? 'fadeInUp 0.6s ease-out 0.2s both' : 'none',
          }}>
            <a href="/register" style={{
              padding:      '14px 28px',
              borderRadius: 10,
              background:   'white',
              color:        'var(--brand)',
              fontSize:     15,
              fontWeight:   500,
              display:      'inline-block',
              transition:   'all .2s cubic-bezier(.4,0,.2,1)',
              boxShadow:    '0 4px 20px rgba(0,0,0,0.15)',
              cursor:       'pointer',
            }}
              onMouseOver={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
              }}
              onMouseOut={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'none';
                el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
              }}
            >
              Create free account
            </a>
            <a href="/login" style={{
              padding:      '14px 28px',
              borderRadius: 10,
              background:   'rgba(255,255,255,0.12)',
              border:       '1px solid rgba(255,255,255,0.2)',
              color:        'white',
              fontSize:     15,
              display:      'inline-block',
              transition:   'all .2s cubic-bezier(.4,0,.2,1)',
              cursor:       'pointer',
            }}
              onMouseOver={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.18)';
                el.style.borderColor = 'rgba(255,255,255,0.3)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.12)';
                el.style.borderColor = 'rgba(255,255,255,0.2)';
                el.style.transform = 'none';
              }}
            >
              Sign in
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
