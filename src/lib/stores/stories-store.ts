import { storiesData } from "@/data/stories-data";
import { UserStories } from "@/types/stories";
import { create } from "zustand";

type StoriesStore = {
	isOpen: boolean;
	data: UserStories[];

	activeIndex: number;
	setActiveIndex: (index: number) => void;

	initializeData: (data: UserStories[]) => void;
	openViewer: (activeIndex: number) => void;
	closeViewer: () => void;
};

export const useStoriesStore = create<StoriesStore>()((set) => ({
	isOpen: false,
	data: storiesData,

	activeIndex: 0,
	setActiveIndex: (index) => set({ activeIndex: index }),

	initializeData: (data) => set({ data }),
	openViewer: (activeIndex) =>
		set({
			isOpen: true,
			activeIndex,
		}),
	closeViewer: () => set({ isOpen: false, activeIndex: 0 }),
}));
