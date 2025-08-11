import React from "react";

export default function AboutDev() {
  const imageUrl = "https://i.postimg.cc/KvMrDfjB/IMG-2164.jpg";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>About the Developer</h2>

      <div style={styles.imageWrapper}>
        <img src={imageUrl} alt="Developer" style={styles.image} />
        <div style={styles.glowingRing}></div>
      </div>

      <p style={styles.text}>
        Hello! I am Yuvaraj M, the developer of this Recipe Finder app.
      </p>
      <p style={styles.text}>
        You can contact me at:{" "}
        <a href="mailto:yuvaraj.muthukumaran@Gmail.com" style={styles.link}>
          yuvaraj.muthukumaran@Gmail.com
        </a>
      </p>
      <p style={styles.text}>Thanks for visiting!</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "50px auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  title: {
    marginBottom: 30,
  },
  imageWrapper: {
    position: "relative",
    width: 200,
    height: 200,
    margin: "0 auto 30px",
    borderRadius: "50%",
    filter: "drop-shadow(0 0 15px #1976d2)",
    animation: "bounce 3s ease-in-out infinite",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    position: "relative",
    zIndex: 2,
    boxShadow: "0 0 15px rgba(25, 118, 210, 0.8)",
  },
  glowingRing: {
    position: "absolute",
    top: -15,
    left: -15,
    width: 230,
    height: 230,
    borderRadius: "50%",
    boxShadow:
      "0 0 15px #2196f3, 0 0 30px #64b5f6, 0 0 45px #90caf9, 0 0 60px #bbdefb",
    animation: "pulseColors 6s linear infinite",
    zIndex: 1,
  },
  text: {
    fontSize: 16,
    margin: "10px 0",
  },
  link: {
    color: "#1976d2",
    textDecoration: "none",
  },
};
