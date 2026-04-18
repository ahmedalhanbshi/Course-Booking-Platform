import { isAxiosError } from "axios";

type ErrorBody = {
  message?: string;
};

export function getRequestErrorMessage(
  error: unknown,
  fallback = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
): string {
  if (isAxiosError<ErrorBody>(error)) {
    if (error.code === "ECONNABORTED") {
      return "انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى.";
    }

    if (!error.response) {
      return "تعذر الاتصال بالخادم. تأكد من تشغيل الخادم الخلفي ثم أعد المحاولة.";
    }

    return error.response.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    if (error.message === "Network Error") {
      return "تعذر الاتصال بالخادم. تأكد من تشغيل الخادم الخلفي ثم أعد المحاولة.";
    }

    return error.message || fallback;
  }

  return fallback;
}
