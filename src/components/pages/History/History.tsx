import Link from 'next/link';
import { useHistory } from './useHistory';

export function History() {
  const { activities, isLoading, error, handleDownload } = useHistory();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Histórico de Atividades</h1>
      {activities.length === 0 ? (
        <p>Nenhuma atividade encontrada.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <div>
                <div>
                  <p>
                    Quantidade: {activity.amount} {activity.amount === 1 ? 'atividade' : 'atividades'}
                  </p>
                  <p>
                    Data: {new Date(activity.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <p>
                    Status: {activity.status === 'finished' ? 'Concluído' : 'Em processamento'}
                  </p>
                </div>
                {activity.status === 'finished' && (
                  <button
                    onClick={() => handleDownload(activity.activities)}
                  >
                    Download
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link href="/">Voltar para a página inicial</Link>
    </div>
  );
} 