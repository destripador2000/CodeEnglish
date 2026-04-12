import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Zap, 
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
  ProgressInfo,
  fadeIn
} from '../components/StudyShared';

type StudyMode = 'flashcards' | 'speaking' | 'writing';
type ViewState = 'selection' | 'study';

interface VerbPage {
  id: string;
  pageNumber: number;
  subtitle: string;
  isIrregular?: boolean;
  verbs: VerbData[];
}

interface VerbData {
  base: string;
  pastSimple: string;
  pastParticiple: string;
  spanish: string;
}

const ConjugationsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const ConjugationItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ConjugationLabel = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ConjugationValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  text-align: center;
`;

const SpanishTranslation = styled.span`
  font-size: 1.1rem;
  color: #a855f7;
  text-align: center;
`;

const pagesData: VerbPage[] = [
  {
    id: 'page-32',
    pageNumber: 32,
    subtitle: 'Regular Verbs',
    verbs: [
      { base: 'To Work', pastSimple: 'Worked', pastParticiple: 'Worked', spanish: 'Trabajar' },
      { base: 'To Play', pastSimple: 'Played', pastParticiple: 'Played', spanish: 'Jugar' },
    ]
  },
  {
    id: 'page-33',
    pageNumber: 33,
    subtitle: 'Regular Verbs',
    verbs: [
      { base: 'To Study', pastSimple: 'Studied', pastParticiple: 'Studied', spanish: 'Estudiar' },
      { base: 'To Cook', pastSimple: 'Cooked', pastParticiple: 'Cooked', spanish: 'Cocinar' },
    ]
  },
  {
    id: 'page-34',
    pageNumber: 34,
    subtitle: 'Regular Verbs',
    verbs: [
      { base: 'To Talk', pastSimple: 'Talked', pastParticiple: 'Talked', spanish: 'Hablar' },
      { base: 'To Wait', pastSimple: 'Waited', pastParticiple: 'Waited', spanish: 'Esperar' },
    ]
  },
  {
    id: 'page-36',
    pageNumber: 36,
    subtitle: 'Irregular Verbs',
    isIrregular: true,
    verbs: [
      { base: 'To Be', pastSimple: 'Was/Were', pastParticiple: 'Been', spanish: 'Ser/Estar' },
      { base: 'To Have', pastSimple: 'Had', pastParticiple: 'Had', spanish: 'Tener' },
    ]
  },
  {
    id: 'page-37',
    pageNumber: 37,
    subtitle: 'Irregular Verbs',
    isIrregular: true,
    verbs: [
      { base: 'To Go', pastSimple: 'Went', pastParticiple: 'Gone', spanish: 'Ir' },
      { base: 'To Do', pastSimple: 'Did', pastParticiple: 'Done', spanish: 'Hacer' },
    ]
  },
  {
    id: 'page-38',
    pageNumber: 38,
    subtitle: 'Irregular Verbs',
    isIrregular: true,
    verbs: [
      { base: 'To Write', pastSimple: 'Wrote', pastParticiple: 'Written', spanish: 'Escribir' },
      { base: 'To See', pastSimple: 'Saw', pastParticiple: 'Seen', spanish: 'Ver' },
    ]
  },
  {
    id: 'page-39',
    pageNumber: 39,
    subtitle: 'Irregular Verbs',
    isIrregular: true,
    verbs: [
      { base: 'To Eat', pastSimple: 'Ate', pastParticiple: 'Eaten', spanish: 'Comer' },
      { base: 'To Drink', pastSimple: 'Drank', pastParticiple: 'Drunk', spanish: 'Beber' },
    ]
  },
];

export const VerbsStudy = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('selection');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards');
  const [revealed, setRevealed] = useState(false);
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);

  const allVerbs = pagesData
    .filter(p => selectedPages.includes(p.id))
    .flatMap(p => p.verbs);
  
  const currentVerb = allVerbs[currentVerbIndex];
  const totalVerbs = allVerbs.length;

  const handleBack = () => {
    if (view === 'study') {
      setView('selection');
      setRevealed(false);
      setCurrentVerbIndex(0);
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
      setCurrentVerbIndex(0);
      setRevealed(false);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleNextVerb = () => {
    if (currentVerbIndex < totalVerbs - 1) {
      setCurrentVerbIndex(prev => prev + 1);
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
          <Zap size={20} />
          {view === 'selection' ? 'Select your Verb Pages' : `Mode: ${studyMode.toUpperCase()}`}
        </HeaderTitle>
        
        <Spacer />
      </TopBar>

      <MainContent>
        {view === 'selection' ? (
          <>
            <SelectionTitle>Select your Verb Pages</SelectionTitle>
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
                  <PageSubtitle $isIrregular={page.isIrregular}>{page.subtitle}</PageSubtitle>
                </PageCard>
              ))}
            </CardsGrid>
          </>
        ) : (
          <>
            <PhaseBadge>
              <Zap size={14} />
              Phase: Conjugation Reveal
            </PhaseBadge>

            <CardContainer $revealed={revealed} onClick={!revealed ? handleReveal : undefined}>
              <SpeakerButton onClick={(e) => e.stopPropagation()}>
                <Volume2 size={22} />
              </SpeakerButton>
              
              <MainWord>{currentVerb?.base}</MainWord>
              
              {!revealed && (
                <TapHint>Tap to reveal conjugations</TapHint>
              )}
              
              {revealed && currentVerb && (
                <ConjugationsContainer>
                  <ConjugationItem>
                    <ConjugationLabel>Past Simple</ConjugationLabel>
                    <ConjugationValue>{currentVerb.pastSimple}</ConjugationValue>
                  </ConjugationItem>
                  <ConjugationItem>
                    <ConjugationLabel>Past Participle</ConjugationLabel>
                    <ConjugationValue>{currentVerb.pastParticiple}</ConjugationValue>
                  </ConjugationItem>
                  <ConjugationItem>
                    <ConjugationLabel>Spanish</ConjugationLabel>
                    <SpanishTranslation>{currentVerb.spanish}</SpanishTranslation>
                  </ConjugationItem>
                </ConjugationsContainer>
              )}
            </CardContainer>

            {revealed && (
              <ControlsContainer>
                <ControlButton $variant="reject" onClick={handleNextVerb}>
                  <X size={28} />
                </ControlButton>
                <ControlButton $variant="approve" onClick={handleNextVerb}>
                  <Check size={28} />
                </ControlButton>
              </ControlsContainer>
            )}

            <ProgressInfo>
              {currentVerbIndex + 1} / {totalVerbs} verbs
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
