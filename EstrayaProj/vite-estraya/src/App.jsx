import { useState } from 'react';
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import RootLayout from './Components/RootLayout';
import LoginForm from './Components/LoginForm';
import About from './Components/About';
import SkillTree from './Components/SkillTree';
import { Provider } from 'react-redux';
import store from './Store';
import PrivateRoute from './Utils/privateRoute';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route index element={<About />} />
        <Route path="/dashboard/:user_id" element={<Dashboard />} />
        <Route exact path="/skill/:skill_id" element={<PrivateRoute/>}>
          <Route exact path="/skill/:skill_id" element={<SkillTree/>}/>
        </Route>
      </Route>
    )
  )

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
