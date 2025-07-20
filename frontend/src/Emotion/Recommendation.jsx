function Recommendation({ recs }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Your Yoga Poses</h2>

      {recs.map(({ emotion, poses }) => (
        <div key={emotion} style={{ marginBottom: "1rem" }}>
          <h4>{emotion.toUpperCase()}</h4>
          <ul>
            {poses.map(p => (
  <li key={p.name}>
    <h5>{p.name}</h5>
    {p.image && <img src={p.image} alt={p.name} width="150" />}
    <p>{p.description}</p>
  </li>
))}

          </ul>
        </div>
      ))}
    </div>
  );
}

export default Recommendation;