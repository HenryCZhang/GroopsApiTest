import { useRouter } from "next/router";
import { useState } from "react";
import ProgressBar from "public/components/group/progressBar";

const CreateGroupPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <ProgressBar current={3} />
    </div>
  );
};

export default CreateGroupPage;
