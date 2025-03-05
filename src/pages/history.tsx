import { History } from '@/components/pages/History/History';
import { withUserContext } from '@/contexts/UserContext';

function HistoryPage() {
  return <History />;
}

export default withUserContext(HistoryPage); 