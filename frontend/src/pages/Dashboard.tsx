import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { BookOpen, MessageCircle, PencilLine, Zap, Quote, Globe, Layers, LogOut, Menu, X, User } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  background: #0f0f1a;
`;

/* --- MOBILE HEADER & OVERLAY --- */
const MobileHeader = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: rgba(20, 20, 35, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 80;
  }
`;

const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: white;
    font-size: 0.9rem;
  }
  
  h2 {
    font-size: 1.1rem;
    font-weight: 800;
    color: white;
    margin: 0;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 90;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
    transition: opacity 0.3s ease;
  }
`;

/* --- SIDEBAR --- */
const Sidebar = styled.nav<{ $isOpen: boolean }>`
  width: 280px;
  height: 100%;
  background: rgba(20, 20, 35, 0.4);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    width: 240px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    background: rgba(20, 20, 35, 0.95);
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    box-shadow: ${({ $isOpen }) => ($isOpen ? '10px 0 30px rgba(0,0,0,0.5)' : 'none')};
  }
`;

const LogoArea = styled.div`
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DesktopLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: white;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }
  
  h2 {
    font-size: 1.2rem;
    font-weight: 800;
    color: white;
    margin: 0;
  }
`;

const CloseButton = styled(IconButton)`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    color: rgba(255, 255, 255, 0.6);
    &:hover { color: white; }
  }
`;

const MenuWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem;
  
  /* Ocultar barra en el sidebar también */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    width: 18px;
    height: 18px;
    color: currentColor;
    transition: color 0.2s;
  }

  &:hover {
    background: rgba(99, 102, 241, 0.1);
    color: white;
    transform: translateX(4px);
  }
`;

const ProfileWidget = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0 1rem 0.5rem 1rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(99, 102, 241, 0.3);
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2a2a35;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  strong {
    color: white;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    color: #6366f1;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const LogoutWrapper = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  color: #ef4444;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;

  svg { width: 18px; height: 18px; }
  &:hover { background: rgba(239, 68, 68, 0.1); }
`;

/* --- MAIN CONTENT --- */
const MainContent = styled.main`
  flex: 1;
  height: 100%;
  padding: 1.5rem 3rem;
  overflow-y: auto;
  position: relative;

  /* AQUÍ ESTÁ EL TRUCO PARA OCULTAR EL SCROLLBAR */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  @media (max-width: 1024px) { 
    padding: 1.5rem; 
  }
  
  @media (max-width: 768px) { 
    padding: 5rem 1.5rem 1.5rem 1.5rem; 
  }
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vw;
    top: -20vw;
    right: -20vw;
  }
`;

const Header = styled.header`
  position: relative;
  z-index: 1;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Greeting = styled.h1`
  font-size: 2.2rem;
  color: white;
  font-weight: 800;
  margin-bottom: 0.2rem;
  line-height: 1.2;

  @media (max-width: 768px) { font-size: 1.8rem; }
`;

const SubGreeting = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
`;

const CategoryGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.2rem;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.3);
  }
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  svg {
    width: 20px;
    height: 20px;
    color: #a855f7;
  }
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  margin-top: 0;
`;

const CardDesc = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1.2rem;
  flex: 1; 
`;

const CardButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  background: #6366f1;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.25s;

  &:hover {
    background: #4f46e5;
    box-shadow: 0 8px 15px -3px rgba(99, 102, 241, 0.4);
  }
`;

// ARREGLO FUSIONADO CON DESCRIPCIONES EN INGLÉS
const menuItems = [
  { path: '/dashboard/vocabulary', label: 'Vocabulary', icon: BookOpen, desc: 'Build a solid foundation by learning the essential words of the unit.' },
  { path: '/dashboard/idioms', label: 'Idioms', icon: MessageCircle, desc: 'Understand real English by mastering the most common idiomatic expressions.' },
  { path: '/dashboard/grammar', label: 'Grammar', icon: PencilLine, desc: 'Perfect your sentence structure with clear grammar rules.' },
  { path: '/dashboard/verbs', label: 'Regular & Irregular Verbs', icon: Zap, desc: 'Practice and memorize key verb conjugations for fluency.' },
  { path: '/dashboard/sayings', label: 'Sayings', icon: Quote, desc: 'Connect with the language\'s culture through popular sayings and proverbs.' },
  { path: '/dashboard/countries', label: 'Countries & Nationalities', icon: Globe, desc: 'Explore geographical vocabulary, origins, and nationalities.' },
  { path: '/dashboard/synonyms', label: 'Synonyms', icon: Layers, desc: 'Enrich your lexicon by discovering word alternatives and nuances.' },
];

export const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <Container>
      <MobileHeader>
        <MobileLogo>
          <div className="icon">CE</div>
          <h2>CodeEnglish</h2>
        </MobileLogo>
        <IconButton onClick={toggleMenu}>
          <Menu size={28} />
        </IconButton>
      </MobileHeader>

      <Overlay $isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />

      <Sidebar $isOpen={isMobileMenuOpen}>
        <LogoArea>
          <DesktopLogo>
            <div className="icon">CE</div>
            <h2>CodeEnglish</h2>
          </DesktopLogo>
          <CloseButton onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </CloseButton>
        </LogoArea>
        <MenuWrapper>
          <MenuList>
            {menuItems.map((item) => (
              <li key={item.path}>
                <MenuLink to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <item.icon />
                  {item.label}
                </MenuLink>
              </li>
            ))}
          </MenuList>
        </MenuWrapper>
        
        {/* TEXTO DE PERFIL EN INGLÉS */}
        <ProfileWidget to="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)}>
          <Avatar>
            <User size={20} />
          </Avatar>
          <ProfileInfo>
            <strong>Developer</strong>
            <span>View profile & progress</span>
          </ProfileInfo>
        </ProfileWidget>

        <LogoutWrapper>
          <LogoutButton onClick={handleLogout}>
            <LogOut />
            Log Out
          </LogoutButton>
        </LogoutWrapper>
      </Sidebar>

      <MainContent>
        <BackgroundGlow />
        <Header>
          <Greeting>CodeEnglish Dashboard</Greeting>
          <SubGreeting>Choose a category to start learning</SubGreeting>
        </Header>
        
        <CategoryGrid>
          {menuItems.map((item) => (
            <CategoryCard key={`card-${item.path}`}>
              <CardIcon><item.icon /></CardIcon>
              <CardTitle>{item.label}</CardTitle>
              <CardDesc>{item.desc}</CardDesc>
              <CardButton to={item.path}>Start Module</CardButton>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </MainContent>
    </Container>
  );
};
