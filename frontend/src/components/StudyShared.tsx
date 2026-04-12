import styled, { keyframes, css } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
`;

export const BackgroundGlow = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  position: relative;
  padding-bottom: 120px;
`;

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  position: relative;
  z-index: 10;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

export const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;

  svg { color: #a855f7; }
`;

export const Spacer = styled.div`
  width: 100px;
`;

export const SelectionTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const SelectionSubtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  animation: ${fadeIn} 0.7s ease-out;
`;

export const PageCard = styled.button<{ $selected: boolean }>`
  padding: 1.5rem;
  border-radius: 16px;
  background: ${({ $selected }) => $selected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 2px solid ${({ $selected }) => $selected ? '#6366f1' : 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.5);
    transform: translateY(-2px);
  }

  ${({ $selected }) => $selected && css`
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  `}
`;

export const PageTitle = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
`;

export const PageSubtitle = styled.span<{ $isIrregular?: boolean }>`
  font-size: 0.85rem;
  color: ${({ $isIrregular }) => $isIrregular ? '#f472b6' : 'rgba(255, 255, 255, 0.6)'};
  font-weight: ${({ $isIrregular }) => $isIrregular ? '600' : '400'};
`;

export const CheckIconWrapper = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $selected }) => $selected ? '#6366f1' : 'transparent'};
  border: 2px solid ${({ $selected }) => $selected ? '#6366f1' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
`;

export const FloatingActionBar = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  bottom: ${({ $isVisible }) => ($isVisible ? '2rem' : '-150px')};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  background: rgba(20, 20, 35, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transition: bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    width: 90%;
    border-radius: 24px;
  }
`;

export const ModeSelector = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.25rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const ModeButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ $active }) => $active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
  background: ${({ $active }) => $active ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent'};
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  white-space: nowrap;

  &:hover { color: white; }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 0.6rem 0.5rem;
    font-size: 0.8rem;
  }
`;

export const SelectionInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const SelectionCountLabel = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const SelectionNumber = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
`;

export const StartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.5);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  animation: ${fadeIn} 0.7s ease-out;
`;

export const ControlButton = styled.button<{ $variant: 'reject' | 'approve' }>`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  ${({ $variant }) => $variant === 'reject' ? css`
    background: rgba(239, 68, 68, 0.15);
    border: 2px solid rgba(239, 68, 68, 0.4);
    color: #ef4444;
    
    &:hover {
      background: rgba(239, 68, 68, 0.25);
      transform: scale(1.1);
    }
  ` : css`
    background: linear-gradient(135deg, #6366f1, #a855f7);
    border: none;
    color: white;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5);
    }
  `}
`;

export const PhaseBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(99, 102, 241, 0.15);
  color: #a855f7;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const CardContainer = styled.div<{ $revealed?: boolean }>`
  width: 100%;
  max-width: 600px;
  padding: 3rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  transition: all 0.4s ease;
  cursor: ${({ $revealed }) => $revealed === false ? 'pointer' : 'default'};

  ${({ $revealed }) => $revealed && css`
    background: rgba(99, 102, 241, 0.08);
    border-color: rgba(99, 102, 241, 0.2);
  `}
`;

export const SpeakerButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a855f7;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(99, 102, 241, 0.3);
    transform: scale(1.1);
  }
`;

export const MainWord = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const TapHint = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1rem;
`;

export const ProgressInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;
