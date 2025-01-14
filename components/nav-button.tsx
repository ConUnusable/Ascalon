import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props ={
    href: string;
    label: string;
    isActive?: boolean;
}

export const NavButton = ({
    href,
    label,
    isActive,
}: Props) => {
    return (
        <Button
            asChild
            size="lg"
            variant="outline"       
            className={cn(
                "w-full lg:w-auto justify-between text-1xl font-montserrat hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transtion",
                isActive ? "underline bg-transparent" : "bg-transparent",
            )}
        >
            <Link href={href}>
                {label}
            </Link>
        </Button>
    );
};