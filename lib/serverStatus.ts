import axiosInstance from "./axios";
import { toast } from "@/components/ui/use-toast";

/**
 * Checks if the backend server is online by pinging the health endpoint
 * @param {boolean} showToast - Whether to show a toast notification on failure
 * @returns Promise<boolean> - True if server is online, false otherwise
 */
export async function checkServerStatus(
  showToast: boolean = false
): Promise<boolean> {
  try {
    // Create a new instance without interceptors to avoid auth redirects during health check
    const response = await axiosInstance.get("/health", {
      timeout: 5000, // 5 second timeout for health check
      validateStatus: (status) => status === 200, // Only accept 200 status
    });

    // Check if response has the expected format
    return response.status === 200 && response.data?.status === "ok";
  } catch (error) {
    console.error("Server health check failed:", error);

    // Show toast notification if requested
    if (showToast) {
      toast({
        variant: "destructive",
        title: "Server Offline",
        description:
          "Unable to connect to the server. The service might be down or under maintenance.",
      });
    }

    return false;
  }
}
