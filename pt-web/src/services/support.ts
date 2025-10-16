import {apiClient} from "src/services/apiClient";

type SendEmailResponse = { accepted: boolean };

type ConsultationEmailInput = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  preferredAt: string;
  message: string;
};

export async function sendConsultationEmail(
  input: ConsultationEmailInput,
): Promise<string> {
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
    subject,
    text,
  });

  return String(Date.now());
}

export async function getDoctorAvailability(init?: { signal?: AbortSignal }): Promise<number> {
  const response = await apiClient.get<{ doctors: number }>("/sos/availability", init);
  if (typeof response?.doctors !== "number") {
    throw new Error("Invalid response format");
  }

  return response.doctors;
}
