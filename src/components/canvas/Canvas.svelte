<script lang="ts">

	import { onMount } from 'svelte';
	import { Board, Pen } from '../../types/canvas';
	import CanvasSettings from './BoardSettings.svelte';

	const fitCanvasToContainer = (canvas) => {
		canvas.style.width ='100%';
		canvas.style.height='100%';
		// ...then set the internal size to match
		canvas.width  = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
	}

	let whiteboard : Board;

	onMount(() => {
		const canvas = document.getElementById('canvas-el') as HTMLCanvasElement;
		fitCanvasToContainer(canvas);

		whiteboard = new Board(canvas);
	});
</script>

<div class='h-full w-full'>
	<div class='flex flex-col h-full w-full'>
		<CanvasSettings update={(pen) => whiteboard.setPen(pen)} />
		<div class='h-full w-full'>
			<canvas style='touch-action: none' class='h-full w-full' id='canvas-el'>
				Your device doesn't support this.
			</canvas>
		</div>

	</div>

</div>