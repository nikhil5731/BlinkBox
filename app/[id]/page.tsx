import Messages from "@/components/Messages";

const Page = ({ params }: { params: any }) => {
  return (
    <div>
      <Messages id={params.id} />
    </div>
  );
};

export default Page;
