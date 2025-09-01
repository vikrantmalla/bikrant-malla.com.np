import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Button,
  Hr,
} from '@react-email/components';
import { Role } from '@/types/enum';

interface InvitationEmailProps {
  inviterName: string;
  portfolioName: string;
  role: string;
  signupUrl: string;
}

export const InvitationEmail = ({
  inviterName,
  portfolioName,
  role,
  signupUrl,
}: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been invited to collaborate on {portfolioName}</Preview>
      <Body style={{ backgroundColor: '#f6f6f6', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 32 }}>
          <Section>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 16 }}>
              You&apos;re Invited! 🎉
            </Text>
            <Text style={{ color: '#444', marginBottom: 16 }}>
              Hi there,
            </Text>
            <Text style={{ color: '#444', marginBottom: 24 }}>
              <strong>{inviterName}</strong> has invited you to collaborate on their portfolio <strong>{portfolioName}</strong> as a <strong>{role}</strong>.
            </Text>
            <Section style={{ background: '#e8f0fe', borderRadius: 6, padding: 16, marginBottom: 24 }}>
              <Text style={{ color: '#1967d2', fontWeight: 500, marginBottom: 8 }}>
                What you can do as a {role}:
              </Text>
              <Text style={{ color: '#174ea6', fontSize: 14, whiteSpace: 'pre-line' }}>
                {role === Role.EDITOR
                  ? '• Edit and manage portfolio content\n• Add and modify projects\n• Update portfolio information'
                  : '• View portfolio content\n• Access shared resources\n• Provide feedback and suggestions'}
              </Text>
            </Section>
            <Button
              href={signupUrl}
              style={{
                backgroundColor: '#1967d2',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: 24,
              }}
            >
              Accept Invitation &amp; Sign Up
            </Button>
            <Text style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
              Click the button above to create your account and start collaborating. If you already have an account, you&apos;ll be able to link it during the signup process.
            </Text>
            <Hr style={{ borderColor: '#eee', margin: '32px 0' }} />
            <Text style={{ color: '#aaa', fontSize: 12 }}>
              This invitation was sent from {portfolioName}. If you didn&apos;t expect this invitation, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InvitationEmail; 