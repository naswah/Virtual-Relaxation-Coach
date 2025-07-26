import './Recommendation.css';

function Recommendation({ recs }) {
  return (
    <div className="recommendation-container">
      <h2>Your Yoga Poses</h2>

      {recs.map(({ emotion, poses }) => (
        <div className="recommendation-section" key={emotion}>
          <h4>{emotion.toUpperCase()}</h4>
          <ul>
            {poses.map(p => (
              <li key={p.name}>
                <div className="pose-info">
                  <h5>{p.name}</h5>
                  <p>{p.description}</p>
                </div>
                {p.image && (
                  <img className="pose-image" src={p.image} alt={p.name} />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Recommendation;