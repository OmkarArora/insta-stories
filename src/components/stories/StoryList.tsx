"use client";

import { useStoriesStore } from "@/lib/stores/stories-store";
import { motion } from "motion/react";
import StoryItem from "./StoryItem";

export default function StoryList() {
	const data = useStoriesStore((state) => state.data);
	const openViewer = useStoriesStore((state) => state.openViewer);

	const handleStoryPress = (index: number) => {
		openViewer(index);
	};

	return (
		<div className="w-full bg-white py-4 px-2 border-b border-gray-200">
			<motion.div
				className="flex overflow-x-auto scrollbar-hide"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{data.map((userStory, index) => (
					<StoryItem
						key={userStory.userId}
						userStory={userStory}
						index={index}
						onPress={handleStoryPress}
					/>
				))}
			</motion.div>
		</div>
	);
}
