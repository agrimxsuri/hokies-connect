import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DataManagerTest = () => {
  const [importStatus, setImportStatus] = useState("Testing...");

  useEffect(() => {
    try {
      console.log('🔍 DEBUG - Testing dataManager import...');
      
      // Try to import the data manager
      import("@/lib/dataManager").then((dataManager) => {
        console.log('🔍 DEBUG - DataManager imported successfully:', dataManager);
        setImportStatus("✅ DataManager imported successfully");
        
        // Test if alumniDataManager exists
        if (dataManager.alumniDataManager) {
          console.log('🔍 DEBUG - alumniDataManager found:', dataManager.alumniDataManager);
          setImportStatus(prev => prev + " - alumniDataManager found");
        } else {
          console.log('🔍 DEBUG - alumniDataManager not found');
          setImportStatus(prev => prev + " - ❌ alumniDataManager not found");
        }
      }).catch((error) => {
        console.error('🔍 DEBUG - Error importing dataManager:', error);
        setImportStatus("❌ Error importing dataManager: " + error.message);
      });
    } catch (error) {
      console.error('🔍 DEBUG - Error in useEffect:', error);
      setImportStatus("❌ Error in useEffect: " + error.message);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>DataManager Import Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg font-semibold">Status: {importStatus}</p>
            <p className="text-sm text-gray-600">
              Check the browser console for detailed debug information.
            </p>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">What to look for in console:</h3>
              <ul className="text-sm space-y-1">
                <li>• "Testing dataManager import..."</li>
                <li>• "DataManager imported successfully"</li>
                <li>• "alumniDataManager found" or "alumniDataManager not found"</li>
                <li>• Any error messages</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagerTest;
