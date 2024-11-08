import { BrowserRouter, Route, Routes } from "react-router-dom";
import Alert from "src/components/Alert";
import Footer from "src/components/Footer";
import Nav from "src/components/Nav";
import Rank from "src/pages/Rank";
import About from "src/pages/About";
import ApiTest from "src/pages/ApiTest";
import Home from "src/pages/Home";
import NotFound from "src/pages/NotFound";
import Login from "./pages/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rank/" element={<Rank />} />
        <Route path="/about/" element={<About />} />
        
        <Route path="/api-test/" element={<ApiTest />} />
        {/* Make sure this is the last route */}
        <Route path="*" element={<NotFound />} />


        {/* Michael Cran Work In Progress: */}
        <Route path="/login/" element={<Login />} />
        {/* ------------------------------ */}

      </Routes>
      <Alert />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
