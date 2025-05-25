import { STORY_TIMER_IN_SECONDS } from "@/lib/constants";
import { useStoriesStore } from "@/lib/stores/stories-store";
import { cn } from "@/lib/utils";
import { UserStories } from "@/types/stories";
import { Pause, Play, X } from "lucide-react";
import Image from "next/image";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

export default function StoriesCarousel({
	closeContainer,
}: {
	closeContainer: () => void;
}) {
	const stories = useStoriesStore((state) => state.data);

	const activeIndex = useStoriesStore((state) => state.activeIndex);
	const setActiveIndex = useStoriesStore((state) => state.setActiveIndex);

	function goToNextUser() {
		if (activeIndex === stories.length - 1) {
			closeContainer();
		} else {
			setActiveIndex(Math.min(activeIndex + 1, stories.length - 1));
		}
	}

	function goToPrevUser() {
		if (activeIndex === 0) closeContainer();
		else setActiveIndex(Math.max(activeIndex - 1, 0));
	}

	const activeStory = stories[activeIndex];

	return (
		<div className="inset-0 h-screen w-screen">
			<StoryCard
				userStory={activeStory}
				defaultCurrentIndex={0}
				goToNextUser={goToNextUser}
				goToPrevUser={goToPrevUser}
				closeContainer={closeContainer}
				key={activeStory.userId}
			/>
		</div>
	);
}

function StoryCard({
	userStory,
	defaultCurrentIndex,
	goToNextUser,
	goToPrevUser,
	closeContainer,
}: {
	userStory: UserStories;
	defaultCurrentIndex: number;
	goToNextUser: () => void;
	goToPrevUser: () => void;
	closeContainer: () => void;
}) {
	const [currentIndex, setCurrentIndex] = useState(defaultCurrentIndex ?? 0);
	const [progress, setProgress] = useState(0);

	const [isPaused, setIsPaused] = useState(false);

	const numOfStories = userStory.stories.length ?? 0;

	function goToNext() {
		if (currentIndex === numOfStories - 1) {
			goToNextUser();
			setCurrentIndex(0);
		} else {
			setCurrentIndex((prev) => prev + 1);
			setProgress(0);
			setIsPaused(false);
		}
	}

	function goToPrev() {
		if (currentIndex === 0) {
			goToPrevUser();
			setCurrentIndex(0);
		} else {
			setCurrentIndex((prev) => prev - 1);
			setProgress(0);
			setIsPaused(false);
		}
	}

	// useEffect(() => {
	//     setCurrentIndex(defaultCurrentIndex);
	// }, [userStory])

	if (!userStory.stories[currentIndex]) return null;

	return (
		<div className="w-full h-full relative">
			<Image
				src={userStory.stories[currentIndex].imageUrl}
				alt={userStory.username}
				className="w-full h-full object-cover"
				width={500}
				height={500}
				quality={100}
				onClick={() => setIsPaused((prev) => !prev)}
			/>

			<div className="absolute top-0 left-0 right-0 z-[1]">
				<div className="flex flex-col p-4 gap-4">
					<ProgressBar
						onComplete={goToNextUser}
						count={numOfStories}
						isPaused={isPaused}
						currentIndex={currentIndex}
						progress={progress}
						setCurrentIndex={setCurrentIndex}
						setProgress={setProgress}
					/>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Image
								src={userStory.userAvatar}
								alt={userStory.username}
								className="w-10 h-10 rounded-full object-cover"
								width={40}
								height={40}
							/>

							<div className="text-white font-bold">{userStory.username}</div>
						</div>

						<div className="flex items-center gap-[2px]">
							<button
								className="p-2 flex items-center justify-center"
								onClick={() => setIsPaused((prev) => !prev)}
							>
								{isPaused ? (
									<Play color="white" strokeWidth={2} fill="white" />
								) : (
									<Pause color="white" strokeWidth={2} fill="white" />
								)}
							</button>

							<button
								className="p-2 flex items-center justify-center"
								onClick={closeContainer}
							>
								<X color="white" strokeWidth={3} fill="white" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Area Click handles */}

			<button
				className="absolute z-[1] top-[80px] bottom-0 left-0 w-[60px] bg-transparent"
				onClick={goToPrev}
			/>

			<button
				className="absolute z-[1] top-[80px] bottom-0 right-0 w-[60px] bg-transparent"
				onClick={goToNext}
			/>
		</div>
	);
}

function ProgressBar({
	onComplete,
	count,
	isPaused: isPausedProp,
	currentIndex,

	progress,
	setProgress,
	setCurrentIndex,
}: {
	onComplete: () => void;
	count: number;
	isPaused: boolean;
	currentIndex: number;

	progress: number;

	setCurrentIndex: Dispatch<SetStateAction<number>>;
	setProgress: Dispatch<SetStateAction<number>>;
}) {
	const requestRef = useRef<number | null>(null);
	const previousTimeRef = useRef<number | null>(null);

	const [isPaused, setIsPaused] = useState(false);

	const animate = useCallback(
		(time: number) => {
			if (previousTimeRef.current !== null && !isPaused) {
				const deltaTime = time - previousTimeRef.current;
				setProgress((prevProgress) => {
					const newProgress =
						prevProgress + (deltaTime / (STORY_TIMER_IN_SECONDS * 1000)) * 100;

					if (newProgress >= 100) {
						setCurrentIndex((prevIndex) => {
							if (prevIndex === count - 1) {
								onComplete();
								if (requestRef.current)
									cancelAnimationFrame(requestRef.current);
								return count - 1;
							}

							return (prevIndex + 1) % count;
						});
						return 0;
					}
					return newProgress;
				});
			}
			previousTimeRef.current = time;
			requestRef.current = requestAnimationFrame(animate);
		},
		[isPaused, count]
	);

	const startAnimation = useCallback(() => {
		previousTimeRef.current = null;
		cancelAnimation();
		requestRef.current = requestAnimationFrame(animate);
	}, [animate]);

	function cancelAnimation() {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current);
		}
	}

	useEffect(() => {
		setIsPaused(isPausedProp);

		if (!isPausedProp) {
			startAnimation();
		}
	}, [isPausedProp, startAnimation]);

	useEffect(() => {
		// startAnimation();

		const handleVisibilityChange = () => {
			if (document.hidden) {
				setIsPaused(true);
				if (requestRef.current) {
					cancelAnimationFrame(requestRef.current);
				}
			} else {
				if (!isPausedProp) {
					setIsPaused(false);
					startAnimation();
				}
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [startAnimation, isPausedProp]);

	const handleProgressClick = (index: number) => {
		setCurrentIndex(index);
		setProgress(0);
		startAnimation();
	};

	return (
		<div className="flex justify-center gap-[6px]">
			{Array.from({ length: count }).map((_, index) => (
				<button
					key={index}
					onClick={(e) => {
						e.stopPropagation();
						handleProgressClick(index);
					}}
					className="h-[4px] overflow-hidden rounded-[32px] bg-white/40 transition-none"
					aria-label={`Go to story ${index + 1}`}
					style={{ width: `${100 / count}%` }}
				>
					<div
						className={cn("h-full w-0 bg-white")}
						style={{
							width: `${
								index === currentIndex
									? progress
									: index < currentIndex
									? 100
									: 0
							}%`,
							// transition: index === currentIndex ? "none" : "width 0.3s linear",
						}}
					/>
				</button>
			))}
		</div>
	);
}
