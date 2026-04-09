"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@oss/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@oss/ui/components/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserMenu() {
	const router = useRouter();

	const userName = "John Doe";
	const userEmail = "john.doe@example.com";
	const userImage = "https://avatars.githubusercontent.com/u/218819614";
	const userInitials = userName
		.split(" ")
		.map((name) => name[0])
		.join("")
		.toUpperCase();

	const handleSignOut = () => {
		router.push("/");
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label="User menu"
				className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			>
				<Avatar className="ring-2 ring-border/50 ring-offset-2 ring-offset-background transition-all duration-200 hover:ring-primary/50">
					<AvatarImage alt={userName} src={userImage} />
					<AvatarFallback className="bg-primary/10 font-semibold text-primary">
						{userInitials}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="font-semibold text-sm leading-none">{userName}</p>
							<p className="text-muted-foreground text-xs leading-none">
								{userEmail}
							</p>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer">
					<Link href="/">
						<Settings className="mr-3 h-4 w-4" />
						Settings
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
					<LogOut className="mr-3 h-4 w-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
