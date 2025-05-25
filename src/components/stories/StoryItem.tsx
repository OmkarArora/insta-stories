import { UserStories } from "@/types/stories";
import React from "react";
import { motion } from "motion/react";

interface StoryItemProps {
	userStory: UserStories;
	index: number;
	onPress: (index: number) => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ userStory, index, onPress }) => {
	const { username, userAvatar, viewed } = userStory;

	return (
		<motion.div
			className="flex flex-col items-center mx-2 cursor-pointer"
			whileTap={{ scale: 0.95 }}
			onClick={() => onPress(index)}
		>
			<div
				className={`relative w-16 h-16 rounded-full ${
					viewed ? "border-2 border-gray-300" : "p-[2px]"
				}`}
			>
				{!viewed && (
					<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500"></div>
				)}
				<div
					className={`relative ${
						viewed
							? "w-full h-full"
							: "w-[calc(100%-4px)] h-[calc(100%-4px)] m-[2px]"
					} rounded-full overflow-hidden`}
				>
					<img
						src={userAvatar}
						alt={username}
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
			<p className="mt-1 text-xs text-center truncate w-16">{username}</p>
		</motion.div>
	);
};

export default StoryItem;
