"use client";

import { useStoriesStore } from "@/lib/stores/stories-store";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import StoriesCarousel from "./StoriesCarousel";

export default function StoryViewer() {
	const { isOpen, openViewer, closeViewer } = useStoriesStore();

	function onOpenChange(e: boolean) {
		if (e) openViewer(0);
		else closeViewer();
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-screen h-screen w-screen rounded-none border-none p-0 outline-none max-w-screen max-h-screen ">
				<DialogTitle hidden>Instagram Stories</DialogTitle>
				<StoriesCarousel closeContainer={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}
