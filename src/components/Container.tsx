import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

export default function Container({ className, ...props }: Props) {
  return <div className={cn("mx-auto w-full max-w-[1120px] px-6", className)} {...props} />;
}

