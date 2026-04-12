import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Button } from '../components/Button';
import { Input, Label, FormGroup } from '../components/Input';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: relative;
  /* CLAVE: Permitimos scroll interno para pantallas pequeñas */
  overflow-y: auto; 
  background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%);
`;

const BackgroundGlow = styled.div`
  position: fixed; /* Fixed para que no se mueva si hacemos scroll */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vmin;
  height: 80vmin;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 60%);
  filter: blur(60px);
  pointer-events: none;
`;

const FormWrapper = styled.div`
  /* Usamos margin auto en un flex container para centrar de forma segura con scroll */
  margin: auto; 
  width: 100%;
  max-width: 760px; /* Tarjeta mucho más ancha para el diseño en 2 columnas */
  position: relative;
  z-index: 1;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 3.5rem 4rem; /* Más espacio para respirar */
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: ${fadeIn} 0.6s ease-out;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  @media (max-width: 640px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: white;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1rem;
`;

/* EL SECRETO DEL DISEÑO PREMIUM: CSS Grid */
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1.5rem; /* Espacio solo horizontal, el vertical lo da el FormGroup */

  @media (max-width: 640px) {
    grid-template-columns: 1fr; /* Vuelve a 1 columna en móviles */
  }
`;

/* Para campos que deben ocupar todo el ancho (ej. Email) */
const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;

  a {
    color: #6366f1;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #8b5cf6;
    }
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #6366f1;
  }
`;

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', lastname: '', birthDate: '', phone: '', email: '', username: '', password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <Container>
      <BackgroundGlow />
      <FormWrapper>
        <BackLink to="/">← Back to Home</BackLink>
        <FormCard>
          <Header>
            <Title>Create Account</Title>
            <Subtitle>Join CodeEnglish and start your journey</Subtitle>
          </Header>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" placeholder="John" value={formData.name} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="lastname">Lastname</Label>
                <Input id="lastname" name="lastname" type="text" placeholder="Doe" value={formData.lastname} onChange={handleChange} required />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="birthDate">Date of Birth</Label>
                <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
              </FormGroup>

              <FullWidth>
                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                </FormGroup>
              </FullWidth>

              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 8900" value={formData.phone} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
              </FormGroup>
            </FormGrid>

            <Button type="submit" $fullWidth style={{ marginTop: '1rem' }}>
              Create Account
            </Button>
          </form>
          <FooterText>
            Already have an account? <Link to="/login">Log in here</Link>
          </FooterText>
        </FormCard>
      </FormWrapper>
    </Container>
  );
};
