import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import AnimeDetail from "./pages/AnimeDetail";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/diary" component={Diary} />
      <Route path="/anime/:id" component={AnimeDetail} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
