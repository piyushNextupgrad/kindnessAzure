import { useRouter } from 'next/router';
import { APPCONST } from '../constant/globalVar';

const withoutAuth = (WrappedComponent) => {
    return (props) => {
        if (typeof window !== 'undefined') {
            const Router = useRouter();

            const accessToken = localStorage.getItem(APPCONST.AccessToken);

            if (accessToken) {
                Router.replace(APPCONST.Dashboard)
                return null;
            }

            // If this is an accessToken we just render the component that was passed with all its props
            return <WrappedComponent {...props} />;
        }

        // If we are on server, return null
        return null;
    };
};

export default withoutAuth;
