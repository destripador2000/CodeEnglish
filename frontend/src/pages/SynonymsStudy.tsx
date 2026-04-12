import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  Layers,
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
  ControlsContainer,
  ControlButton,
  PhaseBadge,
  ProgressInfo,
  SpeakerButton
} from '../components/StudyShared';

type StudyMode = 'flashcards' | 'speaking' | 'writing';
type ViewState = 'selection' | 'study';

interface SynonymPage {
  id: string;
  pageNumber: number;
  subtitle: string;
  synonyms: SynonymData[];
}

interface SynonymData {
  word: string;
  synonym: string;
}

const flipIn = keyframes`
  from { opacity: 0; transform: rotateY(90deg); }
  to { opacity: 1; transform: rotateY(0); }
`;

const FlipCardContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  max-width: 450px;
  height: 280px;
  cursor: pointer;
  animation: ${flipIn} 0.6s ease-out;
`;

const FlipCardInner = styled.div<{ $isFlipped: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ $isFlipped }) => $isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const FlipCardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FlipCardFront = styled(FlipCardFace)``;

const FlipCardBack = styled(FlipCardFace)`
  transform: rotateY(180deg);
  background: rgba(168, 85, 247, 0.08);
  border-color: rgba(168, 85, 247, 0.2);
`;

const WordText = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin: 0;
`;

const TapHint = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1rem;
`;

const SynonymText = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: #a855f7;
  text-align: center;
  margin: 0;
`;

const pagesData: SynonymPage[] = [
  {
    id: 'page-46',
    pageNumber: 46,
    subtitle: 'Synonyms',
    synonyms: [
      { word: 'Fix', synonym: 'Resolve' },
      { word: 'Build', synonym: 'Construct' }
    ]
  },
  {
    id: 'page-47',
    pageNumber: 47,
    subtitle: 'Synonyms',
    synonyms: [
      { word: 'Change', synonym: 'Modify' },
      { word: 'Start', synonym: 'Initiate' }
    ]
  },
  {
    id: 'page-48',
    pageNumber: 48,
    subtitle: 'Synonyms',
    synonyms: [
      { word: 'Find', synonym: 'Discover' },
      { word: 'Save', synonym: 'Preserve' }
    ]
  },
  {
    id: 'page-49',
    pageNumber: 49,
    subtitle: 'Synonyms',
    synonyms: [
      { word: 'Test', synonym: 'Verify' },
      { word: 'Fix', synonym: 'Repair' }
    ]
  },
  {
    id: 'page-50',
    pageNumber: 50,
    subtitle: 'Synonyms',
    synonyms: [
      { word: 'Create', synonym: 'Generate' },
      { word: 'Remove', synonym: 'Delete' }
    ]
  }
];

export const SynonymsStudy = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('selection');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allSynonyms = pagesData
    .filter(p => selectedPages.includes(p.id))
    .flatMap(p => p.synonyms);
  
  const currentWord = allSynonyms[currentIndex];
  const totalWords = allSynonyms.length;

  const handleBack = () => {
    if (view === 'study') {
      setView('selection');
      setIsFlipped(false);
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
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = () => {
    if (currentIndex < totalWords - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
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
          <Layers size={20} />
          {view === 'selection' ? 'Select your Synonym Pages' : `Mode: ${studyMode.toUpperCase()}`}
        </HeaderTitle>
        
        <Spacer />
      </TopBar>

      <MainContent>
        {view === 'selection' ? (
          <>
            <SelectionTitle>Select your Synonym Pages</SelectionTitle>
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
              <Layers size={14} />
              Phase: Synonym Recall
            </PhaseBadge>

            <FlipCardContainer onClick={handleFlip}>
              <FlipCardInner $isFlipped={isFlipped}>
                <FlipCardFront>
                  <SpeakerButton onClick={(e) => e.stopPropagation()}>
                    <Volume2 size={22} />
                  </SpeakerButton>
                  <WordText>{currentWord?.word}</WordText>
                  <TapHint>Tap to flip</TapHint>
                </FlipCardFront>
                <FlipCardBack>
                  <SpeakerButton onClick={(e) => e.stopPropagation()}>
                    <Volume2 size={22} />
                  </SpeakerButton>
                  <SynonymText>{currentWord?.synonym}</SynonymText>
                  <TapHint>Tap to flip back</TapHint>
                </FlipCardBack>
              </FlipCardInner>
            </FlipCardContainer>

            {isFlipped && (
              <ControlsContainer>
                <ControlButton $variant="reject" onClick={handleNextWord}>
                  <X size={28} />
                </ControlButton>
                <ControlButton $variant="approve" onClick={handleNextWord}>
                  <Check size={28} />
                </ControlButton>
              </ControlsContainer>
            )}

            <ProgressInfo>
              {currentIndex + 1} / {totalWords} words
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
