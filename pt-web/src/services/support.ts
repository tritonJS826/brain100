import {apiClient} from "src/services/apiClient";

type SendEmailResponse = { accepted: boolean };

const inboxEnvKey = import.meta.env.VITE_SUPPORT_INBOX as string | undefined;
const fallbackInbox = "support@example.com";
const supportInbox = inboxEnvKey && inboxEnvKey.trim() !== "" ? inboxEnvKey : fallbackInbox;

type ConsultationEmailInput = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  preferredAt: string;
  message: string;
};

type EmergencyEmailInput = {
  name: string;
  phone: string;
  urgent: boolean;
};

export async function sendConsultationEmail(input: ConsultationEmailInput): Promise<string> {
  const subject = `Заявка на консультацию: ${input.topic}`;
  const lines = [
    `Имя: ${input.name}`,
    `Email: ${input.email}`,
    `Телефон: ${input.phone || "не указан"}`,
    `Предпочтительное время: ${input.preferredAt || "не указано"}`,
    `Сообщение: ${input.message || "—"}`,
  ];
  const text = lines.join("\n");

  await apiClient.post<SendEmailResponse>("/email/send", {
    to: supportInbox,
    subject,
    text,
  });

  return String(Date.now());
}

export async function sendEmergencyEmail(input: EmergencyEmailInput): Promise<string> {
  const subject = input.urgent ? "Экстренный звонок" : "Запрос звонка";
  const lines = [
    `Имя: ${input.name}`,
    `Телефон: ${input.phone}`,
    `Экстренно: ${input.urgent ? "да" : "нет"}`,
  ];
  const text = lines.join("\n");

  await apiClient.post<SendEmailResponse>("/email/send", {
    to: supportInbox,
    subject,
    text,
  });

  return String(Date.now());
}
