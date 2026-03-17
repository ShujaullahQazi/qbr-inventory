import MatchCard from './MatchCard';

export default function MatchesView({ matches, onRefresh }: { matches: any[]; onRefresh?: () => void }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔗</div>
        <h3>No Matches Yet</h3>
        <p>When your listings match with another dealer's inventory, they'll appear here. Post a listing to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {matches.map((match) => (
        <MatchCard key={match._id} match={match} onRefresh={onRefresh} />
      ))}
    </div>
  );
}
