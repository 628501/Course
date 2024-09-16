import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthProps {
  children: ReactNode;
}

export default function AuthRoute({ children }: AuthProps) {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentDetail = localStorage.getItem("student");
    if (studentDetail) {
      try {
        const student = JSON.parse(studentDetail);
        setEmail(student?.email);
      } catch (e) {
        console.error("Error parsing student detail:", e);
      }
    }
  }, []);

  useEffect(() => {
    const studentDetail = localStorage.getItem("student");
    if (!studentDetail) {
      navigate('/login');
    }
  }, [email, navigate]);

  if (email) {
    return <>{children}</>;
  }
  return null;
}