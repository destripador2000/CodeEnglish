import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  MessageCircle,
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

interface IdiomPage {
  id: string;
  pageNumber: number;
  subtitle: string;
  idioms: IdiomData[];
}

interface IdiomData {
  phrase: string;
  meaning: string;
  example: string;
}

const MeaningText = styled.span`
  font-size: 1.75rem;
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

const pagesData: IdiomPage[] = [
  {
    id: 'page-41',
    pageNumber: 41,
    subtitle: 'Office Idioms',
    idioms: [
      { phrase: 'Call it a day', meaning: 'Terminar de trabajar por hoy', example: "We've fixed all the bugs, let's call it a day." },
      { phrase: 'Get the ball rolling', meaning: 'Comenzar un proyecto', example: "We need to get the ball rolling on this project." }
    ]
  },
  {
    id: 'page-42',
    pageNumber: 42,
    subtitle: 'Office Idioms',
    idioms: [
      { phrase: 'Think outside the box', meaning: 'Pensar creativamente', example: "We need to think outside the box to solve this." },
      { phrase: 'Hit the nail on the head', meaning: 'Acertar en algo', example: "You hit the nail on the head with that solution!" }
    ]
  },
  {
    id: 'page-43',
    pageNumber: 43,
    subtitle: 'Office Idioms',
    idioms: [
      { phrase: 'Play it by ear', meaning: 'Improvisar', example: "Let's play it by ear and see how the meeting goes." },
      { phrase: 'Take it easy', meaning: 'Relajarse', example: "After the deadline, I'm going to take it easy." }
    ]
  },
  {
    id: 'page-44',
    pageNumber: 44,
    subtitle: 'Office Idioms',
    idioms: [
      { phrase: 'Back to the drawing board', meaning: 'Volver a planificar', example: "The feature failed, so it's back to the drawing board." },
      { phrase: 'Beat around the bush', meaning: 'Andar con rodeos', example: "Stop beating around the bush and tell me the truth." }
    ]
  }
];

export const IdiomsStudy = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('selection');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards');
  const [revealed, setRevealed] = useState(false);
  const [currentIdiomIndex, setCurrentIdiomIndex] = useState(0);

  const allIdioms = pagesData
    .filter(p => selectedPages.includes(p.id))
    .flatMap(p => p.idioms);
  
  const currentIdiom = allIdioms[currentIdiomIndex];
  const totalIdioms = allIdioms.length;

  const handleBack = () => {
    if (view === 'study') {
      setView('selection');
      setRevealed(false);
      setCurrentIdiomIndex(0);
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
      setCurrentIdiomIndex(0);
      setRevealed(false);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleNextIdiom = () => {
    if (currentIdiomIndex < totalIdioms - 1) {
      setCurrentIdiomIndex(prev => prev + 1);
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
          <MessageCircle size={20} />
          {view === 'selection' ? 'Select your Idiom Pages' : `Mode: ${studyMode.toUpperCase()}`}
        </HeaderTitle>
        
        <Spacer />
      </TopBar>

      <MainContent>
        {view === 'selection' ? (
          <>
            <SelectionTitle>Select your Idiom Pages</SelectionTitle>
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
              <MessageCircle size={14} />
              Phase: Idiom Reveal
            </PhaseBadge>

            <CardContainer $revealed={revealed} onClick={!revealed ? handleReveal : undefined}>
              <SpeakerButton onClick={(e) => e.stopPropagation()}>
                <Volume2 size={22} />
              </SpeakerButton>
              
              <MainWord>{currentIdiom?.phrase}</MainWord>
              
              {!revealed && (
                <TapHint>Tap to reveal meaning</TapHint>
              )}
              
              {revealed && currentIdiom && (
                <>
                  <MeaningText>{currentIdiom.meaning}</MeaningText>
                  <ExampleContainer>
                    <ExampleLabel>Example</ExampleLabel>
                    <ExampleText>"{currentIdiom.example}"</ExampleText>
                  </ExampleContainer>
                </>
              )}
            </CardContainer>

            {revealed && (
              <ControlsContainer>
                <ControlButton $variant="reject" onClick={handleNextIdiom}>
                  <X size={28} />
                </ControlButton>
                <ControlButton $variant="approve" onClick={handleNextIdiom}>
                  <Check size={28} />
                </ControlButton>
              </ControlsContainer>
            )}

            <ProgressInfo>
              {currentIdiomIndex + 1} / {totalIdioms} idioms
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
