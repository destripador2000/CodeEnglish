import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Quote,
  CheckCircle2, 
  Play, 
  ArrowLeft, 
  Mic, 
  PenTool, 
  Shuffle,
  Volume2,
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

type StudyMode = 'flashcards' | 'speaking' | 'writing';
type ViewState = 'selection' | 'study';

interface SayingPage {
  id: string;
  pageNumber: number;
  subtitle: string;
  sayings: SayingData[];
}

interface SayingData {
  saying: string;
  meaning: string;
  example: string;
}

const MeaningText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #a855f7;
  text-align: center;
  margin-top: 1.5rem;
`;

const ExampleContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  max-width: 90%;
`;

const ExampleLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

const ExampleText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  line-height: 1.5;
  margin: 0;
`;

const pagesData: SayingPage[] = [
  {
    id: 'page-51',
    pageNumber: 51,
    subtitle: 'Common Sayings',
    sayings: [
      { saying: 'A piece of cake', meaning: 'Algo muy fácil de hacer', example: "Updating the CSS was a piece of cake." },
      { saying: 'Break the ice', meaning: 'Romper el hielo / iniciar conversación', example: "Let me tell a joke to break the ice." }
    ]
  },
  {
    id: 'page-52',
    pageNumber: 52,
    subtitle: 'Common Sayings',
    sayings: [
      { saying: 'Bite the bullet', meaning: 'Face something difficult', example: "I had to bite the bullet and tell the client the bad news." },
      { saying: 'Burn the midnight oil', meaning: 'Trabajar hasta muy tarde', example: "She burned the midnight oil to finish the project." }
    ]
  },
  {
    id: 'page-53',
    pageNumber: 53,
    subtitle: 'Common Sayings',
    sayings: [
      { saying: 'Cut to the chase', meaning: 'Ir al grano', example: "Let's cut to the chase, what's the budget?" },
      { saying: 'Hit the sack', meaning: 'Ir a dormir', example: "It's been a long day, I'm going to hit the sack." }
    ]
  },
  {
    id: 'page-54',
    pageNumber: 54,
    subtitle: 'Common Sayings',
    sayings: [
      { saying: 'The ball is in your court', meaning: 'Te toca a ti decidir', example: "I've made my offer, now the ball is in your court." },
      { saying: 'Under the weather', meaning: 'No sentirse bien / enfermo', example: "I'm feeling under the weather today." }
    ]
  }
];

export const SayingsStudy = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('selection');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards');
  const [revealed, setRevealed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allSayings = pagesData
    .filter(p => selectedPages.includes(p.id))
    .flatMap(p => p.sayings);
  
  const currentSaying = allSayings[currentIndex];
  const totalSayings = allSayings.length;

  const handleBack = () => {
    if (view === 'study') {
      setView('selection');
      setRevealed(false);
      setCurrentIndex(0);
    } else {
      navigate('/dashboard');
    }
  };

  const togglePageSelection = (pageId: string) => {
    setSelectedPages(prev => 
      prev.includes(pageId) 
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleStartStudy = () => {
    if (selectedPages.length > 0) {
      setView('study');
      setCurrentIndex(0);
      setRevealed(false);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleNextSaying = () => {
    if (currentIndex < totalSayings - 1) {
      setCurrentIndex(prev => prev + 1);
      setRevealed(false);
    } else {
      navigate('/dashboard');
    }
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
          <Quote size={20} />
          {view === 'selection' ? 'Select your Sayings Pages' : `Mode: ${studyMode.toUpperCase()}`}
        </HeaderTitle>
        
        <Spacer />
      </TopBar>

      <MainContent>
        {view === 'selection' ? (
          <>
            <SelectionTitle>Select your Sayings Pages</SelectionTitle>
            <SelectionSubtitle>Choose the pages you want to study today</SelectionSubtitle>
            
            <CardsGrid>
              {pagesData.map((page) => (
                <PageCard
                  key={page.id}
                  $selected={selectedPages.includes(page.id)}
                  onClick={() => togglePageSelection(page.id)}
                >
                  <CheckIconWrapper $selected={selectedPages.includes(page.id)}>
                    {selectedPages.includes(page.id) && <CheckCircle2 size={14} />}
                  </CheckIconWrapper>
                  <PageTitle>Page {page.pageNumber}</PageTitle>
                  <PageSubtitle>{page.subtitle}</PageSubtitle>
                </PageCard>
              ))}
            </CardsGrid>
          </>
        ) : (
          <>
            <PhaseBadge>
              <Quote size={14} />
              Phase: Saying Reveal
            </PhaseBadge>

            <CardContainer $revealed={revealed} onClick={!revealed ? handleReveal : undefined}>
              <SpeakerButton onClick={(e) => e.stopPropagation()}>
                <Volume2 size={22} />
              </SpeakerButton>
              
              <MainWord>{currentSaying?.saying}</MainWord>
              
              {!revealed && (
                <TapHint>Tap to reveal meaning</TapHint>
              )}
              
              {revealed && currentSaying && (
                <>
                  <MeaningText>{currentSaying.meaning}</MeaningText>
                  <ExampleContainer>
                    <ExampleLabel>Example</ExampleLabel>
                    <ExampleText>"{currentSaying.example}"</ExampleText>
                  </ExampleContainer>
                </>
              )}
            </CardContainer>

            {revealed && (
              <ControlsContainer>
                <ControlButton $variant="reject" onClick={handleNextSaying}>
                  <X size={28} />
                </ControlButton>
                <ControlButton $variant="approve" onClick={handleNextSaying}>
                  <Check size={28} />
                </ControlButton>
              </ControlsContainer>
            )}

            <ProgressInfo>
              {currentIndex + 1} / {totalSayings} sayings
            </ProgressInfo>
          </>
        )}
      </MainContent>

      <FloatingActionBar $isVisible={view === 'selection' && selectedPages.length > 0}>
        <ModeSelector>
          <ModeButton 
            $active={studyMode === 'flashcards'} 
            onClick={() => setStudyMode('flashcards')}
          >
            <Shuffle size={16} />
            Flashcards
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
        
        <StartButton onClick={handleStartStudy}>
          <Play size={18} />
          Start Study
        </StartButton>
      </FloatingActionBar>
    </Container>
  );
};
