import './globals.css';
import { AuthProvider } from '../utils/auth';
import { BookProvider } from '../utils/book';
import { OrderProvider } from '../utils/order';
import LayoutWrapper from './components/layoutwrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <BookProvider>
            <OrderProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </OrderProvider>
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}