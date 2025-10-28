import { useEffect, useState } from "react";

export function useEmailConfig() {
  const [emailOn, setEmailOn] = useState(false);

  async function getEmailConfig() {
    try {
      const emailRes = await fetch("/api/email-config");
      const { EMAIL_ENABLED } = await emailRes.json();
      setEmailOn(EMAIL_ENABLED);
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getEmailConfig();
  }, []);

  return emailOn
}