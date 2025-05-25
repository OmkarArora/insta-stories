import StoryList from "@/components/stories/StoryList";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<header className="bg-white py-4 px-4 border-b border-gray-200">
				<h1 className="text-xl font-bold">Instagram Stories</h1>
			</header>

			<StoryList />

			<div className="flex-1 flex items-center justify-center p-4">
				<p className="text-gray-500 text-center">
					Tap on a story above to view it
				</p>
			</div>

			{/* Story viewer rendered at the root level */}
			{/* <StoryViewer /> */}
		</div>
	);
}
