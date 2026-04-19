import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function DiagnosticResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/diagnostics/results/${id}`).then(res => setResult(res.data));
  }, [id]);

  if (!result) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Votre résultat</h1>
      <h2>Score : {result.totalScore} points</h2>
      <p style={{ fontSize: 20 }}>{result.interpretation}</p>
      <Link to="/diagnostic">Refaire le diagnostic</Link>
    </div>
  );
}