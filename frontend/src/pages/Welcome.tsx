import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const Container = styled.div`
  /* Cambiamos min-height por height fijo al 100% del padre */
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%);
`;

const BackgroundGlow = styled.div`
  position: absolute;
  /* Centramos el glow en lugar de tirarlo hacia las esquinas para evitar desbordes ocultos */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vmin; /* Usa la dimensión menor de la ventana para que sea siempre circular y contenido */
  height: 80vmin;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 60%);
  filter: blur(60px);
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 750px;
  /* Centrado perfecto, sin márgenes negativos truculentos */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;
  animation: ${float} 6s ease-in-out infinite;
`;

const Logo = styled.div`
  width: 85px;
  height: 85px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);

  span {
    font-size: 2.2rem;
    font-weight: 900;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: white;
  letter-spacing: -0.04em;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  color: #94a3b8;
  margin-bottom: 2.5rem;
  max-width: 580px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%; /* Asegura que en móvil tomen buen espacio */
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 0.9rem 2.2rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 180px;
  display: flex; /* Mejor alineación interna */
  justify-content: center;
  align-items: center;
`;

const PrimaryLink = styled(StyledLink)`
  background: #6366f1;
  color: white;
  box-shadow: 0 8px 20px -5px rgba(99, 102, 241, 0.4);

  &:hover {
    background: #4f46e5;
    transform: translateY(-3px);
    box-shadow: 0 15px 30px -8px rgba(99, 102, 241, 0.5);
  }
`;

const SecondaryLink = styled(StyledLink)`
  background: rgba(255, 255, 255, 0.04);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
  }
`;

export const Welcome = () => {
  return (
    <Container>
      <BackgroundGlow />
      <Content>
        <LogoContainer>
          <Logo>
            <span>CE</span>
          </Logo>
        </LogoContainer>
        <Title>CodeEnglish</Title>
        <Subtitle>
          Master the language of technology. The interactive platform for developers.
        </Subtitle>
        <ButtonGroup>
          <PrimaryLink to="/login">Get Started</PrimaryLink>
          <SecondaryLink to="/register">Create Account</SecondaryLink>
        </ButtonGroup>
      </Content>
    </Container>
  );
}
