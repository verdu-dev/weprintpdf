<script lang="ts">
	import type { LayoutProps } from './$types';
	import CalendarContainer from '@/components/calendar/CalendarContainer.svelte';

	let { children }: LayoutProps = $props();
</script>

<main>
	{@render children()}
	<CalendarContainer />
</main>
