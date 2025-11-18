import { Link } from "react-router";

export default function HomeMain() {
  const places = [
    {
      id: 1,
      title: "Paris, France",
      img: "https://images2.alphacoders.com/561/thumb-1920-561115.jpg",
      desc: "The romantic city of lights with stunning architecture and rich culture."
    },
    {
      id: 2,
      title: "New York, USA",
      img: "https://lh3.googleusercontent.com/places/AAcXr8oELGjp26s1mDaTs07ebLQ05ZdAOICFWmQbHv3Hy43Gy7VfuzRCgQUw_kCNbfVsFexY0QfO4wuj6kOGrSy3UJXakGAadOvQJCM=s1600-w612",
      desc: "The iconic skyline and fast-paced lifestyle of the Big Apple."
    },
    {
      id: 3,
      title: "Tokyo, Japan",
      img: "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blt0db69fde9a0f6d98/675e125faf051ba02b13ded4/japan-725347-Header_Desktop.jpg",
      desc: "A perfect blend of modern neon streets and traditional temples."
    }
  ];

  return (
    <main className="home-main">
      <section className="places-section">
        <div className="places-background"></div>

        <h2 className="places-title">Explore Places</h2>

        <div className="places-grid">
          {places.map(place => (
            <div className="place-card" key={place.id}>
              <img className="place-image" src={place.img} alt={place.title} />

              <h3 className="place-name">{place.title}</h3>

              <p className="place-desc">{place.desc}</p>

              <Link to={`/details/${place.id}`} className="place-details-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
