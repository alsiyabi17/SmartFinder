import { Container, Row, Col } from "reactstrap";


const developers = [
  {
    name: "Mohammed Alsiyabi",
    id: "16s2029",
    role: "Full-Stack Developer",
    contribution:
      "Project lead. Backend (Express, MongoDB, Mongoose models, REST API). Authentication, Docker containerization, deployment.",
  },
  {
    name: "Jokha Alshabibi",
    id: "16s17154",
    role: "Full-Stack Developer",
    contribution:
      "Project lead. Backend (Express, MongoDB, Mongoose models, REST API). Authentication, Docker containerization, deployment.",
  },
];

const references = [
  { title: "React Official Documentation", url: "https://react.dev" },
  { title: "Redux Toolkit Documentation", url: "https://redux-toolkit.js.org" },
  { title: "Vite Guide", url: "https://vitejs.dev/guide" },
  { title: "Express.js Documentation", url: "https://expressjs.com" },
  { title: "Mongoose Documentation", url: "https://mongoosejs.com/docs" },
  { title: "MongoDB Manual", url: "https://www.mongodb.com/docs/manual" },
  { title: "Reactstrap Components", url: "https://reactstrap.github.io" },
  { title: "Bootstrap 5", url: "https://getbootstrap.com/docs/5.3" },
  { title: "Docker Documentation", url: "https://docs.docker.com" },
  { title: "Vitest Testing Framework", url: "https://vitest.dev" },
  { title: "Google Maps Embed API", url: "https://developers.google.com/maps/documentation/embed" },
  {
    title: "Book — Fullstack React (Anthony Accomazzo et al.)",
    url: "https://www.fullstackreact.com",
  },
  {
    title: "Book — MongoDB: The Definitive Guide (Shannon Bradshaw, O'Reilly)",
    url: "https://www.oreilly.com/library/view/mongodb-the-definitive/9781491954454/",
  },
];

function About() {
  return (
    <div className="auth-page" style={{ paddingTop: "9rem", paddingBottom: "4rem" }}>
      <Container>
        {/* Header */}
        <div className="fade-in-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>
            About <span style={{ color: "var(--primary)" }}>SmartFinder</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            SmartFinder is a application that helps users discover and book
            restaurants in Oman.
          </p>
        </div>

        {/* Developers grid */}
        <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>
          Development Team
        </h2>
        <Row className="fade-in-up fade-in-up-delay-1 justify-content-center">
          {developers.map((dev, i) => (
            <Col md={4} key={i} className="mb-4">
              <div
                className="auth-card"
                style={{
                  height: "100%",
                  textAlign: "center",
                  padding: "2rem 1.5rem",
                }}
              >
                {/* Avatar circle with initials */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    color: "white",
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  {dev.name.startsWith("TODO")
                    ? "?"
                    : dev.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                </div>
                <h4 style={{ marginBottom: "0.3rem" }}>{dev.name}</h4>
                <div
                  style={{
                    color: "var(--primary)",
                    fontWeight: 600,
                    marginBottom: "0.3rem",
                  }}
                >
                  {dev.role}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  {dev.id}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0 }}>
                  {dev.contribution}
                </p>
              </div>
            </Col>
          ))}
        </Row>

        {/* References */}
        <h2
          style={{
            fontWeight: 700,
            marginTop: "3rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          References
        </h2>
        <div
          className="auth-card fade-in-up fade-in-up-delay-2"
          style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}
        >
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Websites and books used while developing SmartFinder:
          </p>
          <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
            {references.map((ref, i) => (
              <li
                key={i}
                style={{
                  marginBottom: "0.6rem",
                  color: "var(--text-secondary)",
                }}
              >
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--primary)", textDecoration: "none" }}
                >
                  {ref.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}

export default About;
