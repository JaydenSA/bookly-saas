// Simple email service using a basic SMTP approach
// In production, you'd want to use a service like SendGrid, Resend, or AWS SES

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // For now, we'll just log the email content
    // In production, replace this with actual email sending logic
    console.log('📧 Email would be sent:');
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Content:', emailData.html);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateStaffInviteEmail(
  businessName: string,
  inviterName: string,
  inviteUrl: string,
  permissions: string[]
): EmailData {
  const permissionList = permissions.length > 0 
    ? permissions.map(p => `• ${p}`).join('\n')
    : '• Basic staff access';

  return {
    to: '', // Will be set when calling
    subject: `You've been invited to join ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You've been invited to join ${businessName}</h2>
        
        <p>Hello!</p>
        
        <p><strong>${inviterName}</strong> has invited you to join <strong>${businessName}</strong> as a staff member.</p>
        
        <h3>Your permissions will include:</h3>
        <ul style="color: #666;">
          ${permissions.map(p => `<li>${p}</li>`).join('')}
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This invitation will expire in 7 days. If you don't have an account yet, you'll be able to create one when you accept the invitation.
        </p>
        
        <p style="color: #666; font-size: 14px;">
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `,
    text: `
You've been invited to join ${businessName}

${inviterName} has invited you to join ${businessName} as a staff member.

Your permissions will include:
${permissionList}

Accept your invitation here: ${inviteUrl}

This invitation will expire in 7 days. If you don't have an account yet, you'll be able to create one when you accept the invitation.

If you didn't expect this invitation, you can safely ignore this email.
    `
  };
}
