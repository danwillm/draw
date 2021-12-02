<script lang='ts'>
	import Fa from 'svelte-fa';
	import { faPen } from '@fortawesome/free-solid-svg-icons';
	import { ColouredPen, Pen } from '../../types/canvas';

	let pens: Array<Pen> = [new ColouredPen('black'), new ColouredPen('red'), new ColouredPen('green'), new ColouredPen('orange'), new ColouredPen('purple')];
	let selected = 0;

	export let update: (pen: Pen) => {};
</script>

<ul class='flex mt-2'>
	<li class='mr-5'>
		Path/To/Board
	</li>
	{#each pens as pen, i}
		<li class='mr-3 border w-10 h-10 flex justify-center {selected === i ? "bg-gray-200" : ""}'
				on:click={() => update(pen)}
				on:click={() => selected = i}
		>
			<Fa icon={faPen} rotate={-45} scale={1.5} color={pen.getColour()}
					class=' transition transition-transform {selected === i ? "translate-y-2" : ""}' />
		</li>
	{/each}
</ul>