import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Button } from '../components/Button';
import { Input, Label, FormGroup } from '../components/Input';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 10%;
  left: 20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
`;

const BackgroundGlow2 = styled.div`
  position: absolute;
  bottom: 20%;
  right: 15%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
`;

const FormCard = styled.div`
  background: rgba(30, 30, 50, 0.8);
  backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 24px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease-out;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  color: white;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  text-align: center;
  font-size: 0.95rem;
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;

  a {
    color: #6366f1;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: #6366f1;
  }
`;

interface FormData {
  username: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <Container>
      <BackgroundGlow />
      <BackgroundGlow2 />
      <FormCard>
        <BackLink to="/">← Back to Home</BackLink>
        <Title>Welcome Back</Title>
        <Subtitle>Enter your credentials to continue learning</Subtitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit" $fullWidth>
            Login
          </Button>
        </form>
        <FooterText>
          Don't have an account? <Link to="/register">Create Account</Link>
        </FooterText>
      </FormCard>
    </Container>
  );
};
