import Container from "react-bootstrap/Container";
import Resources from "../Components/Resources/Resources";
import Rights from "../Components/Rights/Rights";
import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary";
import "./App.scss";
import Share from "../Components/Share/Share";

function App() {
  return (
    <Container>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <main id="content">
        <ErrorBoundary>
          <Rights />
        </ErrorBoundary>
        <ErrorBoundary>
          <Resources />
        </ErrorBoundary>
        <ErrorBoundary>
          <Share />
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </Container>
  );
}
export default App;
