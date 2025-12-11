<script>
	import CalendarOptions from '@/components/calendar/CalendarOptions.svelte';
	import CalendarDisplay from '@/components/calendar/CalendarDisplay.svelte';
</script>

<section id="crear" class="h-svh w-full p-2 pt-18 squircle">
	<div class="grid size-full grid-cols-[350px_1fr] gap-2">
		<CalendarOptions />
		<CalendarDisplay />
	</div>
</section>
