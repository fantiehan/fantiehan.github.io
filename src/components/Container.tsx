import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

export default function Container({ className, ...props }: Props) {
  return <div className={cn("mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8", className)} {...props} />;
}
