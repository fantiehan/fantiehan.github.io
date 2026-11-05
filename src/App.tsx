import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Home from "./pages/Home";
import Publications from "./pages/Publications";
import CV from "./pages/CV";
import Notes from "./pages/Notes";
import Note from "./pages/Note";
import Background from "./components/Background";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function AnimatedRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    // Scroll to the top only once the old page has faded out and before the new one mounts, so the
    // new page measures itself (for example the Home signature) from the top.
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}>
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:slug" element={<Note />} />
          <Route path="/cv" element={<CV />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Background />
      <div className="min-h-dvh text-[var(--ink)]">
        <NavBar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}
