<script lang="ts">
	import CalendarContainer from '@/components/calendar/CalendarContainer.svelte';
	let { children } = $props();
</script>

<main>
	{@render children()}
	<CalendarContainer />
</main>
