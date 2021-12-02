import pkg from 'paper';

const { paper } = pkg;

export interface StrokeOptions {
	colour: string;
}


//Pointer position relative to the canvas
export interface Position {
	x: number;
	y: number;
}

export interface PenSegment {
	x: number;
	y: number;
}

export class CanvasManager {
	private canvas_: HTMLCanvasElement;
	private resolution_: number;
	private pos: Position;

	constructor(canvas: HTMLCanvasElement) {
		this.resolution_ = 1;
		this.canvas_ = canvas;
		this.pos = {
			x: 0,
			y: 0
		};
		window.addEventListener('resize', this.fitToWindow);
	}

	fitToWindow() {
		let marginX = 10;
		let marginY = 10;

		let heightCss = window.innerHeight - marginY;
		let heightCanvas = heightCss * this.resolution_;
		let widthCss = window.innerWidth - marginX;
		let widthCanvas = widthCss * this.resolution_;

		// resize current canvas
		this.canvas_.style.height = heightCss + 'px';
		this.canvas_.style.width = widthCss + 'px';
		this.canvas_.width = widthCanvas;
		this.canvas_.height = heightCanvas;

		this.pos.x = this.canvas_.offsetLeft;
		this.pos.y = this.canvas_.offsetTop;
	}

	addEventListener(name: string, callback: EventListenerOrEventListenerObject) {
		this.canvas_.addEventListener(name, callback);
	}

	getPointerPosition(event: PointerEvent): Position {
		return {
			x: (event.pageX - this.pos.x) * this.resolution_,
			y: (event.pageY - this.pos.y) * this.resolution_
		};
	}
}

export class Board {
	private paper_: paper.PaperScope;
	canvas: CanvasManager;
	private pen_: Pen;

	private isStroking_: boolean;
	private currentPath_: paper.Path;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = new CanvasManager(canvas);
		this.canvas.fitToWindow();
		this.canvas.addEventListener('contextmenu', e => e.preventDefault());
		this.canvas.addEventListener('pointerdown', e => this.createPath(e));
		this.canvas.addEventListener('pointermove', e => this.updatePath(e));
		this.canvas.addEventListener('pointerup', e => this.completePath(e));

		this.paper_ = new paper.PaperScope();
		this.paper_.setup(canvas);

		this.pen_ = new ColouredPen('black');
	}

	setPen(pen: Pen) : void {
		this.pen_ = pen;
	}

	private createPath(event) {
		let options = this.pen_.getOptions();
		this.currentPath_ = new paper.Path({
			segments: [],
			strokeColor: options.colour
		});

		this.isStroking_ = true;
	}

	private updatePath(event) {
		if (!this.isStroking_) return;
		this.pen_.stroke(event, this.currentPath_, this);
	}

	private completePath(event) {
		console.log(this.currentPath_.segments);
		// When the mouse is released, simplify it:
		this.currentPath_.simplify(10);
		this.isStroking_ = false;
	}

}

interface PenOptions {
	colour: string;
}

export abstract class Pen {
	protected constructor() {
	}

	abstract getOptions(): PenOptions;
	abstract getColour(): string;

	abstract stroke(event: PointerEvent, path: paper.Path, board: Board): void;
}

export class ColouredPen extends Pen {
	private readonly colour_: string;

	constructor(colour: string) {
		super();
		this.colour_ = colour;
	}

	getOptions(): PenOptions {
		return {
			colour: this.colour_
		};
	}

	getColour(): string {
		return this.colour_;
	}

	stroke(event: PointerEvent, path: paper.Path, board: Board): void {
		let point = board.canvas.getPointerPosition(event);

		path.add([point.x, point.y]);
	}

}