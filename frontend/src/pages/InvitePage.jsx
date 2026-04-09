import React, { useState } from 'react';
import { weddingData } from '../data/mockData';
import OpeningScreen from '../components/wedding/OpeningScreen';
import Hero from '../components/wedding/Hero';
import Countdown from '../components/wedding/Countdown';
import Story from '../components/wedding/Story';
import EventDetails from '../components/wedding/EventDetails';
import Gallery from '../components/wedding/Gallery';
import RSVP from '../components/wedding/RSVP';
import MusicPlayer from '../components/wedding/MusicPlayer';
import Footer from '../components/wedding/Footer';

const InvitePage = () => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <div className="min-h-[100dvh] flex justify-center" style={{ backgroundColor: '#f5f0e6' }}>
      {/* Opening Screen */}
      <OpeningScreen
        couple={weddingData.couple}
        onOpen={handleOpen}
        isVisible={!isOpened}
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
        <Hero
          couple={weddingData.couple}
          date={weddingData.date}
          invitation={weddingData.invitation}
        />

        <Countdown date={weddingData.date} />

        <Story stories={weddingData.story} />

        <EventDetails events={weddingData.events} />

        <Gallery images={weddingData.gallery} />

        <RSVP rsvpConfig={weddingData.rsvpQuestions} />

        <Footer
          couple={weddingData.couple}
          footer={weddingData.footer}
        />
      </div>

      {/* Music Player - only show after opening */}
      {isOpened && <MusicPlayer />}
    </div>
  );
};

export default InvitePage;
