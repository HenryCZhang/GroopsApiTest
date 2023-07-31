import { ColorRing } from "react-loader-spinner";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ColorRing
        visible={true}
        height="100"
        width="100"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3']}
      />
    </div>
  );
};
