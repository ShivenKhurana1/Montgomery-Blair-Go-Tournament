import * as React from 'react';

interface ConfirmationEmailProps {
    fullName: string;
    tournamentName: string;
    date: string;
    location: string;
    tShirtSize?: string;
}

export const ConfirmationEmail: React.FC<Readonly<ConfirmationEmailProps>> = ({
    fullName,
    tournamentName,
    date,
    location,
    tShirtSize,
}) => (
    <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f9fafb',
        padding: '40px 20px',
        color: '#111827'
    }}>
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#0f172a'
            }}>Registration Confirmed!</h1>

            <p style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '24px' }}>
                Hi <strong>{fullName}</strong>,
            </p>

            <p style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '24px' }}>
                Thank you for registering for the <strong>{tournamentName}</strong>. This email confirms that we have received your registration.
            </p>

            <div style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px'
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Tournament Details</h2>
                <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Date:</strong> {date}</p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Location:</strong> {location}</p>
                {tShirtSize && <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>T-Shirt Size:</strong> {tShirtSize}</p>}
            </div>

            <p style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '24px' }}>
                We will send more information regarding the schedule and check-in procedures closer to the tournament date.
            </p>

            <p style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '32px' }}>
                If you have any questions, please don't hesitate to reach out.
            </p>

            <p style={{ fontSize: '14px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                Best regards,<br />
                The {tournamentName} Team
            </p>
        </div>
    </div>
);
