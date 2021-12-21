import React, {forwardRef, useCallback, useMemo, useRef, useState} from "react";
import "../styles/SwipeAction.scss";

interface IProps {
	action: React.ReactNode;
	children: React.ReactNode[];
	className?: string;
	touchTimeThreshold?: number;
	onAction: () => void;
}

function SwipeAction({
	action,
	children,
	className = "swipe",
	touchTimeThreshold = 150,
	onAction
}: IProps) {
	const [swipeX, setX] = useState(0);
	const actionRef = useRef(null);
	const touchesRef = useRef<React.Touch>();
	const touchStartTimeRef = useRef<number>(0);

	const handleSwipe = useCallback<React.TouchEventHandler<HTMLDivElement>>(
		e => {
			if (e.touches.length > 1) return;
			if (!touchesRef.current) {
				touchStartTimeRef.current = performance.now();
				touchesRef.current = e.touches[0];
				return;
			}
			const deltaX =
				e.changedTouches[0].clientX - touchesRef.current.clientX;
			setX(deltaX);
		},
		[setX]
	);

	const handleSwipeEnd = useCallback(() => {
		const touchTime = performance.now() - touchStartTimeRef.current;
		touchesRef.current = undefined;
		let actionWidth = 0;
		if (actionRef.current) {
			actionWidth = Number(
				getComputedStyle(actionRef.current).width.replace("px", "")
			);
		}
		if (touchTime < touchTimeThreshold && -swipeX > actionWidth) {
			onAction();
			setX(0);
		} else {
			if (-swipeX > actionWidth) setX(-actionWidth);
			else setX(0);
		}
	}, [setX, touchTimeThreshold, swipeX, onAction]);

	const createClassName = useCallback(
		(suffix: string) => {
			let classes = ["swipe"];
			if (className) {
				classes.push(...className.split(" "));
			}
			return classes.map(c => c + suffix).join(" ");
		},
		[className]
	);

	return (
		<div className={createClassName("-root")}>
			<div
				className={createClassName("-wrapper")}
				onTouchMove={handleSwipe}
				onTouchEnd={handleSwipeEnd}
				style={{transform: swipeX > 0 ? "" : `translateX(${swipeX}px)`}}
			>
				{children}
			</div>
			<div
				className={createClassName("-action")}
				ref={actionRef}
				onClick={onAction}
			>
				{action}
			</div>
		</div>
	);
}

export default SwipeAction;
