import { useEffect } from "react";
import { useGetMusiciansQuery } from "../../redux/slices/musicianSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { Button } from "../ui/button";

const MusicianList = () => {
  const {
    data: musicians,
    isLoading,
    error,
    refetch,
  } = useGetMusiciansQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.data?.message || "Failed to load musicians"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Musicians</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {musicians?.map((musician) => (
              <Card key={musician.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {musician.actName}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Genre:</span>{" "}
                      {musician.genre}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {musician.homebase}
                    </p>
                    <p>
                      <span className="font-medium">Average Ticket:</span> $
                      {musician.averageTicketPrice.toString()}
                    </p>
                    <p>
                      <span className="font-medium">Venue Capacity:</span>{" "}
                      {musician.averageVenueCapacity.toLocaleString()}
                    </p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          // Handle booking or details view
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicianList;
