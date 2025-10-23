import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { jsonStorage } from '@/lib/jsonStorage';
import { Download, Upload, Database } from 'lucide-react';
import { toast } from 'sonner';

export function DataManagement() {
  const handleExport = () => {
    jsonStorage.exportToJSON();
    toast.success('Database exported successfully!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = jsonStorage.importFromJSON(content);
      
      if (result.success) {
        toast.success('Database imported successfully!');
        window.location.reload();
      } else {
        toast.error('Failed to import database');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">Data Management</h3>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Export or import your database as JSON
      </p>

      <div className="flex gap-3">
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Database
        </Button>

        <label>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Database
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </Card>
  );
}
