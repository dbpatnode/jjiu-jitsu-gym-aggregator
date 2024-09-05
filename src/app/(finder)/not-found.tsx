// import { headers } from "next/headers";
// import Heading from '@/components/Heading';
// import Text from '@/components/Text';
// import getTranslation from '@/i18n/getTranslation';

const NotFound = async () => {
  //   const headersList = headers();

  return (
    <div className="viewport-content mt-40">
      <div className="container">
        <h1>Sorry</h1>
        <div className="flex-wrap">
          <p>Page not found.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
