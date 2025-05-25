export interface Story {
	id: string;
	username: string;
	userAvatar: string;
	imageUrl: string;
	viewed: boolean;
}

export interface UserStories {
	userId: string;
	username: string;
	userAvatar: string;
	stories: Story[];
	viewed: boolean;
}
