import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBooksQuery } from "../../redux/slices/bookSlice";
import { LoadingPage } from "../ui/loading";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

const BookList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all"); // 'all', 'available', 'checked'
  const navigate = useNavigate();
  const { data: books, isLoading, error } = useGetBooksQuery();

  const filteredBooks = useMemo(() => {
    if (!books) return [];

    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAvailability =
        filterAvailable === "all" ||
        (filterAvailable === "available" && book.available) ||
        (filterAvailable === "checked" && !book.available);

      return matchesSearch && matchesAvailability;
    });
  }, [books, searchTerm, filterAvailable]);

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
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              <CardHeader>
                <div className="aspect-w-2 aspect-h-3 mb-4">
                  <img
                    src={book.coverimage}
                    alt={book.title}
                    className="object-cover rounded-lg"
                  />
                </div>
                <CardTitle className="line-clamp-2">{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  by {book.author}
                </p>
                <p className="text-sm line-clamp-3">{book.description}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      book.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.available ? "Available" : "Checked Out"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No books found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;