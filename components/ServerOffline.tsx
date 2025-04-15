import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ServerOfflineProps {
  onRetry: () => void;
}

export default function ServerOffline({ onRetry }: ServerOfflineProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
        <div className="bg-destructive/10 p-3 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Server Offline</h1>
        <p className="mt-4 text-muted-foreground">
          We're unable to connect to the server. The service might be down or
          under maintenance.
        </p>
        <Button onClick={onRetry} className="mt-6">
          Retry Connection
        </Button>
      </div>
    </div>
  );
}
