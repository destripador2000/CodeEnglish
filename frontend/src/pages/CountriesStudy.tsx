import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Globe,
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

interface CountryPage {
  id: string;
  pageNumber: number;
  subtitle: string;
  countries: CountryData[];
}

interface CountryData {
  country: string;
  adjective: string;
  person: string;
}

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const DetailValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #a855f7;
  text-align: center;
`;

const pagesData: CountryPage[] = [
  {
    id: 'page-56',
    pageNumber: 56,
    subtitle: 'Countries & Nationalities',
    countries: [
      { country: 'Brazil', adjective: 'Brazilian', person: 'a Brazilian' },
      { country: 'Japan', adjective: 'Japanese', person: 'a Japanese' }
    ]
  },
  {
    id: 'page-57',
    pageNumber: 57,
    subtitle: 'Countries & Nationalities',
    countries: [
      { country: 'Germany', adjective: 'German', person: 'a German' },
      { country: 'France', adjective: 'French', person: 'a French person' }
    ]
  },
  {
    id: 'page-58',
    pageNumber: 58,
    subtitle: 'Countries & Nationalities',
    countries: [
      { country: 'Italy', adjective: 'Italian', person: 'an Italian' },
      { country: 'Spain', adjective: 'Spanish', person: 'a Spaniard' }
    ]
  },
  {
    id: 'page-59',
    pageNumber: 59,
    subtitle: 'Countries & Nationalities',
    countries: [
      { country: 'China', adjective: 'Chinese', person: 'a Chinese person' },
      { country: 'India', adjective: 'Indian', person: 'an Indian' }
    ]
  },
  {
    id: 'page-60',
    pageNumber: 60,
    subtitle: 'Countries & Nationalities',
    countries: [
      { country: 'Russia', adjective: 'Russian', person: 'a Russian' },
      { country: 'Egypt', adjective: 'Egyptian', person: 'an Egyptian' }
    ]
  },
  {
    id: 'page-61',
    pageNumber: 61,
    subtitle: 'Countries & Nationalities',
    countries: [
      { country: 'Australia', adjective: 'Australian', person: 'an Australian' },
      { country: 'Canada', adjective: 'Canadian', person: 'a Canadian' }
    ]
  },
  {
    id: 'page-62',
    pageNumber: 62,
    subtitle: 'Countries & Nationalities',
    countries: [
      { country: 'Mexico', adjective: 'Mexican', person: 'a Mexican' },
      { country: 'Argentina', adjective: 'Argentine', person: 'an Argentine' }
    ]
  }
];

export const CountriesStudy = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('selection');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards');
  const [revealed, setRevealed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allCountries = pagesData
    .filter(p => selectedPages.includes(p.id))
    .flatMap(p => p.countries);
  
  const currentCountry = allCountries[currentIndex];
  const totalCountries = allCountries.length;

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

  const handleNextCountry = () => {
    if (currentIndex < totalCountries - 1) {
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
          <Globe size={20} />
          {view === 'selection' ? 'Select your Country Pages' : `Mode: ${studyMode.toUpperCase()}`}
        </HeaderTitle>
        
        <Spacer />
      </TopBar>

      <MainContent>
        {view === 'selection' ? (
          <>
            <SelectionTitle>Select your Country Pages</SelectionTitle>
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
              <Globe size={14} />
              Phase: Nationality Reveal
            </PhaseBadge>

            <CardContainer $revealed={revealed} onClick={!revealed ? handleReveal : undefined}>
              <SpeakerButton onClick={(e) => e.stopPropagation()}>
                <Volume2 size={22} />
              </SpeakerButton>
              
              <MainWord>{currentCountry?.country}</MainWord>
              
              {!revealed && (
                <TapHint>Tap to reveal nationality</TapHint>
              )}
              
              {revealed && currentCountry && (
                <DetailsGrid>
                  <DetailItem>
                    <DetailLabel>Nationality</DetailLabel>
                    <DetailValue>{currentCountry.adjective}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Person</DetailLabel>
                    <DetailValue>{currentCountry.person}</DetailValue>
                  </DetailItem>
                </DetailsGrid>
              )}
            </CardContainer>

            {revealed && (
              <ControlsContainer>
                <ControlButton $variant="reject" onClick={handleNextCountry}>
                  <X size={28} />
                </ControlButton>
                <ControlButton $variant="approve" onClick={handleNextCountry}>
                  <Check size={28} />
                </ControlButton>
              </ControlsContainer>
            )}

            <ProgressInfo>
              {currentIndex + 1} / {totalCountries} countries
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
