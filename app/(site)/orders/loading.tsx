import Container from "@/components/ui/container";
import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Container>
      <div className="space-y-5 w-full h-full p-10">
          <Skeleton className="aspect-video rounded-2xl" />
          <Skeleton className="aspect-video rounded-2xl" />
          <Skeleton className="aspect-video rounded-2xl" />
          <Skeleton className="aspect-video rounded-2xl" />
          <Skeleton className="aspect-video rounded-2xl" />
          <Skeleton className="aspect-video rounded-2xl" />
      </div>
    </Container>
  );
}
 
export default Loading;
