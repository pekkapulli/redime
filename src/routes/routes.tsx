import Article from "../routes/Article";
import Calculator from "../routes/Calculator";
import Root from "../routes/Root";

export const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Article />,
      },
      {
        path: "/calculator",
        element: <Calculator />,
      },
    ],
  },
];
