import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OpeningScreen from '../components/wedding/OpeningScreen';
import Hero from '../components/wedding/Hero';
import Countdown from '../components/wedding/Countdown';
import Story from '../components/wedding/Story';
import EventDetails from '../components/wedding/EventDetails';
import Gallery from '../components/wedding/Gallery';
import RSVP from '../components/wedding/RSVP';
import MusicPlayer from '../components/wedding/MusicPlayer';
import Footer from '../components/wedding/Footer';
import { Globe } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const InvitePage = () => {
  const { slug } = useParams();
  const inviteSlug = slug || 'demo';
  const [isOpened, setIsOpened] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, langRes] = await Promise.all([
          axios.get(`${API}/invite/${inviteSlug}`),
          axios.get(`${API}/languages`)
        ]);
        setInviteData(invRes.data);
        setLanguages(langRes.data.filter(l => invRes.data.languages?.includes(l.code)));
      } catch (err) {
        console.error('Failed to fetch invite:', err);
        setError('Invite not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [inviteSlug]);

  const handleOpen = () => setIsOpened(true);

  // Translation helper
  const t = (key, fallback) => {
    if (selectedLang === 'en' || !inviteData?.translations?.[selectedLang]) return fallback;
    return inviteData.translations[selectedLang][key] || fallback;
  };

  const isRTL = languages.find(l => l.code === selectedLang)?.rtl || false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f0e6' }}>
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm tracking-widest uppercase" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f0e6' }}>
        <div className="text-center">
          <h2 className="text-2xl mb-2" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>Invite Not Found</h2>
          <p className="text-sm" style={{ color: '#8B7355' }}>This invitation link may be invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex justify-center" style={{ backgroundColor: '#f5f0e6' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Opening Screen with video */}
      <OpeningScreen
        videoSrc={inviteData.openingVideo}
        posterImage={inviteData.openingPoster}
        onOpen={handleOpen}
        isVisible={!isOpened}
        invitedText={t('invited_text', inviteData.invitation?.line1)}
        tapText={t('tap_to_open', 'Tap to open')}
      />

      {/* Main Invite Content */}
      <div
        className="relative shadow-2xl overflow-hidden"
        style={{
          width: 'min(100vw, 430px)',
          maxWidth: '430px',
          minHeight: '100dvh',
          fontFamily: '"Cinzel Decorative", serif',
          opacity: isOpened ? 1 : 0,
          transition: 'opacity 1s ease-in-out 0.5s',
          pointerEvents: isOpened ? 'auto' : 'none'
        }}
      >
        {/* Language selector (if multiple) */}
        {languages.length > 1 && isOpened && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full shadow-md" style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid rgba(139,115,85,0.15)', backdropFilter: 'blur(10px)' }}>
              <Globe size={12} color="#8B7355" />
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className="px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase transition-colors"
                  style={{
                    fontFamily: '"Cinzel", serif',
                    backgroundColor: selectedLang === lang.code ? 'rgba(139,115,85,0.15)' : 'transparent',
                    color: selectedLang === lang.code ? '#2c2417' : '#8B7355'
                  }}
                >
                  {lang.code}
                </button>
              ))}
            </div>
          </div>
        )}

        <Hero
          couple={inviteData.couple}
          date={inviteData.date}
          invitation={{
            ...inviteData.invitation,
            line1: t('invitation.line1', inviteData.invitation?.line1),
            line2: t('invitation.line2', inviteData.invitation?.line2)
          }}
          backgroundImage={inviteData.heroBackground}
        />

        <Countdown
          date={inviteData.date}
          title={t('countdown.title', 'Our Big Day')}
          subtitle={t('countdown.subtitle', 'Counting Down To')}
        />

        <Story
          stories={inviteData.story}
          title={t('story.title', 'Love Story')}
          subtitle={t('story.subtitle', 'Our Journey')}
        />

        <EventDetails
          events={inviteData.events}
          title={t('events.title', 'Wedding Events')}
          subtitle={t('events.subtitle', 'Join Us At')}
        />

        <Gallery
          images={inviteData.gallery}
          title={t('gallery.title', 'Our Gallery')}
          subtitle={t('gallery.subtitle', 'Captured Moments')}
        />

        <RSVP
          rsvpConfig={{
            ...inviteData.rsvpQuestions,
            title: t('rsvp.title', inviteData.rsvpQuestions?.title),
            subtitle: t('rsvp.subtitle', inviteData.rsvpQuestions?.subtitle)
          }}
          inviteSlug={inviteSlug}
          acceptText={t('rsvp.accept', 'Joyfully Accept')}
          declineText={t('rsvp.decline', 'Regretfully Decline')}
          submitText={t('rsvp.submit', 'Send RSVP')}
        />

        <Footer
          couple={inviteData.couple}
          footer={{
            ...inviteData.footer,
            message: t('footer.message', inviteData.footer?.message)
          }}
        />
      </div>

      {/* Music Player */}
      {isOpened && <MusicPlayer musicUrl={inviteData.music} />}
    </div>
  );
};

export default InvitePage;
