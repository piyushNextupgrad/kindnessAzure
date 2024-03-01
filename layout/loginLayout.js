import Head from 'next/head';
import withoutAuth from '../store/middleware/withoutAuth';

const AdminLogin = ({ children, title = "Kindness Admin Panel Login" }) => {
  return (    
    <div className="super-admin-login">
      <Head>
        <meta content="text/html;charset=utf-8" httpEquiv="Content-Type" />
        <meta content="utf-8" httpEquiv="encoding" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/images/favicon.png" title="Favicon" />
      </Head>
      <main className="auth_body">
          {children}
      </main>
    </div>
  );
};

export default withoutAuth(AdminLogin);