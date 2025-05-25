import { storiesData } from "@/data/stories-data";
import { UserStories } from "@/types/stories";
import { create } from "zustand";

type StoriesStore = {
	isOpen: boolean;
	data: UserStories[];
	defaultActiveIndex: number;

	initializeData: (data: UserStories[]) => void;
	openViewer: (defaultActiveIndex: number) => void;
	closeViewer: () => void;
};

export const useStoriesStore = create<StoriesStore>()((set) => ({
	isOpen: false,
	data: storiesData,
	defaultActiveIndex: 0,

	initializeData: (data) => set({ data }),
	openViewer: (defaultActiveIndex) =>
		set({
			isOpen: true,
			defaultActiveIndex,
		}),
	closeViewer: () => set({ isOpen: false, defaultActiveIndex: 0 }),
}));
