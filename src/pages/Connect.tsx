import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FilterSection from "@/components/FilterSection";

interface FilterData {
  major: string;
  clubs: string;
  fields: string;
  company: string;
}

const Connect = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleMatch = async (filters: FilterData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to results with filter parameters
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });
    
    navigate(`/alumni?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <FilterSection onMatch={handleMatch} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Connect;