import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { fullName, email } = await request.json();

        if (!email || !fullName) {
            return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Montgomery Blair Go Tournament <onboarding@resend.dev>',
            to: [email],
            subject: 'Tournament Registration Confirmed!',
            html: `
              <div style="font-family: system-ui, -apple-system, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #111827;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #0f172a;">Registration Confirmed!</h1>
                  
                  <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                    Hi <strong>${fullName}</strong>,
                  </p>
                  
                  <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                    Thank you for registering for the <strong>Montgomery Blair Go Tournament</strong>. This email confirms that we have received your registration.
                  </p>
                  
                  <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">Tournament Details</h2>
                    <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> Saturday, March 21st, 2026</p>
                    <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> Montgomery Blair High School</p>
                  </div>
                  
                  <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                    We will send more information regarding the schedule and check-in procedures closer to the tournament date.
                  </p>
                  
                  <p style="font-size: 16px; line-height: 24px; margin-bottom: 32px;">
                    If you have any questions, please don't hesitate to reach out.
                  </p>
                  
                  <p style="font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 24px;">
                    Best regards,<br />
                    The Montgomery Blair Go Tournament Team
                  </p>
                </div>
              </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
