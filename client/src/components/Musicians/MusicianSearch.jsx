import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMusiciansQuery } from "../../redux/slices/musicianSlice";
import { LoadingPage } from "../ui/loading";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

const MusicianList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all"); // 'all', 'available', 'checked'
  const navigate = useNavigate();
  const { data: musicians, isLoading, error } = useGetMusiciansQuery();

  const filteredMusicians = useMemo(() => {
    if (!musicians) return [];

    return musicians.filter((musician) => {
      const matchesSearch =
        musician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        musician.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAvailability =
        filterAvailable === "all" ||
        (filterAvailable === "active" && musician.active) ||
        (filterAvailable === "inactive" && !musician.active);

      return matchesSearch && matchesAvailability;
    });
  }, [musicians, searchTerm, filterAvailable]);

  if (isLoading) return <LoadingPage />;

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load books</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=""
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterAvailable === "all" ? "default" : "outline"}
              onClick={() => setFilterAvailable("all")}
            >
              All
            </Button>
            <Button
              variant={filterAvailable === "available" ? "default" : "outline"}
              onClick={() => setFilterAvailable("available")}
            >
              Available
            </Button>
            <Button
              variant={filterAvailable === "checked" ? "default" : "outline"}
              onClick={() => setFilterAvailable("checked")}
            >
              Checked Out
            </Button>
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
                  by {musician.author}
                </p>
                <p className="text-sm line-clamp-3">{musician.description}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      musician.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {musician.active ? "Available" : "Checked Out"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMusicians.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No musicians found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicianList;
