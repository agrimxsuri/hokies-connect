import Header from "@/components/Header";
import StudentConnect from "@/components/StudentConnect";

const Connect = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <StudentConnect />
      </main>
    </div>
  );
};

export default Connect;