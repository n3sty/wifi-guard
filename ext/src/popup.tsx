import { createRoot } from 'react-dom/client';
import SecurityChecker from './components/SecurityChecker';
import './styles.css';

function App() {
  return <SecurityChecker />;
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}