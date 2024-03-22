import { Route, Routes } from 'react-router-dom';

// App components
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import Header from './components/Header';
import UserSignOut from './components/UserSignOut';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';

function App() {
  
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Courses />} />
          <Route path='/courses/:id' element={<CourseDetail />} />
          <Route path='signin' element={<UserSignIn />} />
          <Route path='signup' element={<UserSignUp />} />
          <Route path='signout' element={<UserSignOut />} />
          <Route element={<PrivateRoute />}>
            <Route path='/courses/create' element={<CreateCourse />} />
            <Route path='/courses/:id/update' element={<UpdateCourse />} />
          </Route>
          <Route path='notfound' element={<NotFound />} />
          <Route path='forbidden' element={<Forbidden />} />
          <Route path='error' element={<UnhandledError />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;