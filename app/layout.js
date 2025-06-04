import { Inter} from "next/font/google";
import "../assets/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthWrapper from '../components/AuthWrapper';

const inter = Inter({subsets: ['latin']});

export const metadata = {
  title: "Career4Me Employer",
  description: "Post Jobs, Get Analysis on Postings",
};

export default function RootLayout({ children }) {
  return (
    <AuthWrapper>
    <html lang="en"> 
      <body
        className={ inter.className }
      >
        <main >
        {children}
        </main>
        <ToastContainer />
      </body>
    </html>
    </AuthWrapper>
  );
}
