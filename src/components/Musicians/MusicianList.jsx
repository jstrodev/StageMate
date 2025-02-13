main
import { useEffect } from "react";
import { useGetMusiciansQuery } from "../../redux/slices/musicianSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";

// Displays a grid of musician cards with images, names, and genres
// Search bar allows filtering musicians by name or genre
// Clicking on a musician navigates to their detail page
// Each card may include an "Add" or "Unadd" (to be adjusted) button for user interaction


import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMusiciansQuery } from "../../redux/slices/musicianSlice";
import { LoadingPage } from "../ui/loading";
import { Input } from "../ui/input";
 main
import { Button } from "../ui/button";

const MusicianList = () => {
main
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

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { data: musicians, isLoading, error } = useGetMusiciansQuery();

  const filteredMusicians = useMemo(() => {
    if (!musicians) return [];

    return musicians.filter((musician) =>
      musician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      musician.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [musicians, searchTerm]);

  if (isLoading) return <LoadingPage />;
 main

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
 main
          <AlertDescription>
            {error.data?.message || "Failed to load musicians"}
          </AlertDescription>

          <AlertDescription>Failed to load musicians</AlertDescription>
 main
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
 main
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

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by name or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=""
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMusicians.map((musician) => (
            <Card
              key={musician.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/musicians/${musician.id}`)}
            >
              <CardHeader>
                <div className="aspect-w-2 aspect-h-3 mb-4">
                  <img
                    src={musician.image}
                    alt={musician.name}
                    className="object-cover rounded-lg"
                  />
                </div>
                <CardTitle className="line-clamp-2">{musician.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Genre: {musician.genre}
                </p>
                <p className="text-sm line-clamp-3">{musician.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMusicians.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No musicians found matching your criteria.
            </p>
 main
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicianList;
