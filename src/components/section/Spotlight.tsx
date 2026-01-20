import Header from "../general/Header";

export default function Spotlight() {
  return (
    <div className="video-container">
      <video
        autoPlay
        loop
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src="spotlight.mp4" type="video/mp4" />
      </video>
      <div className="background-spotlight">
        <Header />
      </div>
    </div>
  );
}
