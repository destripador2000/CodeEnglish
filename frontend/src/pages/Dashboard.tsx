import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { BookOpen, MessageCircle, PencilLine, Zap, Quote, Globe, Flag, Layers, LogOut, Menu, X, User } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  height: 100%; 
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
  &::-webkit-scrollbar { width: 0; }
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

/* --- NUEVO: WIDGET DE PERFIL --- */
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
  padding: 3rem 4rem;
  overflow-y: auto;
  position: relative;

  @media (max-width: 1024px) { 
    padding: 2rem; 
  }
  
  @media (max-width: 768px) { 
    padding: 6rem 1.5rem 2rem 1.5rem; 
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
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) { margin-bottom: 2rem; }
`;

const Greeting = styled.h1`
  font-size: 2.5rem;
  color: white;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;

  @media (max-width: 768px) { font-size: 2rem; }
`;

const SubGreeting = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
`;

const CategoryGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.8rem;
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
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  svg {
    width: 24px;
    height: 24px;
    color: #a855f7;
  }
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  margin-top: 0;
`;

const CardDesc = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.8rem;
  flex: 1; 
`;

const CardButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  background: #6366f1;
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.25s;

  &:hover {
    background: #4f46e5;
    box-shadow: 0 8px 15px -3px rgba(99, 102, 241, 0.4);
  }
`;

const menuItems = [
  { path: '/dashboard/vocabulary', label: 'Vocabulary', icon: BookOpen, desc: 'Construye una base sólida aprendiendo las palabras esenciales de la unidad.' },
  { path: '/dashboard/idioms', label: 'Idioms', icon: MessageCircle, desc: 'Comprende el inglés real dominando las expresiones idiomáticas más comunes.' },
  { path: '/dashboard/grammar', label: 'Grammar', icon: PencilLine, desc: 'Perfecciona la estructura de tus oraciones con reglas gramaticales claras.' },
  { path: '/dashboard/verbs', label: 'Regular & Irregular Verbs', icon: Zap, desc: 'Practica y memoriza las conjugaciones verbales clave para fluidez.' },
  { path: '/dashboard/sayings', label: 'Sayings', icon: Quote, desc: 'Conecta con la cultura del idioma a través de refranes y dichos populares.' },
  { path: '/dashboard/countries', label: 'Countries', icon: Globe, desc: 'Explora el vocabulario geográfico y los nombres de los países.' },
  { path: '/dashboard/nationalities', label: 'Nationalities', icon: Flag, desc: 'Aprende a describir correctamente el origen y la nacionalidad.' },
  { path: '/dashboard/synonyms', label: 'Synonyms', icon: Layers, desc: 'Enriquece tu léxico descubriendo alternativas y matices de palabras.' },
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
        
        {/* --- EL NUEVO WIDGET DE PERFIL --- */}
        <ProfileWidget to="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)}>
          <Avatar>
            <User size={20} />
            {/* Cuando tengas imagen del backend, usarás: <img src={user.avatarUrl} alt="Profile" /> */}
          </Avatar>
          <ProfileInfo>
            <strong>Developer</strong>
            <span>Ver perfil y progreso</span>
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
