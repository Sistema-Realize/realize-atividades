import Link from "next/link";
import { FaUserCircle, FaSignOutAlt, FaDownload } from "react-icons/fa";
import { useHistory } from "./useHistory";
import Image from "next/image";

// Definindo um tipo para as atividades

export function History() {
  const { activities, isLoading, error, handleDownload } = useHistory();

  if (isLoading) return <div className="history-container">Loading...</div>;
  if (error) return <div className="history-container">Error: {error}</div>;

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="logo-container">
          <Image
            src="/realizeAtividadelogo.svg"
            alt="Realize Logo"
            width={100}
            height={100}
            priority
          />
        </div>

        <h1 className="history-title">
          Gerenciar
          <br />
          atividades
        </h1>
      </div>

      <div className="activities-list">
        {activities.length === 0 ? (
          <p>Nenhuma atividade encontrada.</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <h2 className="activity-title">Atividade #{activity.id}</h2>

              <div className="activity-info">
                <div className="info-row">
                  <span className="info-label">QUANTIDADE</span>
                  <span className="info-value">
                    {activity.amount}{" "}
                    {activity.amount === 1 ? "atividade" : "atividades"}
                  </span>
                </div>

                <div className="divider"></div>

                <div className="info-row">
                  <span className="info-label">DATA</span>
                  <span className="info-value">
                    {new Date(activity.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className="divider"></div>

                <div className="info-row">
                  <span className="info-label">STATUS</span>
                  <span className={`info-value status-${activity.status}`}>
                    {activity.status === "finished"
                      ? "Concluído"
                      : "Em processamento..."}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(activity.activities)}
                className={`download-button ${
                  activity.status !== "finished" ? "disabled" : ""
                }`}
                disabled={activity.status !== "finished"}
              >
                <FaDownload className="download-icon" /> Download
              </button>
            </div>
          ))
        )}
      </div>

      <div className="footer-divider"></div>

      <div className="footer-links">
        <Link href="/userProfile	" className="footer-link">
          <FaUserCircle className="footer-icon" /> Minha conta
        </Link>
        <Link href="/api/auth/logout" className="footer-link">
          <FaSignOutAlt className="footer-icon" /> Logout
        </Link>
      </div>
    </div>
  );
}
