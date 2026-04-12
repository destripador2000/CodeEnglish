import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Volume2, 
  Mic, 
  PenTool, 
  Shuffle,
  X,
  Check
} from 'lucide-react';
import { 
  Container,
  BackgroundGlow,
  MainContent,
  TopBar,
  BackButton,
  HeaderTitle,
  Spacer,
  SelectionTitle,
  SelectionSubtitle,
  CardsGrid,
  PageCard,
  PageTitle,
  PageSubtitle,
  CheckIconWrapper,
  FloatingActionBar,
  ModeSelector,
  ModeButton,
  SelectionInfo,
  SelectionCountLabel,
  SelectionNumber,
  StartButton,
  CardContainer,
  SpeakerButton,
  MainWord,
  TapHint,
  ControlsContainer,
  ControlButton,
  PhaseBadge,
  ProgressInfo
} from '../components/StudyShared';

const BOOK_PAGES = Array.from({ length: 29 }, (_, i) => {
  const num = i + 1;
  if (num === 26) return { num, title: 'House & Furniture', desc: 'Page 26' };
  if (num === 27) return { num, title: 'Family', desc: 'Page 27' };
  if (num === 28) return { num, title: 'Body & Organs', desc: 'Page 28' };
  if (num === 29) return { num, title: 'Animals', desc: 'Page 29' };
  return { num, title: `Page ${num}`, desc: '~100 words' };
});

const mockWords = [
  { id: 1, word: 'Algorithm', translation: 'Algoritmo', example: 'The algorithm processes data efficiently.' },
  { id: 2, word: 'Database', translation: 'Base de datos', example: 'The database stores all user information.' },
  { id: 3, word: 'Function', translation: 'Función', example: 'This function returns a boolean value.' },
  { id: 4, word: 'Variable', translation: 'Variable', example: 'Declare a variable before using it.' },
];

type StudyMode = 'mixed' | 'speaking' | 'writing';
type ViewState = 'selection' | 'study';

export const VocabularyStudy = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('selection');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('mixed');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const currentWord = mockWords[currentWordIndex];
  const totalWords = mockWords.length;

  const handleBack = () => {
    if (view === 'study') {
      setView('selection');
      setIsFlipped(false);
      setCurrentWordIndex(0);
    } else {
      navigate('/dashboard');
    }
  };

  const togglePage = (pageNum: number) => {
    setSelectedPages((prev) => 
      prev.includes(pageNum) ? prev.filter(p => p !== pageNum) : [...prev, pageNum]
    );
  };

  const startStudySession = () => {
    setView('study');
    setCurrentWordIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = () => {
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGotIt = () => {
    handleNextWord();
  };

  const handleReviewLater = () => {
    handleNextWord();
  };

  return (
    <Container>
      <BackgroundGlow />
      
      <TopBar>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={18} />
          {view === 'study' ? 'Back' : 'Exit'}
        </BackButton>
        
        <HeaderTitle>
          <BookOpen size={20} />
          {view === 'selection' ? 'Set up your session' : `Mode: ${studyMode.toUpperCase()}`}
        </HeaderTitle>
        
        <Spacer />
      </TopBar>

      <MainContent>
        {view === 'selection' ? (
          <>
            <SelectionTitle>Select your pages</SelectionTitle>
            <SelectionSubtitle>Choose the pages to generate a practice session</SelectionSubtitle>
            
            <CardsGrid>
              {BOOK_PAGES.map((page) => (
                <PageCard 
                  key={page.num} 
                  $selected={selectedPages.includes(page.num)}
                  onClick={() => togglePage(page.num)}
                >
                  <CheckIconWrapper $selected={selectedPages.includes(page.num)}>
                    {selectedPages.includes(page.num) && <CheckCircle2 size={14} />}
                  </CheckIconWrapper>
                  <PageTitle>{page.title}</PageTitle>
                  <PageSubtitle>{page.desc}</PageSubtitle>
                </PageCard>
              ))}
            </CardsGrid>
          </>
        ) : (
          <>
            <PhaseBadge>
              <BookOpen size={14} />
              Phase 1: Recognition
            </PhaseBadge>

            <CardContainer $revealed={isFlipped} onClick={!isFlipped ? handleFlip : undefined}>
              <SpeakerButton onClick={(e) => e.stopPropagation()}>
                <Volume2 size={22} />
              </SpeakerButton>
              
              <MainWord>{currentWord.word}</MainWord>
              
              {!isFlipped && (
                <TapHint>Tap to reveal translation</TapHint>
              )}
              
              {isFlipped && (
                <>
                  <MainWord style={{ fontSize: '2rem', color: '#a855f7', marginTop: '1rem' }}>
                    {currentWord.translation}
                  </MainWord>
                  <TapHint style={{ fontStyle: 'italic' }}>"{currentWord.example}"</TapHint>
                </>
              )}
            </CardContainer>

            {isFlipped && (
              <ControlsContainer>
                <ControlButton 
                  $variant="reject" 
                  onClick={handleReviewLater}
                >
                  <X size={28} />
                </ControlButton>
                <ControlButton 
                  $variant="approve" 
                  onClick={handleGotIt}
                >
                  <Check size={28} />
                </ControlButton>
              </ControlsContainer>
            )}

            <ProgressInfo>
              {currentWordIndex + 1} / {totalWords} words
            </ProgressInfo>
          </>
        )}
      </MainContent>

      {view === 'selection' && selectedPages.length > 0 && (
        <FloatingActionBar $isVisible={selectedPages.length > 0}>
          <ModeSelector>
            <ModeButton 
              $active={studyMode === 'mixed'} 
              onClick={() => setStudyMode('mixed')}
            >
              <Shuffle size={16} />
              Mixed
            </ModeButton>
            <ModeButton 
              $active={studyMode === 'speaking'} 
              onClick={() => setStudyMode('speaking')}
            >
              <Mic size={16} />
              Speaking
            </ModeButton>
            <ModeButton 
              $active={studyMode === 'writing'} 
              onClick={() => setStudyMode('writing')}
            >
              <PenTool size={16} />
              Writing
            </ModeButton>
          </ModeSelector>
          
          <SelectionInfo>
            <SelectionCountLabel>Pages Selected</SelectionCountLabel>
            <SelectionNumber>{selectedPages.length}</SelectionNumber>
          </SelectionInfo>
          
          <StartButton onClick={startStudySession}>
            <Play size={18} />
            Start Study
          </StartButton>
        </FloatingActionBar>
      )}
    </Container>
  );
};
