import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Lead {
  name: string;
  phone: string;
  lead_type: string;
  model?: string;
  preferred_date?: string;
  created_at: string;
}

const RECIPIENT_EMAILS = [
  "a.bliznyukov@terravto.ru",
  "call@terravto.ru",
  "alla.lutkovskaya@lada-luki.ru"
];

async function sendEmailViaSMTP(to: string, subject: string, htmlBody: string) {
  const GMAIL_USER = Deno.env.get("GMAIL_USER");
  const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error("Gmail credentials not configured");
  }

  const smtpHost = "smtp.gmail.com";
  const smtpPort = 587;

  try {
    const conn = await Deno.connect({
      hostname: smtpHost,
      port: smtpPort,
    });

    const reader = conn.readable.getReader();
    const writer = conn.writable.getWriter();

    async function readResponse(): Promise<string> {
      const decoder = new TextDecoder();
      const { value } = await reader.read();
      return decoder.decode(value);
    }

    async function sendCommand(command: string): Promise<string> {
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(command + "\r\n"));
      return await readResponse();
    }

    await readResponse();

    await sendCommand(`EHLO ${smtpHost}`);
    await sendCommand("STARTTLS");

    const tlsConn = await Deno.startTls(conn, { hostname: smtpHost });
    const tlsReader = tlsConn.readable.getReader();
    const tlsWriter = tlsConn.writable.getWriter();

    async function tlsReadResponse(): Promise<string> {
      const decoder = new TextDecoder();
      const { value } = await tlsReader.read();
      return decoder.decode(value);
    }

    async function tlsSendCommand(command: string): Promise<string> {
      const encoder = new TextEncoder();
      await tlsWriter.write(encoder.encode(command + "\r\n"));
      return await tlsReadResponse();
    }

    await tlsSendCommand(`EHLO ${smtpHost}`);
    await tlsSendCommand("AUTH LOGIN");
    await tlsSendCommand(btoa(GMAIL_USER));
    await tlsSendCommand(btoa(GMAIL_APP_PASSWORD));

    await tlsSendCommand(`MAIL FROM:<${GMAIL_USER}>`);
    await tlsSendCommand(`RCPT TO:<${to}>`);
    await tlsSendCommand("DATA");

    const emailMessage = [
      `From: LADA Landing <${GMAIL_USER}>`,
      `To: ${to}`,
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      htmlBody,
      ".",
    ].join("\r\n");

    await tlsSendCommand(emailMessage);
    await tlsSendCommand("QUIT");

    tlsReader.releaseLock();
    tlsWriter.releaseLock();
    tlsConn.close();

    return "Email sent successfully";
  } catch (error) {
    console.error("SMTP Error:", error);
    throw error;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const lead: Lead = await req.json();
    console.log("Received lead:", lead);

    const leadTypeMap: Record<string, string> = {
      general: "Общая заявка",
      testdrive: "Запись на тест-драйв",
      credit: "Заявка на кредит",
    };

    const leadTypeName = leadTypeMap[lead.lead_type] || lead.lead_type;
    const emailSubject = `Новая заявка: ${leadTypeName}`;

    let emailBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #303c48 0%, #3999ff 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #303c48; }
            .value { color: #555; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #3999ff; text-align: center; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Новая заявка с лендинга LADA</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Тип заявки:</span>
                <span class="value">${leadTypeName}</span>
              </div>
              <div class="field">
                <span class="label">Имя:</span>
                <span class="value">${lead.name}</span>
              </div>
              <div class="field">
                <span class="label">Телефон:</span>
                <span class="value">${lead.phone}</span>
              </div>
    `;

    if (lead.model) {
      emailBody += `
              <div class="field">
                <span class="label">Модель:</span>
                <span class="value">${lead.model}</span>
              </div>
      `;
    }

    if (lead.preferred_date) {
      emailBody += `
              <div class="field">
                <span class="label">Предпочитаемая дата:</span>
                <span class="value">${new Date(lead.preferred_date).toLocaleString('ru-RU')}</span>
              </div>
      `;
    }

    emailBody += `
              <div class="field">
                <span class="label">Время создания:</span>
                <span class="value">${new Date(lead.created_at).toLocaleString('ru-RU')}</span>
              </div>
            </div>
            <div class="footer">
              <p>Прагматика Великие Луки</p>
              <p>Псковская область, Великие Луки, ул. Гоголя, 4</p>
              <p>+7 (811) 539-55-65</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log("Sending emails to:", RECIPIENT_EMAILS);

    const emailPromises = RECIPIENT_EMAILS.map(async (email) => {
      try {
        await sendEmailViaSMTP(email, emailSubject, emailBody);
        console.log(`Email sent successfully to ${email}`);
        return { email, success: true };
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        return { email, success: false, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const allSuccess = results.every((r) => r.success);

    console.log("Email sending results:", results);

    return new Response(
      JSON.stringify({
        success: allSuccess,
        message: allSuccess
          ? "Emails sent successfully"
          : "Some emails failed to send",
        results,
      }),
      {
        status: allSuccess ? 200 : 207,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
