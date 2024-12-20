import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'src/css/style.css';
import 'src/css/media.css';
import Alert from "src/components/Alert";
import Footer from "src/components/Footer";
import Nav from "src/components/Nav";
import Rank from "src/pages/Rank";
import About from "src/pages/About";
import CardPage from "src/pages/CardPage";
import ApiTest from "src/pages/ApiTest";
import Home from "src/pages/Home";
import NotFound from "src/pages/NotFound";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import DailyChallenges from "./pages/DailyChallenges";  // Import DailyChallenges page
import WeeklyChallenges from "./pages/WeeklyChallenges"; // Import WeeklyChallenges page
import Challenges from "./pages/Challenges";

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rank/" element={<Rank />} />
        <Route path="/about/" element={<About />} />
        <Route path="/cardPage/" element={<CardPage />} />
        <Route path="/api-test/" element={<ApiTest />} />

        {/* User Account Page Route */}
        <Route path="/user/:username" element={<UserProfile />} />

        {/* Challenges Routes */}
        <Route path="/daily-challenges" element={<DailyChallenges />} />
        <Route path="/weekly-challenges" element={<WeeklyChallenges />} />

        <Route path="/login/" element={<Login />} />
        <Route path="/challenges/" element={<Challenges />} />
        {/* 404 Page Not Found - Keep this as the last route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Alert />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
