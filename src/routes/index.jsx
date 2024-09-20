import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import KanjiDetail from '../KanjiDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/kanji/:id',
    element: <KanjiDetail />,
  },
]);

export default router;
