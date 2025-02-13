import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/slices/authSlice";
import {
  useGetBookByIdQuery,
  useUpdateBookMutation,
  useRemoveReservationMutation,
} from "../redux/slices/bookSlice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useGetMeQuery } from "../redux/slices/authSlice";

const SingleMusician = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);

  const { data: musician, isLoading, error } = useGetMusicianByIdQuery(id);
  const [updateMusician, { isLoading: isUpdating }] =
    useUpdateMusicianMutation();
  const [returnMusician] = useRemoveReservationMutation();
  const { data: userData } = useGetMeQuery();

  const handleMusicianAction = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (!musician.available) {
        const foundReservation = userData.musicians.find(
          (m) => m.id === parseInt(id)
        );
        if (foundReservation) {
          await returnMusician(foundReservation.id).unwrap();
        }
      } else {
        await updateMusician({
          musicianId: id,
          available: !musician.available,
        }).unwrap();
      }
    } catch (err) {
      console.error("Failed to update musician:", err);
    }
  };

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
            {error.data?.message || "Failed to load musician details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{musician.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img // Delete this if we don't have a cover image
                src={book.coverimage}
                alt={book.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Author</h3>
                <p>{musician.author}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <p>{musician.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Status</h3>
                <p>{musician.available ? "Available" : "Checked Out"}</p>
              </div>

              {token && musician.available && (
                <Button
                  onClick={handleMusicianAction}
                  disabled={isUpdating}
                  variant="default"
                >
                  {isUpdating ? "Processing..." : "Check Out Musician"}
                </Button>
              )}

              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="ml-2"
              >
                Back to Musicians
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleMusician;
