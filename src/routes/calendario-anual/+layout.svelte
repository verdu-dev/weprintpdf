<script lang="ts">
	import CalendarContainer from '@/components/calendar/CalendarContainer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		const s1 = document.createElement('script');
		s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
		document.body.appendChild(s1);

		const s2 = document.createElement('script');
		s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
		document.body.appendChild(s2);
	});
</script>

<main>
	{@render children()}
	<CalendarContainer />
</main>
