import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

export default function Container({ className, ...props }: Props) {
  return <div className={cn("mx-auto w-full max-w-[1080px] px-5 sm:px-7 lg:px-8", className)} {...props} />;
}
